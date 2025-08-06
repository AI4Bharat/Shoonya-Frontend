import React, { useEffect } from "react";
import WorkspaceTable from "../common/WorkspaceTable";

const Workspaces = ({reloadWorkspaceTable, setReloadWorkspaceTable}) => {
    useEffect(() => {
      if (reloadWorkspaceTable) {
        window.location.reload();
        setReloadWorkspaceTable(false);
      }
    }, [reloadWorkspaceTable, setReloadWorkspaceTable]);
    return(
        <WorkspaceTable 
          showManager={true} 
          showCreatedBy={true} 
        />
    )
}

export default Workspaces;
