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
import getOrganizationUsers from './Organization/GetOragnizationUsers';
import getDatasetList from './Dataset/GetDatasetList';
import getTaskDetails from './Tasks/GetTaskDetails'
import getDatasetDetails from './Dataset/GetDatasetDetails';
import getDataitemsById from './Dataset/GetDataitemsById';
import getArchiveProject from './ProjectDetails/ArchiveProject';
import getExportProject from './ProjectDetails/GetExportProjectButton';
import getPullNewData from './ProjectDetails/PullNewItems';
import getPublishProject from './ProjectDetails/GetPublishProject';
import getEditUpdate from './ProjectDetails/EditUpdate'


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
    getOrganizationUsers, 
    getDatasetList,
    getTaskDetails,
    getDatasetList,
    getDatasetDetails,
    getDataitemsById,
    getOrganizationUsers ,
    getArchiveProject,
    getExportProject,
    getPullNewData,
    getPublishProject,
    getEditUpdate,
   
};

export default index;