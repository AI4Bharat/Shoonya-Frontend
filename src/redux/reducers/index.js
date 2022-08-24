import apiStatus from './apistatus/apistatus';
import getProjects from './Dashboard/GetProjects';
import getWorkspaces from './Dashboard/GetWorkspaces';
import fetchLoggedInUserData from './UserManagement/FetchLoggedInUserData';
import getUserAnalytics from "./UserManagement/GetUserAnalytics";
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
import  downloadProjectCSV from './ProjectDetails/DownloadCSVProject'
import getFilteredTasks from './Tasks/GetFilteredTasks';
import postAnnotation from './Annotation/PostAnnotation';
import updateAnnotation from './Annotation/UpdateAnnotation';
import deleteAnnotation from './Annotation/DeleteAnnotation';
import getNextTask from './Tasks/GetNextTask';
import getTaskAnnotations from './Tasks/GetTaskAnnotations';
import updateTask from './Tasks/UpdateTask';
import pullNewBatch from "./Tasks/PullNewBatch";
import  SearchProjectCards from "./ProjectDetails/SearchProjectCards"
import deallocateTasks from "./Tasks/DeallocateTasks";
import getOrganizationUserReports from './Organization/GetOrganizationUserReports';
import getOrganizationProjectReports from './Organization/GetOrganizationProjectReports';
import getDatasetProjects from './Dataset/GetDatasetProjects';
import getDatasetMembers from './Dataset/GetDatasetMembers';
import getDatasetDownload from './Dataset/GetDatasetDownload';
import CreateNewDatasetInstance from './Dataset/CreateNewDatasetInstance';
import GetDatasetType from './Dataset/GetDatasetType';
import Uploaddata from './Dataset/Uploaddata';
import GetFileTypes from './Dataset/GetFileTypes';
import ChangePassword from './UserManagement/ChangePassword'
import fetchUserById from './UserManagement/FetchUserById';
import setTaskFilter from './Tasks/SetTaskFilter';
import DownloadJSONProject from './ProjectDetails/DownloadJSONProject';
import forgotPassword from './UserManagement/ForgotPassword';
import confirmForgetPassword from "./UserManagement/ConfirmForgetPassword";
import SignUp from './UserManagement/SignUp';
import archiveWorkspace from './WorkspaceDetails/ArchiveWorkspace';
import RemoveProjectMember from './ProjectDetails/RemoveProjectMember';
import RemoveProjectReviewer from './ProjectDetails/RemoveProjectReviewer';

const index = {
    apiStatus,
    getProjects,
    getWorkspaces,
    fetchLoggedInUserData,
    getUserAnalytics,
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
    downloadProjectCSV,
    getFilteredTasks,
    postAnnotation,
    updateAnnotation,
    deleteAnnotation,
    getNextTask,
    getTaskAnnotations,
    updateTask,
    pullNewBatch,
    SearchProjectCards,
    deallocateTasks,
    getOrganizationUserReports,
    getOrganizationProjectReports,
    getDatasetProjects,
    getDatasetMembers,
    getDatasetDownload,
    CreateNewDatasetInstance,
    GetDatasetType,
    Uploaddata,
    GetFileTypes,
    ChangePassword,
    fetchUserById,
    setTaskFilter,
    DownloadJSONProject,
    forgotPassword,
    confirmForgetPassword,
    SignUp,
    RemoveProjectMember,
    RemoveProjectReviewer,
    archiveWorkspace,
};

export default index;