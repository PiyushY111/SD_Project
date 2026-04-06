import { Navigate, Outlet } from 'react-router-dom';

// check local strorage for login status
const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem('user'); 

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
