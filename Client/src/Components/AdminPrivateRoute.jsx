import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminPrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div>
      {currentUser && currentUser.isAdmin ? (
        <Outlet />
      ) : (
        <Navigate to="/sign-up" />
      )}
    </div>
  );
};
export default AdminPrivateRoute;
