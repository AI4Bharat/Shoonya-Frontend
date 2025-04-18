import { Box } from "@mui/material";
import React  from "react";
import WorkspaceTable from "../../component/common/WorkspaceTable";

export default function WorkSpaces(props) {
 
    

  return (
    <React.Fragment>
    {/* <Header /> */}
    <Box sx={{ margin : "0 auto", pb : 5 }}>
        {/* <Typography variant="h5" sx={{mt : 2, mb : 2}}>Visit Workspaces</Typography> */}
        <WorkspaceTable 
          showManager={false} 
          showCreatedBy={false} 
          // workspaceData={workspaceData} 
        />
    </Box>
</React.Fragment>
  )
}
