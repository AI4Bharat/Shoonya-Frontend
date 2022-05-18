import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import Landing from "./pages/container/Landing";
import Login from "./pages/container/UserManagement/Login";
import ForgotPassword from "./pages/container/UserManagement/ForgotPassword";

const App = () => {
  let routes = useRoutes([
    { path: "/", element: <Landing /> },
    { path: "login", element: <Login /> },
    { path: "forgot-password", element: <ForgotPassword /> },
  ]);
  return routes;
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
