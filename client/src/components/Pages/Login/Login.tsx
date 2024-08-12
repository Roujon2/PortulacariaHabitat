import React from 'react';
import axios from 'axios';
import { AuthContext, AuthContextProps } from '../../../contexts/AuthContext';
import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import SignInButton from '../../Atoms/SignInButton/SignInButton';
import LoginDescription from '../../Atoms/LoginDescription/LoginDescription';
import './login.css';

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const serverUrl = process.env.REACT_APP_BACKEND_SERVER_URL as string;

// Login component
const Login: React.FC = () => {
    // Check if user is logged in
    const { loggedIn, loading } = useContext(AuthContext) as AuthContextProps;

    // State var to show desc or not
    const [showDesc, setShowDesc] = useState<boolean>(false);

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

    // Event handling the show description
    const toggleDescription = () => {
        setShowDesc(!showDesc);
    };

    return (
        
        <div className='login-page'>
            <div className='background'></div>

            <div className={`login-content ${showDesc ? 'show-desc' : ''}`}>
                <h1>Spekboom Mapping</h1>
                <SignInButton onClick={handleLogin} isLoading={buttonLoading}/>

                <div className='desc-arrow' onClick={toggleDescription}>
                    {showDesc ? <IoIosArrowUp /> : <IoIosArrowDown /> }
                </div>

                <div className={`login-desc-container ${showDesc ? 'show' : ''}`}>
                    {<LoginDescription/>}
                </div>
            </div>

            <div className='login-footer'>
                <p>© 2024 Spekboom Mapping</p>
            </div>

        </div>
    );
};

export default Login;