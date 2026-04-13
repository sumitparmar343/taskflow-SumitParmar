import { Navigate } from "react-router-dom";
import { getToken } from "../utils/storage";

const ProtectedRoute = ({ children }: any) => {
  const token = getToken();

  if (!token) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
