import React from "react";
import WorkspaceTable from "../common/WorkspaceTable";

const Workspaces = () => {
    
    return(
        <WorkspaceTable 
          showManager={true} 
          showCreatedBy={true} 
        />
    )
}

export default Workspaces;