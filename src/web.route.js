import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import Landing from "./ui/pages/container/Landing/index";
import Login from "./ui/pages/container/UserManagement/Login";
import ForgotPassword from "./ui/pages/container/UserManagement/ForgotPassword";
import Dashboard from "./ui/pages/container/Dashboard";
import Projects from "./ui/pages/container/Projects";
import { ThemeProvider } from "@mui/material/styles";
import ProjectSetting from "./ui/pages/container/Projects/ProjectSetting"
import WorkSpace from "./ui/pages/container/workspace/WorkSpace"
import themeDefault from "./ui/theme/theme";
import CreateAnnotationProject from "./ui/pages/container/workspace/CreateAnnotationProject"

const App = () => {
  let routes = useRoutes([
    { path: "/", element: <Landing /> },
    { path: "login", element: <Login /> },
    { path: "forgot-password", element: <ForgotPassword /> },
    { path: "dashboard", element: <Dashboard />},
    { path: "projects/:id", element: <Projects />},
    { path: "projects/:id/projectsetting", element: <ProjectSetting />},
    { path: "workspace/:id", element: <WorkSpace />},
    { path: "create-annotation-project/:id", element: <CreateAnnotationProject />},
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
