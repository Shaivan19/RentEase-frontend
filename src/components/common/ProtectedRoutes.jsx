import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role, allowedRoles }) => {
  if (!role) {
    return <Navigate to="/login" />;
  }
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/home" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
