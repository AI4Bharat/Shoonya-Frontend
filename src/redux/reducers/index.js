import apiStatus from './apistatus/apistatus';
import getProjects from './Dashboard/GetProjects';
import getWorkspaces from './Dashboard/GetWorkspaces';
import fetchLoggedInUserData from './UserManagement/FetchLoggedInUserData';
import getProjectDetails from './ProjectDetails/GetProjectDetails';
import getTasksByProjectId from './Tasks/GetTasksByProjectId';
import  getWorkspacesProjectDetails from './WorkspaceDetails/GetWorkspaceProject'

const index = {
    apiStatus,
    getProjects,
    getWorkspaces,
    fetchLoggedInUserData,
    getProjectDetails,
    getTasksByProjectId,
    getWorkspacesProjectDetails,
    
};

export default index;