import { BrowserRouter as Router, Navigate, useRoutes } from "react-router-dom";
import Landing from "./ui/pages/container/Landing/index";
import Login from "./ui/pages/container/UserManagement/Login";
import ForgotPassword from "./ui/pages/container/UserManagement/ForgotPassword";
import Dashboard from "./ui/pages/container/Dashboard";
import Projects from "./ui/pages/container/Projects";
import { ThemeProvider } from "@mui/material/styles";
import ProjectSetting from "./ui/pages/container/Projects/ProjectSetting"
import WorkSpace from "./ui/pages/container/workspace/WorkSpace"
import themeDefault from "./ui/theme/theme";
import AnnotationProject from "./ui/pages/container/workspace/AnnotationProject"
import WorkSpaces from "./ui/pages/container/Dashboard/WorkSpaces"
import Layout from "./ui/Layout";


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
      element: ProtectedRouteWrapper(<Layout component={<Projects />} />)
    },
    {
      path: "projects/:id/projectsetting",
      element: ProtectedRouteWrapper(<Layout component={<ProjectSetting />} />)
    },
    {
      path: "workspaces/:id",
      element: ProtectedRouteWrapper(<Layout component={<WorkSpace />} />)
    },
    {
      path: "create-annotation-project/:id",
      element: ProtectedRouteWrapper(<Layout component={<AnnotationProject />} />)
    },
    {
      path: "workspaces",
      element: ProtectedRouteWrapper(<Layout component={<WorkSpaces />} />)
    },
    {
      path: "my-organization",
      element: ProtectedRouteWrapper(<Layout component={null} />)
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
