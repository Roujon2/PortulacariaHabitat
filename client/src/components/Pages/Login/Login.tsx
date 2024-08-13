import React from 'react';
import axios from 'axios';
import { AuthContext, AuthContextProps } from '../../../contexts/AuthContext';
import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import SignInButton from '../../Atoms/SignInButton/SignInButton';
import LoginDescription from '../../Atoms/LoginDescription/LoginDescription';
import './login.css';

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { reuleaux } from 'ldrs';


const serverUrl = process.env.REACT_APP_BACKEND_SERVER_URL as string;

// Login component
const Login: React.FC = () => {
    // Check if user is logged in
    const { loggedIn, loading, serverOnline } = useContext(AuthContext) as AuthContextProps;

    // State var to show desc or not
    const [showDesc, setShowDesc] = useState<boolean>(false);

    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

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

    // Event handling the show description
    const toggleDescription = () => {
        if(buttonLoading) return;

        setShowDesc(!showDesc);
    };

    return (

        <div className='login-page'>
            <div className='background'></div>

            <h1 className='login-app-name'>Spekboom Mapping</h1>

            <div className={`login-content`}>
                <div className='login-main'>
                    
                    <div className='login-signin'>
                        <SignInButton onClick={handleLogin} isLoading={buttonLoading} disabled={!serverOnline}/>

                        {!serverOnline && <p className='server-offline'>Server is offline. Try again later.</p>}
                    </div>
                </div>
            </div>

            <div className='login-footer'>
                <p>© 2024 Spekboom Mapping</p>
            </div>

        </div>
    );
};

export default Login;