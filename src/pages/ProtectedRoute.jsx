import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/signup" />;
  }
  return children;
};
export default ProtectedRoute;
