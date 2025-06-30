import React from 'react';
import { Navigate } from 'react-router-dom';
import { authUtils } from '../../api/authApi';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const isAuthenticated = authUtils.isAuthenticated();
    const currentUser = authUtils.getCurrentUser();

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && currentUser.role !== requiredRole) {
        // Redirect to unauthorized page if role doesn't match
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
