// import React, { useState, useEffect } from "react";
// import {
//   CircularProgress,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Button,
//   Checkbox,
//   ListItemText,
//   Tooltip,
//   Divider,
// } from "@mui/material";
// import configs from "../../../../config/config";
// import { useParams } from "react-router-dom";
// import { Snackbar, Alert } from "@mui/material";


// const PreferedWorkspace = ({ orgId, }) => {

//   const [workspaces, setWorkspaces] = useState([]);
//   const [saved, setSaved] = useState([]);                
//   const [savedWorkspaces, setSavedWorkspaces] = useState([]);
//   const [selected, setSelected] = useState([]);          
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [open, setOpen] = useState(false); 
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success"); 

 

//   const MenuProps = {
//     PaperProps: {
//       style: {
//         maxHeight: 350,       
//         width: 300,
//         overflowX: "hidden", 
//       },
//     },
//     MenuListProps: {
//       style: {
//         overflowX: "hidden",   
//         whiteSpace: "normal", 
//       },
//     },
//   };


//   /*-------------------- FETCH WORKSPACES ----------------------*/
//   const fetchWorkspaces = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("shoonya_access_token");
//       const res = await fetch(
//         `${configs.BASE_URL_AUTO}/workspaces/prefered_workspaces/`,
//         { headers: { Authorization: `JWT ${token}` } }
//       );
//       const data = await res.json();
//       setWorkspaces(Array.isArray(data) ? data : data.data || []);
//     } catch (err) {
//       console.error("workspace fetch error:", err);
//     }
//     setLoading(false);
//   };

//   const fetchSaved = async () => {
//     try {
//       const token = localStorage.getItem("shoonya_access_token");
//       const res = await fetch(
//         `${configs.BASE_URL_AUTO}/users/account/get_prefered_workspace/`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `JWT ${token}`,
//           },
//         }
//       );

//       const data = await res.json();
//       const prefs = data?.prefered_workspace || {};

//       // Load saved workspaces (but DO NOT auto-select)
//       const savedList = prefs[orgId] || [];
//       setSavedWorkspaces(savedList);

//     } catch (err) {
//       console.error("Error fetching saved preferred workspace:", err);
//     }
//   };


//   /*-------------------- SAVE SELECTED ----------------------*/

//   const handleSave = async () => {
//     if (selected.length === 0) {
//       setSnackbarMessage("Please select at least one workspace");
//       setSnackbarSeverity("warning");
//       setSnackbarOpen(true);
//       return;
//     }

//     setSaving(true);

//     try {
//       const token = localStorage.getItem("shoonya_access_token");

//       const payload = {
//         [orgId]: workspaces
//           .filter((ws) => selected.includes(ws.id))
//           .map((ws) => ({
//             id: ws.id,
//             workspace_name: ws.workspace_name,
//           })),
//       };

//       // ⭐ You forgot this line earlier
//       const response = await fetch(
//         `${configs.BASE_URL_AUTO}/users/account/save_prefered_workspace/`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `JWT ${token}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       // ⭐ Now ESLint will not complain
//       if (!response.ok) {
//         throw new Error(`API failed with status ${response.status}`);
//       }

//       // SUCCESS BLOCK
//       setOpen(false);
//       fetchSaved();

//       setSnackbarMessage("Workspaces saved successfully!");
//       setSnackbarSeverity("success");
//       setSnackbarOpen(true);

//     } catch (err) {
//       console.error("Save error:", err);

//       setSnackbarMessage("Failed to save workspaces. Please try again.");
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//     }

//     setSaving(false);
//   };



//   /*-------------------- TOGGLE CHECKBOXES ----------------------*/
//   const handleToggle = (id) => {
//     if (selected.includes(id)) {
//       setSelected(selected.filter((x) => x !== id));
//     } else {
//       setSelected([...selected, id]);
//     }
//   };

 
//   const handleAll = () => {
//     // If ALL is currently selected → deselect everything
//     if (selected.length === workspaces.length) {
//       setSelected([]);    // <-- DO NOT revert to savedWorkspaces
//       return;
//     }

//     // Otherwise select all
//     setSelected(workspaces.map((ws) => ws.id));
//   };


//   /*-------------------- MERGE WITHOUT DUPLICATES ----------------------*/
//   // savedWorkspaces -> first
//   // workspaces -> second
//   const merged = [
//     ...savedWorkspaces,  // show saved first
//     ...workspaces.filter(
//       (ws) => !savedWorkspaces.some((s) => s.id === ws.id)
//     ),
//   ];


//   /*-------------------- SORT: SAVED FIRST ----------------------*/
//   const sortedList = merged.sort((a, b) => {
//     const isSavedA = saved.some((s) => s.id === a.id);
//     const isSavedB = saved.some((s) => s.id === b.id);
//     return isSavedA === isSavedB ? 0 : isSavedA ? -1 : 1;
//   });


//   /*-------------------- INIT ----------------------*/


//   useEffect(() => {
//     fetchWorkspaces();
//     fetchSaved();
//   }, [orgId]);


//   useEffect(() => {
//     if (savedWorkspaces.length > 0 && workspaces.length > 0 && !saving) {
//       const savedIds = savedWorkspaces.map((ws) => ws.id);
//       setSelected(savedIds);
//     }
//   }, [savedWorkspaces, workspaces]);


//   useEffect(() => {
//     // Only run when there is no saved preference for this org
//     if (savedWorkspaces.length === 0 && workspaces.length > 0 && !saving) {

//       const allIds = workspaces.map((ws) => ws.id);
//       setSelected(allIds);

//       const autoSave = async () => {
//         try {
//           const token = localStorage.getItem("shoonya_access_token");

//           const payload = {
//             [orgId]: workspaces.map((ws) => ({
//               id: ws.id,
//               workspace_name: ws.workspace_name,
//             })),
//           };

//           await fetch(
//             `${configs.BASE_URL_AUTO}/users/account/save_prefered_workspace/`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `JWT ${token}`,
//               },
//               body: JSON.stringify(payload),
//             }
//           );

//           fetchSaved(); // refresh saved list
//         } catch (err) {
//           console.error("Auto-save error:", err);
//         }
//       };

//       autoSave();
//     }
//   }, [savedWorkspaces]);   // ONLY observe savedWorkspaces



//   return (
//     <div style={{ width: 350, marginTop: 30 }}>
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={4000}
//         onClose={() => setSnackbarOpen(false)}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           onClose={() => setSnackbarOpen(false)}
//           severity={snackbarSeverity}     
//           variant="filled"                
//           sx={{ width: "100%" }}
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//       {loading ? (
//         <CircularProgress />
//       ) : (
//         <FormControl fullWidth>
//           <InputLabel id="workspace-label" shrink sx={{ fontSize: "16px" }}>
//             Preferred Workspaces
//           </InputLabel>

//           {/*                SELECT DROPDOWN UI                */}

//           <Select
//             open={open}
//             onClose={() => setOpen(false)}
//             onOpen={() => setOpen(true)}
//             sx={{
//               "& .MuiSelect-select.MuiInputBase-input": {
//                 padding: "10px 14px",
//                 height: "auto !important",
//                 minHeight: "1.6em",
//                 whiteSpace: "nowrap",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//               }
//             }}
//             multiple
//             label="Preferred Workspaces"
//             labelId="workspace-label"
//             MenuProps={MenuProps}
//             value={selected.length === 0 ? ["ALL"] : selected}
//             onChange={() => { }}
//             renderValue={() => {
//               if (selected.length > 0) {
//                 if (selected.length === workspaces.length) return "All Workspaces";
//                 return sortedList
//                   .filter((ws) => selected.includes(ws.id))
//                   .map((ws) => ws.workspace_name)
//                   .join(", ");
//               }
//               return "None";
//             }}
//           >

//             {/* ALL checkbox */}
//             <MenuItem onClick={handleAll}>
//               <Checkbox checked={selected.length === workspaces.length} />
//               <ListItemText primary="All Workspaces" />
//             </MenuItem>

//             <Divider />

           
//             {/* SCROLLABLE AREA – FIXED HEIGHT */}
            
//             <div
//               style={{
//                 maxHeight: "200px",
//                 overflowY: "auto",
//                 paddingRight: "6px"
//               }}
//             >
//               {merged.map((ws) => (
//                 <MenuItem key={ws.id} onClick={() => handleToggle(ws.id)}>
//                   <Checkbox checked={selected.includes(ws.id)} />
//                   <Tooltip
//                     title={ws.workspace_name}
//                     arrow
//                     PopperProps={{ disablePortal: true }}
//                   >
                   
//                     <ListItemText
//                       primary={ws.workspace_name}
//                       sx={{
//                         maxWidth: "220px",
//                         whiteSpace: "normal",
//                         wordBreak: "break-word",
//                       }}
//                     />
//                   </Tooltip>
//                 </MenuItem>
//               ))}
//             </div>

         
//             {/* SAVE BUTTON FIXED AT BOTTOM    */}
            
//             <div
//               style={{
//                 position: "sticky",
//                 bottom: 0,
//                 background: "#fff",
//               }}
//             >
//               <Button
//                 variant="contained"
//                 fullWidth
//                 onClick={handleSave}
//                 disabled={saving}
//                 sx={{ my: 0 }}
//               >
//                 {saving ? "Saving..." : "Save Preferences"}
//               </Button>
//             </div>

//           </Select>

//         </FormControl>
//       )
//       }
//     </div >
//   );
// };

// export default PreferedWorkspace;







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
import { Snackbar, Alert } from "@mui/material";


const PreferedWorkspace = ({ orgId, }) => {

  const [workspaces, setWorkspaces] = useState([]);
  const [saved, setSaved] = useState([]);                // saved preferred workspaces
  const [savedWorkspaces, setSavedWorkspaces] = useState([]);
  const [selected, setSelected] = useState([]);          // user selections
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false); // dropdown closed by default
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' | 'warning' | 'error'

  const ITEM_HEIGHT = 85;
  const ITEM_PADDING_TOP = 0;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 350,       // Controls total menu height
        width: 300,
        overflowX: "hidden", // ❗ Prevent Paper from adding scroll
      },
    },
    MenuListProps: {
      style: {
        overflowX: "hidden",   // ❗ prevent extra scroll
        whiteSpace: "normal",  // ❗ ALLOW text to wrap
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

    } catch (err) {
      console.error("Error fetching saved preferred workspace:", err);
    }
  };


  /*-------------------- SAVE SELECTED ----------------------*/


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

      // ⭐ You forgot this line earlier
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

      // ⭐ Now ESLint will not complain
      if (!response.ok) {
        throw new Error(`API failed with status ${response.status}`);
      }

      // SUCCESS BLOCK
      setOpen(false);
      fetchSaved();

      setSnackbarMessage("Workspaces saved successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    } catch (err) {
      console.error("Save error:", err);

      setSnackbarMessage("Failed to save workspaces. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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

  // const handleAll = () => {
  //   if (selected.length === workspaces.length) {
  //     setSelected([]);
  //   } else {
  //     setSelected(workspaces.map((ws) => ws.id));
  //   }
  // };
  const handleAll = () => {
    // If ALL is currently selected → deselect everything
    if (selected.length === workspaces.length) {
      setSelected([]);    // <-- DO NOT revert to savedWorkspaces
      return;
    }

    // Otherwise select all
    setSelected(workspaces.map((ws) => ws.id));
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
    if (savedWorkspaces.length > 0 && workspaces.length > 0 && !saving) {
      const savedIds = savedWorkspaces.map((ws) => ws.id);
      setSelected(savedIds);
    }
  }, [savedWorkspaces, workspaces]);


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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}     // success, error, warning, info
          variant="filled"                // gives proper color
          sx={{ width: "100%" }}
        >
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

          {/* ------------------------------------------------ */}
          {/*                SELECT DROPDOWN UI                */}
          {/* ------------------------------------------------ */}

          <Select
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
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
              if (selected.length > 0) {
                if (selected.length === workspaces.length) return "All Workspaces";
                return sortedList
                  .filter((ws) => selected.includes(ws.id))
                  .map((ws) => ws.workspace_name)
                  .join(", ");
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

            {/* ****************************** */}
            {/* SCROLLABLE AREA – FIXED HEIGHT */}
            {/* ****************************** */}
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                paddingRight: "6px"
              }}
            >
              {merged.map((ws) => (
                <MenuItem key={ws.id} onClick={() => handleToggle(ws.id)}>
                  <Checkbox checked={selected.includes(ws.id)} />
                  <Tooltip
                    title={ws.workspace_name}
                    arrow
                    PopperProps={{ disablePortal: true }}
                  >
                    {/* <ListItemText primary={ws.workspace_name} /> */}
                    <ListItemText
                      primary={ws.workspace_name}
                      sx={{
                        maxWidth: "220px",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    />
                  </Tooltip>
                </MenuItem>
              ))}
            </div>

            {/* ****************************** */}
            {/* SAVE BUTTON FIXED AT BOTTOM    */}
            {/* ****************************** */}
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
                sx={{ my: 0 }}
              >
                {saving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>

          </Select>

        </FormControl>
      )
      }
    </div >
  );
};

export default PreferedWorkspace;
