import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { getUserRole, isAuthenticated } from './auth';

const ProtectedRoutes = ({allowedRoles}) => {
    const user_auth=isAuthenticated();
    const user_role=getUserRole();
    return(
        user_auth?(
            allowedRoles.includes(user_role)?(
                <Outlet />
            ):(
                
                <Navigate to="/unAuthorized" />
            )
        ):(
        <Navigate to="/login"/>
        )
    )
};

export default ProtectedRoutes;