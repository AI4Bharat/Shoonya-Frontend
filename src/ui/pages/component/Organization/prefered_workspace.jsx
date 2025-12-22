import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Checkbox,
  ListItemText,
  Tooltip,
  Divider,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import configs from "../../../../config/config";

const PreferedWorkspace = ({ orgId }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [savedWorkspaces, setSavedWorkspaces] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 368,
        width: 300,
        overflow: "hidden",
      },
    },
    MenuListProps: {
      style: {
        overflowX: "hidden",
        whiteSpace: "normal",
      },
    },
  };

  /* ---------------- FETCH WORKSPACES ---------------- */
  const fetchWorkspaces = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("shoonya_access_token");
      const res = await fetch(
        `${configs.BASE_URL_AUTO}/workspaces/prefered_workspaces/`,
        { headers: { Authorization: `JWT ${token}` } }
      );
      const data = await res.json();
      setWorkspaces(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("workspace fetch error:", err);
    }
    setLoading(false);
  };

  const fetchSaved = async () => {
    try {
      const token = localStorage.getItem("shoonya_access_token");
      const res = await fetch(
        `${configs.BASE_URL_AUTO}/users/account/get_prefered_workspace/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        }
      );
      const data = await res.json();
      const prefs = data?.prefered_workspace || {};
      setSavedWorkspaces(prefs[orgId] || []);
    } catch (err) {
      console.error("fetch saved error:", err);
    }
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    if (selected.length === 0) {
      setSnackbarMessage("Please select at least one workspace");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("shoonya_access_token");

      const payload = {
        [orgId]: workspaces
          .filter((ws) => selected.includes(ws.id))
          .map((ws) => ({
            id: ws.id,
            workspace_name: ws.workspace_name,
          })),
      };

      const response = await fetch(
        `${configs.BASE_URL_AUTO}/users/account/save_update_prefered_workspace/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Save failed");
      }

      setOpen(false);
      setSearchText("");
      fetchSaved();

      setSnackbarMessage("Workspaces saved successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Failed to save workspaces");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
    setSaving(false);
  };

  /* ---------------- SELECTION HANDLERS ---------------- */
  const handleToggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAll = () => {
    if (selected.length === workspaces.length) {
      setSelected([]);
    } else {
      setSelected(workspaces.map((ws) => ws.id));
    }
  };

  /* ---------------- MERGE & FILTER ---------------- */
  const merged = [
    ...savedWorkspaces,
    ...workspaces.filter(
      (ws) => !savedWorkspaces.some((s) => s.id === ws.id)
    ),
  ];

  const filteredWorkspaces = merged.filter((ws) =>
    ws.workspace_name.toLowerCase().includes(searchText.toLowerCase())
  );

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    fetchWorkspaces();
    fetchSaved();
  }, [orgId]);

  useEffect(() => {
    if (savedWorkspaces.length && workspaces.length && !saving) {
      setSelected(savedWorkspaces.map((ws) => ws.id));
    }
  }, [savedWorkspaces, workspaces]);

  return (
    <div style={{ width: 350, marginTop: 14 }}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {loading ? (
        <CircularProgress />
      ) : (
        <FormControl fullWidth>
          <InputLabel id="workspace-label" shrink sx={{ fontSize: "16px" }}>
            Preferred Workspaces
          </InputLabel>

          <Select
            multiple
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => {
              setOpen(false);
              setSearchText("");
            }}
            sx={{
              "& .MuiSelect-select.MuiInputBase-input": {
                padding: "10px 8px",
                height: "auto !important",
                minHeight: "1.2em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }
            }}
            label="Preferred Workspaces"
            labelId="workspace-label"
            value={selected.length === 0 ? ["ALL"] : selected}
            MenuProps={MenuProps}
            renderValue={() =>
              selected.length === workspaces.length
                ? "All Workspaces"
                : merged
                  .filter((ws) => selected.includes(ws.id))
                  .map((ws) => ws.workspace_name)
                  .join(", ")
            }
          >
            {/* ALL WORKSPACES*/}
            <MenuItem onClick={handleAll} sx={{
              mt: 0,
              p: 0,
            }}>
              <Checkbox checked={selected.length === workspaces.length} />
              <ListItemText primary="All Workspaces" primaryTypographyProps={{
                fontSize: 14,
                lineHeight: "10px",
              }}
                sx={{
                  minHeight: 10,
                  py: 0.2,
                }} />
            </MenuItem>

            <Divider sx={{ my: 0.1 }} />

            {/* SEARCH */}
            <MenuItem disableRipple sx={{
              py: 0.1,
            }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search workspace..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                InputProps={{
                  sx: {
                    height: 32,
                    fontSize: 14,
                  },
                }}
              />
            </MenuItem>

            <Divider sx={{ my: 0.1 }} />

            {/* LIST */}
            <div style={{ maxHeight: 200, overflowY: "auto" }}>
              {filteredWorkspaces.map((ws) => (
                <MenuItem key={ws.id} onClick={() => handleToggle(ws.id)} sx={{
                  py: 0.1,
                }}>
                  <Checkbox checked={selected.includes(ws.id)} />
                  <Tooltip title={ws.workspace_name} arrow PopperProps={{ disablePortal: true }}>
                    <ListItemText
                      primary={ws.workspace_name}

                      sx={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        maxWidth: 220,
                      }}
                    />
                  </Tooltip>
                </MenuItem>
              ))}
            </div>

            {/* SAVE */}
            <div style={{
              position: "sticky",
              bottom: 0,
              background: "#fff",
              padding: "4px",
              borderTop: "1px solid #eee",
            }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </Select>
        </FormControl>
      )}
    </div>
  );
};

export default PreferedWorkspace;
