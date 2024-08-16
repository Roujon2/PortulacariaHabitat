import React, { useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext, AuthContextProps } from '../contexts/AuthContext';

const serverUrl = process.env.REACT_APP_BACKEND_SERVER_URL as string;

// Callback component
const Callback: React.FC = () => {
    const called = useRef(false);
    const navigate = useNavigate();
    const { checkLoginState, loggedIn } = useContext(AuthContext) as AuthContextProps;

    useEffect(() => {
        (async () => {
           
            try{
                if (called.current) return;
                called.current = true;

                const res = await axios.get(`${serverUrl}/auth/token${window.location.search}`);

                await checkLoginState();
                navigate('/');
            }catch (error){
                console.error(error);
                // Navigate to login with error added
                navigate('/login?error=auth_failed');
            }

        })();
    }, [checkLoginState, navigate]);

    return <></>
};

export default Callback;