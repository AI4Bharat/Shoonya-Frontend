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
import getDatasetsByType from './Dataset/GetDatasetsByType';
import getDatasetFields from './Dataset/GetDatasetFields';
import getProjectDomains from './ProjectDetails/GetProjectDomains';
import getLanguageChoices from './ProjectDetails/GetLanguageChoices';
import createProject from './ProjectDetails/CreateProject';
import getWorkspaceUserReports from './WorkspaceDetails/GetWorkspaceUserReports';
import getWorkspaceProjectReports from './WorkspaceDetails/GetWorkspaceProjectReports';
import  downloadProjectButton from './ProjectDetails/DownloadProject'
import getFilteredTasks from './Tasks/GetFilteredTasks';
import postAnnotation from './Annotation/PostAnnotation';
import updateAnnotation from './Annotation/UpdateAnnotation';
import deleteAnnotation from './Annotation/DeleteAnnotation';
import getNextTask from './Tasks/GetNextTask';
import getTaskAnnotations from './Tasks/GetTaskAnnotations';
import updateTask from './Tasks/UpdateTask';
import pullNewBatch from "./Tasks/PullNewBatch";
import getDatasetProjects from './Dataset/GetDatasetProjects';

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
    getOrganizationUsers,
    getDatasetsByType,
    getDatasetFields,
    getProjectDomains,
    getLanguageChoices,
    createProject,
    getWorkspaceUserReports,
    getWorkspaceProjectReports,
    downloadProjectButton,
    getFilteredTasks,
    postAnnotation,
    updateAnnotation,
    deleteAnnotation,
    getNextTask,
    getTaskAnnotations,
    updateTask,
    pullNewBatch,
    getDatasetProjects,
};

export default index;