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
import getDatasetDownloadCSV from './Dataset/GetDatasetDownloadCSV';
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
import GetWorkspace from './Organization/GetWorkspace';
import automateDatasets from './Dataset/AutomateDatasets';
import getIndicTransLanguages from './Dataset/GetIndicTransLanguages';
import getCumulativeTasks from './Progress/CumulativeTasks';
import getPeriodicalTasks from './Progress/PeriodicalTasks';
import getDatasetLogs from './Dataset/GetDatasetLogs';
import getProjectLogs from './ProjectDetails/GetProjectLogs';
import DownloadTSVProject from './ProjectDetails/DownloadTSVProject';
import getDatasetDownloadTSV from './Dataset/GetDatasetDownloadTSV';
import getDatasetDownloadJSON from './Dataset/GetDatasetDownloadJSON';
import getOrganizationAnnotatorQuality from './Organization/GetOrganizationAnnotatorQuality';
import FindAndReplaceWordsInAnnotation from './ProjectDetails/FindAndReplaceWordsInAnnotation';
import getRecentTasks from './UserManagement/FetchRecentTasks';
import datasetSearchPopup from './Dataset/DatasetSearchPopup';
import getAllTasksdata from './Tasks/GetAllTasks';
import glossarysentence from './Glossary/GlossarySentence';
import getDomains from "./Glossary/GetDomain";
import getProjectTypeDetails from "./ProjectDetails/GetProjectTypeDetails";
import getTaskAnalyticsData from "./Progress/TaskAnalytics";
import getMetaAnalyticsData from "./Progress/MetaAnalytics";
import getDownloadProjectAnnotations from "./ProjectDetails/DownloadProjectAnnotations";
import getUserDetails from "./Admin/UserDetail";
import getDatasetProjectReports from "./Dataset/GetDatasetProjectReports";
import wsCumulativeTasks from "./WorkspaceDetails/GetCumulativeTasks";
import wsMetaAnalytics from "./WorkspaceDetails/GetMetaAnalytics";
import wsPeriodicalTasks from "./WorkspaceDetails/GetPeriodicalTasks";
import wsTaskAnalytics from "./WorkspaceDetails/GetTaskAnalytics";
import sendOrganizationUserReports from "./Organization/SendOrganizationUserReports";
import sendWorkspaceUserReports from './WorkspaceDetails/SendWorkspaceUserReports';
import getScheduledMails from './UserManagement/GetScheduledMails';
import createScheduledMails from './UserManagement/CreateScheduledMails';
import updateScheduledMails from './UserManagement/UpdateScheduledMails';
import deleteScheduledMails from './UserManagement/DeleteScheduledMails';
import commonReducer from "./CL-Transcription/Common";
import getAnnotationsTask from "./CL-Transcription/GetAnnotationsTask";
import patchAnnotation from "./CL-Transcription/PatchAnnotation"
import updateUIPrefs from "./UserManagement/UpdateUIPrefs";


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
    getDatasetDownloadCSV,
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
    GetWorkspace,
    automateDatasets,
    getIndicTransLanguages,
    getCumulativeTasks,
    getPeriodicalTasks,
    getDatasetLogs,
    getProjectLogs,
    DownloadTSVProject,
    getDatasetDownloadTSV,
    getDatasetDownloadJSON,
    getOrganizationAnnotatorQuality,
    FindAndReplaceWordsInAnnotation,
    getRecentTasks,
    datasetSearchPopup,
    getAllTasksdata,
    glossarysentence,
    getDomains,
    getProjectTypeDetails,
    getTaskAnalyticsData,
    getMetaAnalyticsData,
    getDownloadProjectAnnotations,
    getUserDetails,
    getDatasetProjectReports,
    wsCumulativeTasks,
    wsMetaAnalytics,
    wsPeriodicalTasks,
    wsTaskAnalytics,
    sendOrganizationUserReports,
    sendWorkspaceUserReports,
    getScheduledMails,
    createScheduledMails,
    updateScheduledMails,
    deleteScheduledMails,
    commonReducer,
    getAnnotationsTask,
    patchAnnotation,
    updateUIPrefs,

};

export default index;