import { Box } from "@mui/material";
import React  from "react";
import WorkspaceTable from "../../component/common/WorkspaceTable";

export default function WorkSpaces(props) {
 
  //   const classes = DatasetStyle();
  //   const dispatch = useDispatch();
  //   const workspaceData = useSelector(state=>state.getWorkspaces.data);

  //   const getDashboardWorkspaceData = ()=>{
  //   const workspaceObj = new GetWorkspacesAPI(1);
  //   dispatch(APITransport(workspaceObj));
  // }
  
  // useEffect(()=>{
  //   getDashboardWorkspaceData();
  // },[]);
    

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
