import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { SessionManager } from './sessionManager';
import { useUserContext } from '../userProvider';

const ProtectedRoutes = ({ allowedRoles }) => {
  const { isBlocked } = useUserContext();
  const isValidSession = SessionManager.isSessionValid();
  const userRole = SessionManager.getRole();

  if (isBlocked) {
    return <Navigate to='/blocked' replace />;
  }

  if (!isValidSession) {
    return <Navigate to='/' replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to='/unAuthorized' replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
