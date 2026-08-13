import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import themeDefault from "../../../theme/theme";
import DatasetStyle from "../../../styles/Dataset";
import Button from "../../component/common/Button";
import OutlinedTextField from "../../component/common/OutlinedTextField";
import Spinner from "../../component/common/Spinner";
import CustomizedSnackbars from "../../component/common/Snackbar";
import config from "../../../../config/config";
import ENDPOINTS from "../../../../config/apiendpoint";

const STEPS = ["Upload CSV", "Configure Dataset", "Processing", "Create Project"];
const CATEGORIES = ["Read", "Extempore"];
const POLL_INTERVAL_MS = 5000;
const MAX_POLL_INTERVAL_MS = 30000;

const authHeaders = () => ({
  Authorization: `JWT ${localStorage.getItem("shoonya_access_token")}`,
});

const CreateDatasetAndProject = () => {
  const classes = DatasetStyle();
  const navigate = useNavigate();
  const loggedInUserData = useSelector((state) => state.fetchLoggedInUserData.data);

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", variant: "" });

  // Step 0: CSV upload + validation
  const [csvFile, setCsvFile] = useState(null);
  const [validation, setValidation] = useState(null);

  // Step 1: dataset configuration
  const [datasetName, setDatasetName] = useState("");
  const [useExistingDataset, setUseExistingDataset] = useState(false);
  const [existingInstanceId, setExistingInstanceId] = useState("");
  const [existingInstances, setExistingInstances] = useState([]);
  const [deduplicate, setDeduplicate] = useState(false);
  const organisationId = loggedInUserData?.organization?.id || 1;

  // Step 2: phase 1 pipeline progress
  const [taskId, setTaskId] = useState(null);
  const [pipelineState, setPipelineState] = useState(null);
  const [pipelineResult, setPipelineResult] = useState(null);
  const [pipelineError, setPipelineError] = useState(null);
  const [pipelineTransientNotice, setPipelineTransientNotice] = useState(null);
  const [pipelineStartedAt, setPipelineStartedAt] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Step 3: vendor/language/category form + phase 2 result
  const [workspaces, setWorkspaces] = useState([]);
  const [workspaceId, setWorkspaceId] = useState("");
  const [category, setCategory] = useState("");
  const [projectResult, setProjectResult] = useState(null);

  const showError = (message) => setSnackbar({ open: true, message, variant: "error" });

  const baseUrl = () => config.BASE_URL_AUTO;

  const fetchExistingInstances = async () => {
    try {
      const res = await fetch(
        `${baseUrl()}${ENDPOINTS.getDatasets}instances/?dataset_type=SpeechConversation`,
        { headers: authHeaders() }
      );
      if (!res.ok) throw new Error("Failed to fetch existing datasets");
      const data = await res.json();
      setExistingInstances(Array.isArray(data) ? data : []);
    } catch (err) {
      showError(err.message || "Failed to fetch existing datasets");
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const res = await fetch(
        `${baseUrl()}${ENDPOINTS.getWorkspaces}user-workspaces/loggedin-user-workspaces/`,
        { headers: authHeaders() }
      );
      if (!res.ok) throw new Error("Failed to fetch workspaces");
      const data = await res.json();
      setWorkspaces(Array.isArray(data) ? data : []);
    } catch (err) {
      showError(err.message || "Failed to fetch workspaces");
    }
  };

  useEffect(() => {
    fetchExistingInstances();
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (validation?.languages?.length === 1 && !datasetName) {
      setDatasetName(`${validation.languages[0]}_JT`);
    }
  }, [validation]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Step 0: upload + validate ----
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    setValidation(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("input_csv", file);
      const res = await fetch(
        `${baseUrl()}${ENDPOINTS.getDatasets}instances/validate_pipeline_csv/`,
        { method: "POST", headers: authHeaders(), body: formData }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Validation failed");
      setValidation(data);
    } catch (err) {
      showError(err.message || "Failed to validate CSV");
    } finally {
      setLoading(false);
    }
  };

  const goToConfigStep = () => setActiveStep(1);

  // ---- Step 1: start phase 1 pipeline ----
  const handleStartPipeline = async () => {
    if (!csvFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("input_csv", csvFile);
      formData.append("organisation_id", organisationId);
      formData.append("deduplicate", deduplicate ? "true" : "false");
      if (useExistingDataset && existingInstanceId) {
        formData.append("existing_instance_id", existingInstanceId);
      } else {
        formData.append("dataset_name", datasetName);
      }
      const res = await fetch(
        `${baseUrl()}${ENDPOINTS.getDatasets}instances/start_pipeline/`,
        { method: "POST", headers: authHeaders(), body: formData }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to start pipeline");
      setTaskId(data.task_id);
      setPipelineState(null);
      setPipelineResult(null);
      setPipelineError(null);
      setPipelineTransientNotice(null);
      setPipelineStartedAt(Date.now());
      setActiveStep(2);
    } catch (err) {
      showError(err.message || "Failed to start pipeline");
    } finally {
      setLoading(false);
    }
  };

  // ---- Step 2: poll phase 1 progress ----
  useEffect(() => {
    if (!taskId || activeStep !== 2) return;
    let cancelled = false;
    let currentInterval = POLL_INTERVAL_MS;

    const scheduleNext = (interval) => {
      currentInterval = Math.min(interval, MAX_POLL_INTERVAL_MS);
      setTimeout(poll, currentInterval);
    };

    const poll = async () => {
      try {
        const res = await fetch(
          `${baseUrl()}${ENDPOINTS.getDatasets}instances/pipeline_progress/?task_id=${taskId}`,
          { headers: authHeaders() }
        );
        const data = await res.json();
        if (cancelled) return;

        // Transient backend/DB hiccup (still JSON, non-2xx) — back off and
        // keep polling instead of stopping; don't overwrite the last-known
        // good progress state with this transient blip.
        if (!res.ok && data.state === "UNKNOWN") {
          setPipelineTransientNotice(data.transient_error);
          scheduleNext(currentInterval * 2);
          return;
        }

        setPipelineTransientNotice(null);
        setPipelineState(data);
        if (data.state === "SUCCESS") {
          setPipelineResult(data.result);
          if (data.result?.categories_present?.length === 1) {
            setCategory(data.result.categories_present[0]);
          }
        } else if (data.state === "FAILURE") {
          setPipelineError(data.error || "Pipeline failed");
        } else {
          // Reset backoff once we get a normal response.
          scheduleNext(POLL_INTERVAL_MS);
        }
      } catch (err) {
        // Network-level failure (server unreachable) — back off and retry
        // rather than giving up permanently.
        if (cancelled) return;
        setPipelineTransientNotice(err.message || "Could not reach the server");
        scheduleNext(currentInterval * 2);
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [taskId, activeStep]);

  // ---- Step 2: live elapsed-time ticker, purely for display ----
  useEffect(() => {
    if (!pipelineStartedAt || activeStep !== 2) return;
    const tick = () => setElapsedSeconds(Math.floor((Date.now() - pipelineStartedAt) / 1000));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [pipelineStartedAt, activeStep]);

  const formatElapsed = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}m ${s}s`;
  };

  const goToProjectStep = () => setActiveStep(3);

  // ---- Step 3: create project(s) for chosen vendor/category ----
  const handleCreateProjects = async () => {
    if (!pipelineResult || !workspaceId || !category) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${baseUrl()}${ENDPOINTS.getDatasets}instances/create_pipeline_projects/`,
        {
          method: "POST",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({
            instance_id: pipelineResult.dataset_instance_id,
            workspace_id: workspaceId,
            category,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create project(s)");
      setProjectResult(data);
    } catch (err) {
      showError(err.message || "Failed to create project(s)");
    } finally {
      setLoading(false);
    }
  };

  const stepDetail = (name) =>
    pipelineState?.steps?.find((s) => s.name === name);

  const audioStep = stepDetail("audio_upload");
  const failedUploads = audioStep?.failures || pipelineResult?.failed_uploads || [];
  const generatedCsv = stepDetail("generate_csv")?.csv_content || pipelineResult?.generated_csv;

  const downloadGeneratedCsv = () => {
    if (!generatedCsv) return;
    const blob = new Blob([generatedCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${datasetName || "shoonya"}_dataset.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderStepUpload = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upload Input CSV
      </Typography>
      <label htmlFor="pipeline-input-csv">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="pipeline-input-csv"
        />
        <Button label={csvFile ? csvFile.name : "Choose CSV File"} component="span" />
      </label>

      {validation && (
        <Box sx={{ mt: 3 }}>
          {validation.valid ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              CSV looks valid — {validation.row_count} rows detected.
            </Alert>
          ) : (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography fontWeight="bold">Validation errors:</Typography>
              <ul>
                {validation.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </Alert>
          )}
          <Typography variant="body2">
            Language: <b>{validation.languages.join(", ") || "-"}</b> &nbsp;|&nbsp;
            Types: <b>{validation.types.join(", ") || "-"}</b> &nbsp;|&nbsp;
            Parts: <b>{validation.parts.join(", ") || "-"}</b>
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              label="Next"
              disabled={!validation.valid}
              onClick={goToConfigStep}
            />
          </Box>
        </Box>
      )}
    </Card>
  );

  const renderStepConfig = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Configure Dataset
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <label>
            <input
              type="checkbox"
              checked={useExistingDataset}
              onChange={(e) => setUseExistingDataset(e.target.checked)}
            />
            &nbsp;Add to an existing dataset instead of creating a new one
          </label>
        </Grid>

        {useExistingDataset ? (
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Existing Dataset</InputLabel>
              <Select
                value={existingInstanceId}
                label="Existing Dataset"
                onChange={(e) => setExistingInstanceId(e.target.value)}
              >
                {existingInstances.map((inst) => (
                  <MenuItem key={inst.instance_id} value={inst.instance_id}>
                    {inst.instance_name} (#{inst.instance_id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Typography gutterBottom>Dataset Name</Typography>
            <OutlinedTextField
              fullWidth
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <label>
            <input
              type="checkbox"
              checked={deduplicate}
              onChange={(e) => setDeduplicate(e.target.checked)}
            />
            &nbsp;Delete Duplicate Records
          </label>
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button
            label="Start Pipeline"
            disabled={
              (!useExistingDataset && !datasetName) ||
              (useExistingDataset && !existingInstanceId)
            }
            onClick={handleStartPipeline}
          />
        </Grid>
      </Grid>
    </Card>
  );

  const renderProgressRow = (label, stepKey) => {
    const detail = stepDetail(stepKey);
    if (!detail) return null;
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          {label}: <b>{detail.status}</b>
        </Typography>
        {stepKey === "audio_upload" && detail.progress && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <LinearProgress
              variant="determinate"
              value={
                detail.progress.total
                  ? (detail.progress.done / detail.progress.total) * 100
                  : 0
              }
              sx={{ flexGrow: 1 }}
            />
            <Typography variant="body2">
              {detail.progress.done}/{detail.progress.total}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const renderStepProcessing = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Processing
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Running for {formatElapsed(elapsedSeconds)} — status: <b>{pipelineState?.state || "PENDING"}</b>
      </Typography>

      {pipelineTransientNotice && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Having trouble reaching the server ({pipelineTransientNotice}) — retrying automatically.
        </Alert>
      )}

      {!pipelineState?.steps?.length && !pipelineError && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Waiting for the pipeline to report its first step (CSV validation) — this is
          usually within a few seconds. If it stays here for several minutes, the
          Celery worker likely isn't picking up the task (check the worker terminal).
        </Alert>
      )}

      {pipelineError && <Alert severity="error">{pipelineError}</Alert>}

      {!pipelineError && (
        <>
          {renderProgressRow("Validate CSV", "validate_csv")}
          {renderProgressRow("Upload Audio", "audio_upload")}
          {renderProgressRow("Generate CSV", "generate_csv")}
          {generatedCsv && (
            <Box sx={{ mb: 2 }}>
              <Button label="Download Generated CSV" onClick={downloadGeneratedCsv} />
            </Box>
          )}
          {renderProgressRow("Create/Reuse Dataset", "create_dataset")}
          {renderProgressRow("Upload CSV to Dataset", "upload_csv")}
        </>
      )}

      {failedUploads.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="error">
            Failed Uploads ({failedUploads.length})
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Audio Link</TableCell>
                <TableCell>Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {failedUploads.map((f, i) => (
                <TableRow key={i}>
                  <TableCell>{f.audio_link}</TableCell>
                  <TableCell>{f.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {pipelineResult && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Dataset <b>{pipelineResult.dataset_instance_name}</b> (#
            {pipelineResult.dataset_instance_id}) is ready —{" "}
            {pipelineResult.uploaded_count}/{pipelineResult.total_input_rows} rows
            uploaded.
          </Alert>
          <Button label="Next: Create Project" onClick={goToProjectStep} />
        </Box>
      )}
    </Card>
  );

  const renderStepProject = () => (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create Project
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Dataset: <b>{pipelineResult?.dataset_instance_name}</b> &nbsp;|&nbsp; Language:{" "}
        <b>{pipelineResult?.language}</b>
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Vendor (Workspace)</InputLabel>
            <Select
              value={workspaceId}
              label="Vendor (Workspace)"
              onChange={(e) => setWorkspaceId(e.target.value)}
            >
              {workspaces.map((ws) => (
                <MenuItem key={ws.id} value={ws.id}>
                  {ws.workspace_name || ws.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sx={{ mt: 1 }}>
          <Button
            label="Create Project(s)"
            disabled={!workspaceId || !category}
            onClick={handleCreateProjects}
          />
        </Grid>
      </Grid>

      {projectResult && (
        <Box sx={{ mt: 3 }}>
          {projectResult.created_projects.length > 0 ? (
            <>
              <Alert severity="success" sx={{ mb: 2 }}>
                Created {projectResult.created_projects.length} project(s).
              </Alert>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Part</TableCell>
                    <TableCell>Batch</TableCell>
                    <TableCell>Task Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectResult.created_projects.map((p) => (
                    <TableRow key={p.project_id}>
                      <TableCell>{p.title}</TableCell>
                      <TableCell>{p.part}</TableCell>
                      <TableCell>{p.batch_number}</TableCell>
                      <TableCell>{p.task_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <Alert severity="info">No project met its task-limit threshold yet.</Alert>
          )}

          {projectResult.skipped_groups.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">
                Waiting for more data (below task limit):
              </Typography>
              {projectResult.skipped_groups.map((g, i) => (
                <Chip
                  key={i}
                  sx={{ mr: 1, mt: 1 }}
                  label={`${g.domain}: ${g.unassigned_count}/${g.limit}`}
                />
              ))}
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <Button label="Done" onClick={() => navigate("/datasets")} />
          </Box>
        </Box>
      )}
    </Card>
  );

  return (
    <ThemeProvider theme={themeDefault}>
      {loading && <Spinner />}
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create Dataset & Project
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && renderStepUpload()}
        {activeStep === 1 && renderStepConfig()}
        {activeStep === 2 && renderStepProcessing()}
        {activeStep === 3 && renderStepProject()}

        <CustomizedSnackbars
          open={snackbar.open}
          handleClose={() => setSnackbar({ open: false, message: "", variant: "" })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          variant={snackbar.variant}
          message={snackbar.message}
        />
      </Box>
    </ThemeProvider>
  );
};

export default CreateDatasetAndProject;
