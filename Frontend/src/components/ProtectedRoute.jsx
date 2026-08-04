import { Navigate, Outlet, useLocation } from "react-router-dom";

// Guards nested routes — redirects to /login if no token is present,
// and remembers where the user was headed so we can send them back after login.
export function ProtectedRoute() {
  const location = useLocation();
  const token = localStorage.getItem("pixora-token");

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
