import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUser } from "../../store/auth/authSlice";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector(getUser);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
