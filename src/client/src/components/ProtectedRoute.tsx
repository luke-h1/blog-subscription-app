import { Spinner } from '@chakra-ui/react';
import { Suspense, useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = () => {
  const { loading, data } = useContext(UserContext);
  if (loading)
    return (
      <Suspense>
        <Spinner />
      </Suspense>
    );

  if (!data && !loading) {
    return <Navigate to="/" />;
  }

  if (!loading && data) {
    return <Outlet />;
  }
  return null;
};
export default ProtectedRoute;
