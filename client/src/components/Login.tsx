import React from 'react';
import axios from 'axios';

const serverUrl = process.env.REACT_APP_BACKEND_SERVER_URL as string;

// Login component
const Login: React.FC = () => {
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