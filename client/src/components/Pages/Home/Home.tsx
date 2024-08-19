import React, { useContext } from 'react';
import axios from 'axios';
import { AuthContext, AuthContextProps } from '../../../contexts/AuthContext';
import InteractiveMap from '../../Organisms/InteractiveMap/InteractiveMap';
import SideNavigation from '../../Organisms/SideNavigation/SideNavigation';

import './home.css';

const serverUrl = process.env.REACT_APP_BACKEND_SERVER_URL as string;

const Home: React.FC = () => {
    const { user, checkLoginState } = useContext(AuthContext) as AuthContextProps;
        
    const handleLogout = async () => {
        try {
            await axios.get(`${serverUrl}/auth/logout`, { withCredentials: true });
            checkLoginState();
        } catch (error) {
            console.error(error);
        }
    };

    console.log(user);

    if (!user) {
        return <p>Loading from Home...</p>;
    }

    return (
        <div className='home-page'>
            <SideNavigation onLogoutClick={handleLogout} onMapClick={() => {}} />
            <h1>Welcome, {user.name}</h1>
            <p>{user.email}</p>
            <InteractiveMap />
        </div>
    );
};

export default Home;