import apiStatus from './apistatus/apistatus';
import getProjects from './Dashboard/GetProjects';
import getWorkspaces from './Dashboard/GetWorkspaces';
import fetchLoggedInUserData from './UserManagement/FetchLoggedInUserData';
import getProjectDetails from './ProjectDetails/GetProjectDetails';
import getProjectReport from './ProjectDetails/GetProjectReport';
import getTasksByProjectId from './Tasks/GetTasksByProjectId';
import  getWorkspacesProjectData from './WorkspaceDetails/GetWorkspaceProject'
import  getWorkspacesAnnotatorsData from './WorkspaceDetails/GetWorkspaceAnnotators'
import  getWorkspacesManagersData from './WorkspaceDetails/GetWorkspaceManagers'
import  getWorkspaceDetails from './WorkspaceDetails/GetWorkspaceDetails'
import getSaveButton from './ProjectDetails/EditUpdate'
import getExportProjectButton from './ProjectDetails/GetExportProjectButton'
import getPublishProjectButton from './ProjectDetails/GetPublishProject'
import getPullNewItems from './ProjectDetails/PullNewItems'

const index = {
    apiStatus,
    getProjects,
    getWorkspaces,
    fetchLoggedInUserData,
    getProjectDetails,
    getProjectReport,
    getTasksByProjectId,
    getWorkspacesProjectData,
    getWorkspacesAnnotatorsData,
    getWorkspacesManagersData,
    getWorkspaceDetails,
    getSaveButton,
    getExportProjectButton,
    getPublishProjectButton,
    getPullNewItems,
  

    
};

export default index;