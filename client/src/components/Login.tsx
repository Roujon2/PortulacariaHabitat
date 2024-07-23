import React from 'react';
import axios from 'axios';
import { AuthContext, AuthContextProps } from '../contexts/AuthContext';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

const serverUrl = process.env.REACT_APP_BACKEND_SERVER_URL as string;

// Login component
const Login: React.FC = () => {
    // Check if user is logged in
    const { loggedIn, loading } = useContext(AuthContext) as AuthContextProps;

    // If loading return loading
    if (loading) {
        return <p>Loading...</p>;
    }

    // If logged in navigate to home
    if (loggedIn) {
        console.log('Redirecting to home');
        return <Navigate to="/" />;
    }

    const handleLogin = async () => { 
        try{
            // Get auth url from backend
            const { data: {url} } = await axios.get(`${serverUrl}/auth/url`);

            // Navigate to google consent screen
            window.location.assign(url);
        }catch(error){
            console.error(error);
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin}>Login with Google</button>
        </div>
    );
};

export default Login;