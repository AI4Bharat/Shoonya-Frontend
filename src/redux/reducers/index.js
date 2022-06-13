import apiStatus from './apistatus/apistatus';
import getProjects from './Dashboard/GetProjects';
import getWorkspaces from './Dashboard/GetWorkspaces';
import fetchLoggedInUserData from './UserManagement/FetchLoggedInUserData';
import getProjectDetails from './ProjectDetails/GetProjectDetails';
import getTasksByProjectId from './Tasks/GetTasksByProjectId';
import  getWorkspacesProjectData from './WorkspaceDetails/GetWorkspaceProject'
import  getWorkspacesAnnotatorsData from './WorkspaceDetails/GetWorkspaceAnnotators'
import  getWorkspacesManagersData from './WorkspaceDetails/GetWorkspaceManagers'
import  getWorkspaceDetails from './WorkspaceDetails/GetWorkspaceDetails'


const index = {
    apiStatus,
    getProjects,
    getWorkspaces,
    fetchLoggedInUserData,
    getProjectDetails,
    getTasksByProjectId,
    getWorkspacesProjectData,
    getWorkspacesAnnotatorsData,
    getWorkspacesManagersData,
    getWorkspaceDetails,
  

    
};

export default index;