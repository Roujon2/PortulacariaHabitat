import React from 'react';
import axios from 'axios';
import { AuthContext, AuthContextProps } from '../../../contexts/AuthContext';
import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import SignInButton from '../../Atoms/SignInButton/SignInButton';
import './login.css';

const serverUrl = process.env.REACT_APP_BACKEND_SERVER_URL as string;

// Login component
const Login: React.FC = () => {
    // Check if user is logged in
    const { loggedIn, loading } = useContext(AuthContext) as AuthContextProps;

    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

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
        // Set button loading
        setButtonLoading(true);
        try{
            // Get auth url from backend
            const { data: {url} } = await axios.get(`${serverUrl}/auth/url`);

            // Navigate to google consent screen
            window.location.assign(url);
        }catch(error){
            console.error(error);
            setButtonLoading(false);
        }
    }

    return (
        <div className='login-page'>
            <h1>Spekboom Mapping</h1>
            <SignInButton onClick={handleLogin} isLoading={buttonLoading}/>
        </div>
    );
};

export default Login;