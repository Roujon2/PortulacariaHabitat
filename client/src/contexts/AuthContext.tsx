import axios from 'axios';
import React, { useEffect, useState, createContext, useCallback, ReactNode } from 'react';
import { User } from '../types/user';

const serverUrl = process.env.REACT_APP_BACKEND_SERVER_URL as string;

// AuthContext definition for AuthContextProvider
interface AuthContextProps {
    loggedIn: boolean | null;
    user: User | null;
    loading: boolean;
    serverOnline: boolean;
    checkLoginState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthContextProviderProps {
    children: ReactNode;
}

// Auth component
const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    // Var states
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [serverOnline, setServerOnline] = useState<boolean>(true);

    const checkLoginState = useCallback(async () => {
        try {
            // Call loggedIn endpoint
            const {
                data: { loggedIn, user },
            } = await axios.get(`${serverUrl}/auth/logged-in`, { withCredentials: true });

            // If user is null
            if (!user) {
                // Set vars
                setLoggedIn(false);
                setUser(null);
                return;
            }

            // Create a user object
            const resUser: User = {
                name: user.name,
                email: user.email,
                picture: user.picture,
            }
            
            // Set vars
            setLoggedIn(loggedIn);
            setUser(resUser);
        } catch (error) {
            // Set vars
            setLoggedIn(false);
            setUser(null);

            // Log error
            console.error(error);
        }finally{
            // Set loading to false
            setLoading(false);
        }
    }, []);

    // Checking server status
    const checkServerStatus = useCallback(async () => {
        try {
            // Ping server
            await axios.get(`${serverUrl}/health`);
            setServerOnline(true);
        } catch (error) {
            setServerOnline(false);
            console.error("Server is offline:", error);
        }
    }, []);

    // UseEffect to check login state on mount
    useEffect(() => {
        checkLoginState();
        checkServerStatus();
    }, [checkLoginState, checkServerStatus]);

    return(
        <AuthContext.Provider value={{ loggedIn, user, loading, checkLoginState, serverOnline }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthContextProvider };
// Export types
export type { AuthContextProps };
