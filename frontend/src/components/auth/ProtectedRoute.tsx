import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireLibrarian?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireLibrarian = false }) => {
    const { isAuthenticated, isLibrarian } = useAuth();

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    if (requireLibrarian && !isLibrarian) {
        // Redirect to regular dashboard if librarian access required but user is not librarian
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
