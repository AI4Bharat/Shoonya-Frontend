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

  const ITEM_HEIGHT = 100;
  const ITEM_PADDING_TOP = 0;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
        width: 250,
      }
    },
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "center",
      style: { maxHeight: ITEM_HEIGHT, width: 300 },
    },
    variant: "menu"
  };


  const [workspaces, setWorkspaces] = useState([]);
  const [saved, setSaved] = useState([]);      // saved from backend
  const [selected, setSelected] = useState([]); // UI checked items
  const [loading, setLoading] = useState(false);


  // Fetch Available Workspaces
 
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


  // Fetch Saved Preferred Workspaces

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


  // API: Save ONE workspace (delta)

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


  // API: Delete ONE workspace (delta)

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

 
  // Checkbox Toggle Handler — FIXED VERSION

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


  // Sort workspaces so that checked ones appear first
  const sortedList = [...workspaces].sort((a, b) => {
    const aChecked = selected.includes(a.id);
    const bChecked = selected.includes(b.id);

    // Checked → first
    if (aChecked && !bChecked) return -1;
    if (!aChecked && bChecked) return 1;
    return 0;
  });

  useEffect(() => {
    fetchWorkspaces();
    fetchSaved();
  }, [orgId]);

  return (
    <div style={{ marginTop: 30 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <FormControl fullWidth style={{ width: 310, minHeight: 70, }}>
          <InputLabel id="workspace-label" shrink sx={{ fontSize: "16px" }}>
            Preferred Workspaces
          </InputLabel>

          <Select
            sx={{
              "& .MuiSelect-select.MuiInputBase-input": {
                padding: "10px 14px",
                height: "auto !important",
                minHeight: "1.6em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }
            }}
            multiple
            style={{ zIndex: 10 }}
            label="Preferred Workspaces"
            labelId="workspace-label"
            MenuProps={MenuProps}
            value={selected.length === 0 ? ["ALL"] : selected}
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
      )
      }
    </div >
  );
};

export default PreferedWorkspace;