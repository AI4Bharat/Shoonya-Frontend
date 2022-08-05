import {
  BrowserRouter as Router,
  HashRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useRoutes,
} from "react-router-dom";
// import Landing from "./ui/pages/container/Landing/index";
import Login from "./ui/pages/container/UserManagement/Login";
import ForgotPassword from "./ui/pages/container/UserManagement/ForgotPassword";
import Dashboard from "./ui/pages/container/Project/ProjectList";
import Projects from "./ui/pages/container/Project/ProjectDetails";
import { ThemeProvider } from "@mui/material/styles";
import ProjectSetting from "./ui/pages/container/Project/ProjectSetting";
import WorkSpace from "./ui/pages/container/Workspace/WorkSpaceDetails";
import themeDefault from "./ui/theme/theme";
import AnnotationProject from "./ui/pages/container/Workspace/AnnotationProject";
import WorkSpaces from "./ui/pages/container/Workspace/WorkSpaceList";
import Layout from "./ui/Layout";
import MyOrganization from "./ui/pages/container/Organization/MyOrganization";
import CollectionProject from "./ui/pages/container/Workspace/CollectionProject";
import AnnotateTask from "./ui/pages/container/Project/AnnotateTask";
import DatasetList from "./ui/pages/container/Dataset/DatasetList";
import DatasetDetails from "./ui/pages/container/Dataset/DatasetDetails";
import { authenticateUser } from "./utils/utils";
import Transliteration from "./ui/pages/container/Transliteration/Transliteration";
import LSF from "./ui/pages/container/Label-Studio/LSF";
import ReviewLSF from "./ui/pages/container/Label-Studio/ReviewLSF";
import UserProfilePage from "./ui/pages/container/UserManagement/UserProfilePage";
import CreateDatasetInstanceButton from "./ui/pages/container/Dataset/CreateNewDatasetInstance";
import ChangePassword from "./ui/pages/container/UserManagement/ChangePassword";
import ProfilePage from "./ui/pages/container/UserManagement/ProfilePage";
import ConfirmForgetPassword from "./ui/pages/container/UserManagement/ConfirmForgetPassword";

const App = () => {
  const ProtectedRoute = ({ user, children }) => {
    if (!authenticateUser()) {
      return <Link href="/" />;
    }
    return children;
  };

  const ProtectedRouteWrapper = (component) => {
    return <ProtectedRoute>{component}</ProtectedRoute>;
  };

  // let routes = useRoutes([
  //   // { path: "/", element: <Landing /> }, my-organization
  //   {
  //     path: "/",
  //     element: <Login />,
  //   },
  //   {
  //     path: "forgot-password",
  //     element: <ForgotPassword />,
  //   },
  //   {
  //     path: "my-profile",
  //     element: ProtectedRouteWrapper(<Layout component={<MyProfile />} />),
  //   },
  //   {
  //     path: "projects",
  //     element: ProtectedRouteWrapper(<Layout component={<Dashboard />} />),
  //   },
  //   {
  //     path: "projects/:id",
  //     element: ProtectedRouteWrapper(
  //       <Layout component={<Projects />} Backbutton={true} />
  //     ),
  //   },
  //   {
  //     path: "projects/:id/projectsetting",
  //     element: ProtectedRouteWrapper(
  //       <Layout component={<ProjectSetting />} Backbutton={true} />
  //     ),
  //   },
  //   {
  //     path: "projects/:projectId/task/:taskId",
  //     element: ProtectedRouteWrapper(<Layout component={<AnnotateTask />} />),
  //   },
  //   {
  //     path: "workspaces/:id",
  //     element: ProtectedRouteWrapper(
  //       <Layout component={<WorkSpace />} Backbutton={true} />
  //     ),
  //   },
  //   {
  //     path: "create-annotation-project/:id",
  //     element: ProtectedRouteWrapper(
  //       <Layout component={<AnnotationProject />} Backbutton={true} />
  //     ),
  //   },
  //   {
  //     path: "create-collection-project/:id",
  //     element: ProtectedRouteWrapper(
  //       <Layout component={<CollectionProject />} Backbutton={true} />
  //     ),
  //   },
  //   {
  //     path: "workspaces",
  //     element: ProtectedRouteWrapper(<Layout component={<WorkSpaces />} />),
  //   },
  //   {
  //     path: "my-organization/:orgId",
  //     element: ProtectedRouteWrapper(<Layout component={<MyOrganization />} />),
  //   },
  //   {
  //     path: "datasets",
  //     element: ProtectedRouteWrapper(<Layout component={<DatasetList />} />),
  //   },
  //   {
  //     path: "datasets/:datasetId",
  //     element: ProtectedRouteWrapper(
  //       <Layout component={<DatasetDetails />} Backbutton={true} />
  //     ),
  //   },
  // ]);
  // return routes;
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forget-password/confirm/:key/:token" element={<ConfirmForgetPassword />} />
        <Route
          path="/profile"
          element={ProtectedRouteWrapper(<Layout component={<UserProfilePage />} />)}
        />
         <Route
          path="/Change-Password"
          element={ProtectedRouteWrapper(<Layout component={<ChangePassword />} Backbutton={true} />)}
        />
        <Route
          path="/profile/:id"
          element={ProtectedRouteWrapper(<Layout component={<ProfilePage />} Backbutton={true}/>)}
        />
        <Route
          path="/projects"
          element={ProtectedRouteWrapper(<Layout component={<Dashboard />} />)}
        />
        <Route
          path="projects/:id"
          element={ProtectedRouteWrapper(
            <Layout component={<Projects />} Backbutton={true} backPressNavigationPath={"/projects"} />
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
          element={ProtectedRouteWrapper(
            <Layout component={<LSF />} />
            // <Layout component={<AnnotateTask />} />
          )}
        />
        <Route
          path="projects/:projectId/review/:taskId"
          element={ProtectedRouteWrapper(
            <Layout component={<ReviewLSF />} />
          )}
        />
        <Route
          path="workspaces/:id"
          element={ProtectedRouteWrapper(
            <Layout component={<WorkSpace />} Backbutton={true} />
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
          element={ProtectedRouteWrapper(<Layout component={<WorkSpaces />} />)}
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
          path="transliteration/"
          element={ProtectedRouteWrapper(
            <Layout component={<Transliteration />} Backbutton={true} />
          )}
        />
         <Route
          path="create-Dataset-Instance-Button"
          element={ProtectedRouteWrapper(
            <Layout component={<CreateDatasetInstanceButton />} Backbutton={true} />
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
