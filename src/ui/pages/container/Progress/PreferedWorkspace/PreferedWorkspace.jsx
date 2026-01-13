import React, { useState, useEffect, useCallback } from "react";
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
import configs from "../../../../../config/config";

const PreferedWorkspace = () => {
  const [userData, setUserData] = useState(null);
  const [orgId, setOrgId] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [savedWorkspaces, setSavedWorkspaces] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [savedLoaded, setSavedLoaded] = useState(false);

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


  const fetchOrgId = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("shoonya_access_token");

      if (!token) {
        throw new Error("Authentication token missing. Please log in again.");
      }

      const res = await fetch(
        `${configs.BASE_URL_AUTO}//users/account/me/fetch/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `JWT ${token}`, 
          },
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("shoonya_access_token");
        throw new Error("Session expired. Redirecting to login...");
      }

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setUserData(data);


      const extractedOrgId = data?.organization?.id;

      if (extractedOrgId !== undefined && extractedOrgId !== null) {
        console.log("Successfully fetched orgId:", extractedOrgId);
        setOrgId(extractedOrgId);
      } else {
        console.warn("User has no associated organization.");
        setError("No organization found for this user.");
      }

    } catch (err) {
      console.error("Failed to fetch organization ID:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

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
    } finally {
      setSavedLoaded(true);   
    }
  };


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


  const merged = [
    ...savedWorkspaces,
    ...workspaces.filter(
      (ws) => !savedWorkspaces.some((s) => s.id === ws.id)
    ),
  ];

  const filteredWorkspaces = merged.filter((ws) =>
    ws.workspace_name.toLowerCase().includes(searchText.toLowerCase())
  );
  useEffect(() => {
    console.log("orgId:", orgId);
    console.log("workspaces:", workspaces);
    console.log("savedWorkspaces:", savedWorkspaces);
  }, [orgId, workspaces, savedWorkspaces]);


  useEffect(() => {
    fetchOrgId();
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (!orgId) return;
    fetchSaved();
  }, [orgId]);

  useEffect(() => {
    if (savedWorkspaces.length && workspaces.length && !saving) {
      setSelected(savedWorkspaces.map((ws) => ws.id));
    }
  }, [savedWorkspaces, workspaces]);

  useEffect(() => {
    if (
      orgId &&
      savedLoaded &&
      savedWorkspaces.length === 0 &&
      workspaces.length > 0 &&
      !saving
    ) {
      const allIds = workspaces.map((ws) => ws.id);
      setSelected(allIds);

      const autoSave = async () => {
        try {
          const token = localStorage.getItem("shoonya_access_token");

          const payload = {
            [orgId]: workspaces.map((ws) => ({
              id: ws.id,
              workspace_name: ws.workspace_name,
            })),
          };

          await fetch(
            `${configs.BASE_URL_AUTO}/users/account/save_prefered_workspace/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${token}`,
              },
              body: JSON.stringify(payload),
            }
          );

          fetchSaved();
        } catch (err) {
          console.error("Auto-save error:", err);
        }
      };

      autoSave();
    }
  }, [orgId, workspaces, savedLoaded, savedWorkspaces]);


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
