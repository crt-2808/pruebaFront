import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { getUserRole, isAuthenticated } from './auth';
import { useUserContext } from '../userProvider';

const ProtectedRoutes = ({ allowedRoles }) => {
  const user_auth = isAuthenticated();
  const user_role = getUserRole();
  const { isBlocked } = useUserContext();
  if (isBlocked) {
    // Si el usuario está bloqueado, redirige a la ruta de bloqueo
    return <Navigate to='/blocked' />;
  }

  return user_auth ? (
    allowedRoles.includes(user_role) ? (
      <Outlet />
    ) : (
      <Navigate to='/unAuthorized' />
    )
  ) : (
    <Navigate to='/' />
  );
};

export default ProtectedRoutes;
