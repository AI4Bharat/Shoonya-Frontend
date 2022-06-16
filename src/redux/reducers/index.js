import apiStatus from './apistatus/apistatus';
import getProjects from './Dashboard/GetProjects';
import getWorkspaces from './Dashboard/GetWorkspaces';
import fetchLoggedInUserData from './UserManagement/FetchLoggedInUserData';
import getProjectDetails from './ProjectDetails/GetProjectDetails';
import getProjectReport from './ProjectDetails/GetProjectReport';
import getTasksByProjectId from './Tasks/GetTasksByProjectId';
import getWorkspacesProjectData from './WorkspaceDetails/GetWorkspaceProject';
import getWorkspacesAnnotatorsData from './WorkspaceDetails/GetWorkspaceAnnotators';
import getWorkspacesManagersData from './WorkspaceDetails/GetWorkspaceManagers';
import getWorkspaceDetails from './WorkspaceDetails/GetWorkspaceDetails'
import getTaskPrediction from './Tasks/GetTaskPrediction';
import fetchLanguages from './UserManagement/FetchLanguages';
import getDatasetList from './Dataset/GetDatasetList';


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
    getTaskPrediction,    
    fetchLanguages,
    getDatasetList
};

export default index;