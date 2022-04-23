import { Spinner } from '@chakra-ui/react';
import { Suspense, useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = () => {
  const [user] = useContext(UserContext);

  if (user.loading)
    return (
      <Suspense>
        <Spinner />
      </Suspense>
    );

  if (!user.data && !user.loading) {
    return <Navigate to="/" />;
  }

  if (!user.loading && user.data) {
    return <Outlet />;
  }
  return null;
};
export default ProtectedRoute;
