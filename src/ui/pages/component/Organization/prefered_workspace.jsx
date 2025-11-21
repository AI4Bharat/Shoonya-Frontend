import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Divider,
} from "@mui/material";
import configs from "../../../../config/config";
import { useParams } from "react-router-dom";

const PreferedWorkspace = () => {
  const { orgId } = useParams();

  const ITEM_HEIGHT = 400;
  const MenuProps = {
    PaperProps: {
      style: { maxHeight: ITEM_HEIGHT, width: 300 },
    },
    anchorOrigin: { vertical: "bottom", horizontal: "center" },
    transformOrigin: { vertical: "top", horizontal: "center" },
    variant: "menu",
  };

  const [workspaces, setWorkspaces] = useState([]);
  const [saved, setSaved] = useState([]);      // saved from backend
  const [selected, setSelected] = useState([]); // UI checked items
  const [loading, setLoading] = useState(false);

  // ----------------------------------------
  // Fetch Available Workspaces
  // ----------------------------------------
  const fetchWorkspaces = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("shoonya_access_token");
      const res = await fetch(
        `${configs.BASE_URL_AUTO}/workspaces/prefered_workspaces/`,
        { headers: { "Content-Type": "application/json", Authorization: `JWT ${token}` } }
      );
      const data = await res.json();
      setWorkspaces(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Workspace fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // Fetch Saved Preferred Workspaces
  // ----------------------------------------
  const fetchSaved = async () => {
    try {
      const token = localStorage.getItem("shoonya_access_token");
      const res = await fetch(
        `${configs.BASE_URL_AUTO}/users/account/get_prefered_workspace/`,
        { headers: { "Content-Type": "application/json", Authorization: `JWT ${token}` } }
      );
      const data = await res.json();
      const prefs = data?.prefered_workspace || {};
      const savedList = prefs[orgId] || [];

      setSaved(savedList);
      setSelected(savedList.map((ws) => ws.id));
    } catch (err) {
      console.error("Saved workspace fetch error:", err);
    }
  };

  // ----------------------------------------
  // API: Save ONE workspace (delta)
  // ----------------------------------------
  const saveOne = async (id) => {
    try {
      const token = localStorage.getItem("shoonya_access_token");
      const ws = workspaces.find((w) => w.id === id);

      await fetch(
        `${configs.BASE_URL_AUTO}/users/account/save_prefered_workspace/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `JWT ${token}` },
          body: JSON.stringify({
            [orgId]: [{ id: ws.id, workspace_name: ws.workspace_name }],
          }),
        }
      );

      fetchSaved();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // ----------------------------------------
  // API: Delete ONE workspace (delta)
  // ----------------------------------------
  const deleteOne = async (id) => {
    try {
      const token = localStorage.getItem("shoonya_access_token");

      await fetch(
        `${configs.BASE_URL_AUTO}/users/account/delete_prefered_workspace/`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Authorization: `JWT ${token}` },
          body: JSON.stringify({
            organization_id: orgId,
            workspace_ids: [id],
          }),
        }
      );

      fetchSaved();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ----------------------------------------
  // Checkbox Toggle Handler — FIXED VERSION
  // ----------------------------------------
  const handleToggle = (id) => {
    let updated;

    if (selected.includes(id)) {
      // uncheck → delete
      updated = selected.filter((x) => x !== id);
      deleteOne(id);
    } else {
      // check → save
      updated = [...selected, id];
      saveOne(id);
    }

    setSelected(updated);
  };

  const handleAll = async () => {
    const allIds = workspaces.map(w => w.id);

    const token = localStorage.getItem("shoonya_access_token");

    // CASE 1: All selected → unselect all
    if (selected.length === workspaces.length) {

      await fetch(`${configs.BASE_URL_AUTO}/users/account/delete_prefered_workspace/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({
          organization_id: orgId,
          workspace_ids: allIds,   // DELETE ALL
        }),
      });

      setSelected([]);
      fetchSaved();
      return;
    }

    // CASE 2: Not all selected → select all
    const fullPayload = workspaces.map(ws => ({
      id: ws.id,
      workspace_name: ws.workspace_name,
    }));

    await fetch(`${configs.BASE_URL_AUTO}/users/account/save_prefered_workspace/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({
        [orgId]: fullPayload,   // SAVE ALL IN ONE REQUEST
      }),
    });

    setSelected(allIds);
    fetchSaved();
  };
  const sortedList = workspaces; // no need to separate saved & others

  useEffect(() => {
    fetchWorkspaces();
    fetchSaved();
  }, [orgId]);

  return (
    <div style={{ marginTop: 30 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <FormControl fullWidth style={{ width: 400 }}>
          <InputLabel id="workspace-label">Preferred Workspaces</InputLabel>

          <Select
            multiple
            labelId="workspace-label"
            MenuProps={MenuProps}
            value={selected}
            onChange={() => { }}
            renderValue={() => {
              if (selected.length === workspaces.length) return "All Workspaces";
              return sortedList
                .filter((ws) => selected.includes(ws.id))
                .map((ws) => ws.workspace_name)
                .join(", ");
            }}
          >
            {/* ALL OPTION */}
            <MenuItem onClick={handleAll}>
              <Checkbox checked={selected.length === workspaces.length} />
              <ListItemText primary="All Workspaces" />
            </MenuItem>

            <Divider />

            {/* WORKSPACE OPTIONS */}
            {sortedList.map((ws) => (
              <MenuItem key={ws.id} onClick={() => handleToggle(ws.id)}>
                <Checkbox checked={selected.includes(ws.id)} />
                <ListItemText primary={ws.workspace_name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
};

export default PreferedWorkspace;
