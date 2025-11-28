// -----------------------------------------------------------------------
//  final 
// -----------------------------------------------------------------------
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
} from "@mui/material";
import configs from "../../../../config/config";
import { useParams } from "react-router-dom";

const PreferedWorkspace = () => {
  const { orgId } = useParams();

  const [workspaces, setWorkspaces] = useState([]);
  const [saved, setSaved] = useState([]);                // saved preferred workspaces
  const [savedWorkspaces, setSavedWorkspaces] = useState([]);
  const [selected, setSelected] = useState([]);          // user selections
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const ITEM_HEIGHT = 100;
  const ITEM_PADDING_TOP = 0;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
        width: 260,
      },
    },
  };

  /*-------------------- FETCH WORKSPACES ----------------------*/
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

      // Load saved workspaces (but DO NOT auto-select)
      const savedList = prefs[orgId] || [];
      setSavedWorkspaces(savedList);

      // ❌ No auto-select — leave selectedWorkspaces untouched
      // setSelectedWorkspaces(savedList.map(ws => ws.id));   <-- removed

    } catch (err) {
      console.error("Error fetching saved preferred workspace:", err);
    }
  };


  /*-------------------- SAVE SELECTED ----------------------*/
  const handleSave = async () => {
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
      console.error("save error:", err);
    }

    setSaving(false);
  };

  /*-------------------- TOGGLE CHECKBOXES ----------------------*/
  const handleToggle = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleAll = () => {
    if (selected.length === workspaces.length) {
      setSelected([]);
    } else {
      setSelected(workspaces.map((ws) => ws.id));
    }
  };

  /*-------------------- MERGE WITHOUT DUPLICATES ----------------------*/
  // savedWorkspaces -> first
  // workspaces -> second
  const merged = [
    ...savedWorkspaces,  // show saved first
    ...workspaces.filter(
      (ws) => !savedWorkspaces.some((s) => s.id === ws.id)
    ),
  ];


  /*-------------------- SORT: SAVED FIRST ----------------------*/
  const sortedList = merged.sort((a, b) => {
    const isSavedA = saved.some((s) => s.id === a.id);
    const isSavedB = saved.some((s) => s.id === b.id);
    return isSavedA === isSavedB ? 0 : isSavedA ? -1 : 1;
  });


  /*-------------------- INIT ----------------------*/
  useEffect(() => {
    fetchWorkspaces();
    fetchSaved();
  }, [orgId]);
 
  useEffect(() => {
    // Only run when there is no saved preference for this org
    if (savedWorkspaces.length === 0 && workspaces.length > 0 && !saving) {

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

          fetchSaved(); // refresh saved list
        } catch (err) {
          console.error("Auto-save error:", err);
        }
      };

      autoSave();
    }
  }, [savedWorkspaces]);   // ONLY observe savedWorkspaces



  return (
    <div style={{ width: 350, marginTop: 30 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <FormControl fullWidth>
          <InputLabel id="workspace-label" shrink sx={{ fontSize: "16px" }}>
            Preferred Workspaces
          </InputLabel>

          {/* ------------------------------------------------ */}
          {/*                SELECT DROPDOWN UI                */}
          {/* ------------------------------------------------ */}
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
            label="Preferred Workspaces"
            labelId="workspace-label"
            MenuProps={MenuProps}
            value={selected.length === 0 ? ["ALL"] : selected}
            onChange={() => { }}
            renderValue={() => {

              // -------------------------------------------
              // 1️⃣ If user has selected something -> show selected
              // -------------------------------------------
              if (selected.length > 0) {
                if (selected.length === workspaces.length) {
                  return "All Workspaces";
                }

                return sortedList
                  .filter((ws) => selected.includes(ws.id))
                  .map((ws) => ws.workspace_name)
                  .join(", ");
              }
              if (savedWorkspaces.length === workspaces.length && workspaces.length > 0) {
                return "All Workspaces";
              }
              // -----------------------------------------------------
              // 2️⃣ When no user selection -> show saved preferred workspaces
              // -----------------------------------------------------
              if (savedWorkspaces.length > 0) {
                return savedWorkspaces.map((ws) => ws.workspace_name).join(", ");
              }

              return "None";
            }}
          >

            {/* ALL checkbox */}
            <MenuItem onClick={handleAll}>
              <Checkbox checked={selected.length === workspaces.length} />
              <ListItemText primary="All Workspaces" />
            </MenuItem>

            <Divider />

            {/* WORKSPACE LIST */}
            {merged.map((ws) => (
              <MenuItem key={ws.id} onClick={() => handleToggle(ws.id)}>
                <Checkbox checked={selected.includes(ws.id)} />
                <Tooltip title={ws.workspace_name} arrow>
                  <ListItemText primary={ws.workspace_name} />
                </Tooltip>
              </MenuItem>
            ))}


            {/* STICKY SAVE BUTTON */}
            <div
              style={{
                position: "sticky",
                bottom: 0,
                background: "#fff",
              }}
            >
              <Button
                variant="contained"
                fullWidth
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Selected"}
              </Button>
            </div>
          </Select>
        </FormControl>
      )}
    </div>
  );
};

export default PreferedWorkspace;
