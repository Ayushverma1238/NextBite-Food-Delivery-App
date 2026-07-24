import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, isAuthenticated, isLoading } = useSelector(
  (state) => state.auth
);

if (isLoading) {
  return (
    <div className="flex items-center justify-center h-screen">
      Loading...
    </div>
  );
}

if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}

if (
  
  !allowedRole.includes(user?.role)
) {
  return <Navigate to="/" replace />;
}

return children;
};

export default ProtectedRoute;
