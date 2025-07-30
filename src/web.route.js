import React from 'react'
import {
  BrowserRouter as Router,
  HashRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import themeDefault from "./ui/theme/theme";
import { authenticateUser } from "./utils/utils";

import Login from "./ui/pages/container/UserManagement/Login"
import ForgotPassword from "./ui/pages/container/UserManagement/ForgotPassword"
import ConfirmForgetPassword from "./ui/pages/container/UserManagement/ConfirmForgetPassword"
import SignUp from "./ui/pages/container/UserManagement/SignUp"
import ChangePassword from "./ui/pages/container/UserManagement/ChangePassword"
import ProfilePage from "./ui/pages/container/UserManagement/ProfilePage"
import ProgressPage from "./ui/pages/container/UserManagement/ProgressPage"
import EditProfile from "./ui/pages/container/UserManagement/EditProfile"
import Dashboard from "./ui/pages/container/Project/ProjectList"
import ProgressList from "./ui/pages/container/Progress/ProgressList"
import DashBoard from "./ui/pages/container/Admin/DashBoard"
import Layout from "./ui/Layout";
import ProjectSetting from "./ui/pages/container/Project/ProjectSetting"
import WorkspaceSettingTabs from "./ui/pages/container/Workspace/WorkspaceSettingTabs"
import DatasetSettingTabs from "./ui/pages/container/Dataset/DatasetSettingTabs"
import CreateDatasetInstanceButton from "./ui/pages/container/Dataset/CreateNewDatasetInstance"
import Transliteration from "./ui/pages/container/Transliteration/Transliteration"
import MyOrganization from "./ui/pages/container/Organization/MyOrganization"

const Projects = React.lazy(() =>
  import("./ui/pages/container/Project/ProjectDetails")
);
const WorkSpaces = React.lazy(() =>
  import("./ui/pages/container/Workspace/WorkSpaceList")
);
const WorkSpace = React.lazy(() =>
  import("./ui/pages/container/Workspace/WorkSpaceDetails")
);
const AnnotationProject = React.lazy(() =>
  import("./ui/pages/container/Workspace/AnnotationProject")
);
const CollectionProject = React.lazy(() =>
  import("./ui/pages/container/Workspace/CollectionProject")
);
const DatasetList = React.lazy(() =>
  import("./ui/pages/container/Dataset/DatasetList")
);
const DatasetDetails = React.lazy(() =>
  import("./ui/pages/container/Dataset/DatasetDetails")
);
const AutomateDatasets = React.lazy(() =>
  import("./ui/pages/container/Dataset/AutomateDatasets")
);
const LSF = React.lazy(() => import("./ui/pages/container/Label-Studio/LSF"));
const ReviewLSF = React.lazy(() =>
  import("./ui/pages/container/Label-Studio/ReviewLSF")
);
const AllTaskLSF = React.lazy(() =>
  import("./ui/pages/container/Label-Studio/AllTaskLSF")
);
const SuperCheckerLSF = React.lazy(() =>
  import("./ui/pages/container/Label-Studio/SuperCheckerLSF")
);
const AudioTranscriptionLandingPage = React.lazy(() =>
  import("./ui/pages/container/CL-Transcription/AudioTranscriptionLandingPage")
);
const ReviewAudioTranscriptionLandingPage = React.lazy(() =>
  import(
    "./ui/pages/container/CL-Transcription/ReviewAudioTranscriptionLandingPage"
  )
);
const SuperCheckerAudioTranscriptionLandingPage = React.lazy(() =>
  import(
    "./ui/pages/container/CL-Transcription/SuperCheckerAudioTranscriptionLandingPage"
  )
);
const AllAudioTranscriptionLandingPage = React.lazy(() =>
  import(
    "./ui/pages/container/CL-Transcription/AllAudioTranscriptionLandingPage"
  )
);

const App = () => {
  const ProtectedRoute = ({ user, children }) => {
    if (!authenticateUser()) {
      return <Navigate to="/" />;
      // return browserhistory.replace("/#/");
    }
    return children;
  };

  const ProtectedRouteWrapper = (component) => {
    return <ProtectedRoute>{component}</ProtectedRoute>;
  };

  return (
    <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/forget-password/confirm/:key/:token"
            element={<ConfirmForgetPassword />}
          />
          <Route path="/invite/:inviteCode" element={<SignUp />} />
          <Route
            path="/admin"
            element={ProtectedRouteWrapper(
              <Layout component={<DashBoard />} />
            )}
          />

          <Route
            path="/edit-profile"
            element={ProtectedRouteWrapper(
              <Layout component={<EditProfile />} Backbutton={true} />
            )}
          />
          <Route
            path="/Change-Password"
            element={ProtectedRouteWrapper(
              <Layout component={<ChangePassword />} Backbutton={true} />
            )}
          />
          <Route
            path="/profile/:id"
            element={ProtectedRouteWrapper(
              <Layout component={<ProfilePage />} Backbutton={true} />
            )}
          />
          <Route
            path="/projects"
            element={ProtectedRouteWrapper(
              <Layout component={<Dashboard />} />
            )}
          />
          <Route
            path="projects/:id"
            element={ProtectedRouteWrapper(
              <Layout
                component={<Projects />}
                Backbutton={true}
                backPressNavigationPath={"/projects"}
              />
            )}
          />
          <Route
            path="/progress/:id"
            element={ProtectedRouteWrapper(
              <Layout component={<ProgressPage />} Backbutton={true} />
            )}
          />
          <Route
            path="projects/:id/projectsetting"
            element={ProtectedRouteWrapper(
              <Layout component={<ProjectSetting />} Backbutton={true} />
            )}
          />

          <Route
            path="projects/:projectId/task/:taskId"
            element={ProtectedRouteWrapper(<Layout component={<LSF />} />)}
          />
          <Route
            path="projects/:projectId/review/:taskId"
            element={ProtectedRouteWrapper(
              <Layout component={<ReviewLSF />} />
            )}
          />
          <Route
            path="projects/:projectId/Alltask/:taskId"
            element={ProtectedRouteWrapper(
              <Layout component={<AllTaskLSF />} />
            )}
          />
          <Route
            path="projects/:projectId/SuperChecker/:taskId"
            element={ProtectedRouteWrapper(
              <Layout component={<SuperCheckerLSF />} />
            )}
          />
          <Route
            path="workspaces/:id"
            element={ProtectedRouteWrapper(
              <Layout component={<WorkSpace />} Backbutton={true} />
            )}
          />
          <Route
            path="workspaces/:id/workspacesetting"
            element={ProtectedRouteWrapper(
              <Layout component={<WorkspaceSettingTabs />} Backbutton={true} />
            )}
          />
          <Route
            path="create-annotation-project/:id"
            element={ProtectedRouteWrapper(
              <Layout component={<AnnotationProject />} Backbutton={true} />
            )}
          />
          <Route
            path="create-collection-project/:id"
            element={ProtectedRouteWrapper(
              <Layout component={<CollectionProject />} Backbutton={true} />
            )}
          />
          <Route
            path="workspaces"
            element={ProtectedRouteWrapper(
              <Layout component={<WorkSpaces />} />
            )}
          />
          <Route
            path="my-organization/:orgId"
            element={ProtectedRouteWrapper(
              <Layout component={<MyOrganization />} />
            )}
          />
          <Route
            path="datasets"
            element={ProtectedRouteWrapper(
              <Layout component={<DatasetList />} />
            )}
          />
          <Route
            path="datasets/:datasetId"
            element={ProtectedRouteWrapper(
              <Layout component={<DatasetDetails />} Backbutton={true} />
            )}
          />
          <Route
            path="datasets/:datasetId/datasetsetting"
            element={ProtectedRouteWrapper(
              <Layout component={<DatasetSettingTabs />} Backbutton={true} />
            )}
          />
          <Route
            path="datasets/automate"
            element={ProtectedRouteWrapper(
              <Layout component={<AutomateDatasets />} Backbutton={true} />
            )}
          />
          <Route
            path="transliteration/"
            element={ProtectedRouteWrapper(
              <Layout component={<Transliteration />} Backbutton={true} />
            )}
          />
          <Route
            path="create-Dataset-Instance-Button"
            element={ProtectedRouteWrapper(
              <Layout
                component={<CreateDatasetInstanceButton />}
                Backbutton={true}
              />
            )}
          />

          <Route
            path="analytics"
            element={ProtectedRouteWrapper(
              <Layout component={<ProgressList />} />
            )}
          />
          <Route
            path="projects/:projectId/AudioTranscriptionLandingPage/:taskId"
            element={ProtectedRouteWrapper(
              <Layout component={<AudioTranscriptionLandingPage />} />
            )}
          />
          <Route
            path="projects/:projectId/ReviewAudioTranscriptionLandingPage/:taskId"
            element={ProtectedRouteWrapper(
              <Layout component={<ReviewAudioTranscriptionLandingPage />} />
            )}
          />
          <Route
            path="projects/:projectId/SuperCheckerAudioTranscriptionLandingPage/:taskId"
            element={ProtectedRouteWrapper(
              <Layout
                component={<SuperCheckerAudioTranscriptionLandingPage />}
              />
            )}
          />
          <Route
            path="projects/:projectId/AllAudioTranscriptionLandingPage/:taskId"
            element={ProtectedRouteWrapper(
              <Layout component={<AllAudioTranscriptionLandingPage />} />
            )}
          />
        </Routes>
    </HashRouter>
  );
};

const AppWrapper = () => {
  return (
    <ThemeProvider theme={themeDefault}>
      <App />
    </ThemeProvider>
  );
};

export default AppWrapper;
