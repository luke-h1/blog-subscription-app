import { Spinner } from '@chakra-ui/react';
import { Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { loading, user } = useAuthContext();
  if (loading)
    return (
      <Suspense>
        <Spinner />
      </Suspense>
    );

  if (!user && !loading) {
    return <Navigate to="/" />;
  }

  if (!loading && user) {
    return <Outlet />;
  }
  return null;
};
export default ProtectedRoute;
