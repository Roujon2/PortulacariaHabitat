import React from 'react';
import axios from 'axios';
import { AuthContext, AuthContextProps } from '../../../contexts/AuthContext';
import { useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import SignInButton from '../../Atoms/SignInButton/SignInButton';
import LoginDescription from '../../Atoms/LoginDescription/LoginDescription';
import './login.css';

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { reuleaux } from 'ldrs';
import ErrorText from '../../Atoms/ErrorText/ErrorText';


const serverUrl = process.env.REACT_APP_BACKEND_SERVER_URL as string;

// Login component
const Login: React.FC = () => {
    // Check if user is logged in
    const { loggedIn, loading, serverOnline, checkServerStatus } = useContext(AuthContext) as AuthContextProps;

    // Error message state var
    const [errorMessage, setErrorMessage] = useState<string>('');

    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const location = useLocation();

    // Use effect
    useEffect(() => {
        // Extract the error query parameter
        const queryParams = new URLSearchParams(location.search);
        const error = queryParams.get('error');

        if (error) {
            setErrorMessage(error);
        }

        
    }, [location.search]);

    // Register reuleaux
    reuleaux.register('loading-reuleaux');

    // If loading return loading
    if (loading) {
        return(
            <div className='login-page'>
                <div className='background'></div>

                <h1 className='login-app-name'>Spekboom Mapping</h1>

                <div className={`login-content ${loading ? 'loading' : ''}`}>
                    <div className='login-main'>
                        <div className='spinner-container'>
                            {React.createElement('loading-reuleaux', {
                                size: "50",
                                stroke: "5",
                                'stroke-length': "0.15",
                                'bg-opacity': "0.1",
                                speed: "1.2", 
                                color: '#482895'
                            })}
                        </div>
                    </div>
                </div>

                <div className='login-footer'>
                    <p>© 2024 Spekboom Mapping</p>
                </div>
            </div>
        );
    }

    // If logged in navigate to home
    if (loggedIn) {
        console.log('Redirecting to home');
        return <Navigate to="/" />;
    }


    const handleLogin = async () => { 
        // Set button loading
        setButtonLoading(true);

        // Check server status that changes the serverOnline state
        checkServerStatus();
        try{
            // Get auth url from backend
            const { data: {url} } = await axios.get(`${serverUrl}/auth/url`);

            // Navigate to google consent screen
            window.location.assign(url);
        }catch(error){
            console.error(error);
            setButtonLoading(false);
            setErrorMessage('Authentication failed.');
        }
    }

    return (

        <div className='login-page'>
            <div className='background'></div>

            <h1 className='login-app-name'>Spekboom Mapping</h1>

            <div className={`login-content`}>
                <div className='login-main'>
                    
                    <div className='login-signin'>
                        <SignInButton onClick={handleLogin} isLoading={buttonLoading} disabled={!serverOnline}/>

                        {!serverOnline && <ErrorText message='Connection error. Verify internet connection and try again.' />}
                        {errorMessage && <ErrorText message={errorMessage} />}
                    </div>
                </div>
            </div>

            <div className='login-footer'>
                <p>© 2024 Portulacaria Ltd</p>
            </div>

        </div>
    );
};

export default Login;