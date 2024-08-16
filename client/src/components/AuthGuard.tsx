import React, { useContext, ReactNode } from 'react';
import { AuthContext, AuthContextProps } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
    children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    // Check login context
    const { loggedIn, loading } = useContext(AuthContext) as AuthContextProps;

    // Just in case
    if (loggedIn === null) {
        return <Navigate to="/login" />
    }

    // If not logged in
    if (loggedIn === false) {
        console.log('Redirecting to login');
        // Redirect to login page
        return <Navigate to="/login" />;
    }

    // If logged in
    return <>{children}</>
};

export default AuthGuard;