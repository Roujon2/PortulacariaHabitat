import React, { useContext } from 'react';
import { AuthContext, AuthContextProps } from '../../../contexts/AuthContext';

import './home.css';

const serverUrl = process.env.REACT_APP_BACKEND_SERVER_URL as string;

const Home: React.FC = () => {
    const { user } = useContext(AuthContext) as AuthContextProps;


    console.log(user);

    if (!user) {
        return <p>Loading from Home...</p>;
    }

    return (
        <div className='home-page'>
            <h1>Welcome, {user.name}</h1>
            <p>{user.email}</p>
        </div>
    );
};

export default Home;