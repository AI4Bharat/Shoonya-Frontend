import { BrowserRouter as Router, Navigate, useRoutes } from "react-router-dom";
// import Landing from "./ui/pages/container/Landing/index";
import Login from "./ui/pages/container/UserManagement/Login";
import ForgotPassword from "./ui/pages/container/UserManagement/ForgotPassword";
import Dashboard from "./ui/pages/container/Project/ProjectList";
import Projects from "./ui/pages/container/Project/ProjectDetails";
import { ThemeProvider } from "@mui/material/styles";
import ProjectSetting from "./ui/pages/container/Project/ProjectSetting"
import WorkSpace from "./ui/pages/container/Workspace/WorkSpaceDetails"
import themeDefault from "./ui/theme/theme";
import AnnotationProject from "./ui/pages/container/Workspace/AnnotationProject"
import WorkSpaces from "./ui/pages/container/Workspace/WorkSpaceList"
import Layout from "./ui/Layout";
import MyOrganization from "./ui/pages/container/Organization/MyOrganization";
import CollectionProject from "./ui/pages/container/Workspace/CollectionProject"


const ProtectedRoute = ({ user, children }) => {
  if (!authenticateUser()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const ProtectedRouteWrapper = (component) => {
  return <ProtectedRoute>{component}</ProtectedRoute>
}

const authenticateUser = () => {
  const access_token = localStorage.getItem("shoonya_access_token");
  if (access_token) {
    return true
  } else {
    return false;
  }
}

const App = () => {
  let routes = useRoutes([
    // { path: "/", element: <Landing /> }, my-organization
    {
      path: "/",
      element: <Login />
    },
    {
      path: "forgot-password",
      element: <ForgotPassword />
    },
    {
      path: "projects",
      element: ProtectedRouteWrapper(<Layout component={<Dashboard />} />)
    },
    {
      path: "projects/:id",
      element: ProtectedRouteWrapper(<Layout component={<Projects />}  Backbutton={true}/>)
    },
    {
      path: "projects/:id/projectsetting",
      element: ProtectedRouteWrapper(<Layout component={<ProjectSetting />}  Backbutton={true}/>)
    },
    {
      path: "workspaces/:id",
      element: ProtectedRouteWrapper(<Layout component={<WorkSpace />} Backbutton={true}/>)
    },
    {
      path: "create-annotation-project/:id",
      element: ProtectedRouteWrapper(<Layout component={<AnnotationProject />} Backbutton={true}/>)
    },
    {
      path: "create-collection-project/:id",
      element: ProtectedRouteWrapper(<Layout component={<CollectionProject />} Backbutton={true}/>)
    },
    {
      path: "workspaces",
      element: ProtectedRouteWrapper(<Layout component={<WorkSpaces />}   />)
    },
    {
      path: "my-organization",
      element: ProtectedRouteWrapper(<Layout component={<MyOrganization />}  />)
    },

  ]);
  return routes;
};

const AppWrapper = () => {
  return (
    <Router>
      <ThemeProvider theme={themeDefault}>
        <App />
      </ThemeProvider>
    </Router>
  );
};

export default AppWrapper;
