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
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import configs from "../../../../config/config";
import { useParams } from "react-router-dom";

const PreferedWorkspace = () => {
  const { orgId } = useParams();
  const [workspaces, setWorkspaces] = useState([]);
  const [savedWorkspaces, setSavedWorkspaces] = useState([]);
  const [selectedWorkspaces, setSelectedWorkspaces] = useState([]); // ✅ unified state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ✅ Fetch available workspaces
  const fetchWorkspaces = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("shoonya_access_token");
      const res = await fetch(`${configs.BASE_URL_AUTO}/workspaces/prefered_workspaces/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
      });
      const data = await res.json();
      setWorkspaces(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error fetching workspaces:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch saved preferred workspaces
  const fetchSavedWorkspace = async () => {
    try {
      const token = localStorage.getItem("shoonya_access_token");
      const res = await fetch(`${configs.BASE_URL_AUTO}/users/account/get_prefered_workspace/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
      });
      const data = await res.json();
      const prefs = data?.prefered_workspace || {};
      setSavedWorkspaces(prefs[orgId] || []);
    } catch (err) {
      console.error("Error fetching saved preferred workspace:", err);
    }
  };

  // ✅ Save newly selected workspaces (from Available)
  const handleSave = async () => {
    if (!orgId) return alert("Organization ID not found!");

    const newSelections = selectedWorkspaces.filter(
      (id) => !savedWorkspaces.some((s) => s.id === id)
    );

    if (newSelections.length === 0)
      return alert("Please select at least one new workspace to save.");

    setSaving(true);
    const token = localStorage.getItem("shoonya_access_token");
    const payload = {
      [orgId]: newSelections.map((id) => {
        const ws = workspaces.find((w) => w.id === id);
        return { id: ws.id, workspace_name: ws.workspace_name };
      }),
    };

    try {
      const res = await fetch(`${configs.BASE_URL_AUTO}/users/account/save_prefered_workspace/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify(payload),
      });
      await res.json();
      alert("Preferred workspace(s) saved successfully!");
      setSelectedWorkspaces([]);
      fetchSavedWorkspace();
    } catch (err) {
      console.error("Error saving preferred workspace:", err);
      alert("Failed to save workspace.");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Delete selected saved workspaces
  const handleDeleteSelected = async () => {
    const selectedSaved = selectedWorkspaces.filter((id) =>
      savedWorkspaces.some((s) => s.id === id)
    );
    if (selectedSaved.length === 0)
      return alert("Select saved workspaces to delete!");

    setDeleting(true);
    const token = localStorage.getItem("shoonya_access_token");

    try {
      const res = await fetch(`${configs.BASE_URL_AUTO}/users/account/delete_prefered_workspace/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({
          organization_id: orgId,
          workspace_ids: selectedSaved,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Selected saved workspaces deleted successfully!");
        setSelectedWorkspaces((prev) =>
          prev.filter((id) => !selectedSaved.includes(id))
        );
        fetchSavedWorkspace();
        fetchWorkspaces();
      } else {
        console.error("Delete failed:", data);
        alert(data.error || "Failed to delete saved workspace(s).");
      }
    } catch (err) {
      console.error("Error deleting saved workspace:", err);
      alert("Error deleting workspace(s).");
    } finally {
      setDeleting(false);
    }
  };

  const filteredWorkspaces = workspaces.filter(
    (ws) => !savedWorkspaces.some((saved) => saved.id === ws.id)
  );

  useEffect(() => {
    fetchWorkspaces();
    fetchSavedWorkspace();
  }, [orgId]);

  return (
    <div style={{ margin: "16px", marginTop: "30px" }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <FormControl fullWidth style={{ width: 450 }}>
          <InputLabel id="workspace-label">Preferred Workspaces</InputLabel>
          <Select
            labelId="workspace-label"
            multiple
            value={selectedWorkspaces}
            onChange={(e) => setSelectedWorkspaces(e.target.value)}
            renderValue={() => ""}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 500,
                  width: 460,
                  padding: "10px",
                },
              },
            }}
          >
            {/* Available Workspaces */}
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", ml: 2 }}>
              Available Workspaces
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {filteredWorkspaces.length > 0 ? (
              filteredWorkspaces.map((ws) => (
                <MenuItem key={ws.id} value={ws.id}>
                  <Checkbox checked={selectedWorkspaces.includes(ws.id)} />
                  <ListItemText primary={ws.workspace_name} />
                </MenuItem>
              ))
            ) : (
              <Typography sx={{ color: "gray", fontSize: 14, ml: 2 }}>
                No available workspaces
              </Typography>
            )}

            <Divider sx={{ my: 1 }} />

            {/* Saved Workspaces */}
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", ml: 2 }}>
              Saved Workspaces
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {savedWorkspaces.length > 0 ? (
              savedWorkspaces.map((ws) => (
                <MenuItem key={ws.id} value={ws.id}>
                  <Checkbox checked={selectedWorkspaces.includes(ws.id)} />
                  <ListItemText primary={ws.workspace_name} />
                </MenuItem>
              ))
            ) : (
              <Typography sx={{ color: "gray", fontSize: 14, ml: 2 }}>
                No saved workspaces
              </Typography>
            )}

            {/* Sticky Buttons */}
            <div
              style={{
                position: "sticky",
                bottom: 0,
                background: "#fff",
                padding: "10px 12px",
                borderTop: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={saving}
                sx={{ flex: 1 }}
              >
                {saving ? "Saving..." : "Save Selected"}
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteSelected}
                disabled={deleting}
                sx={{ flex: 1 }}
              >
                {deleting ? "Deleting..." : "Delete Selected"}
              </Button>
            </div>
          </Select>
        </FormControl>
      )}
    </div>
  );
};

export default PreferedWorkspace;
