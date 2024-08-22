import React, { useContext } from "react";

// Nav sidebar imports
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

import axios from 'axios';
import { AuthContext, AuthContextProps } from '../../../contexts/AuthContext';

import './sideNavigation.css';

import { IoMdMenu } from "react-icons/io";
import { FaMapLocationDot } from "react-icons/fa6";
import { RiLogoutBoxFill } from "react-icons/ri";

const serverUrl = process.env.REACT_APP_BACKEND_SERVER_URL as string;

interface SideNavigationProps {

}


// Side navigation component
const SideNavigation: React.FC<SideNavigationProps> = ({}) => {
    // Login state
    const { checkLoginState } = useContext(AuthContext) as AuthContextProps; 
    const [collapsed, setCollapsed] = React.useState<boolean>(true);

    const handleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const handleLogout = async () => {
        try {
            await axios.get(`${serverUrl}/auth/logout`, { withCredentials: true });
            checkLoginState();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='sidebar-container'>
            <Sidebar collapsed={collapsed}>
    
                <Menu>
                    <MenuItem onClick={handleCollapse} icon={<IoMdMenu className={collapsed? 'item-collapse' : 'item-collapse-rotated'} />}>
                    </MenuItem>
                    <MenuItem icon={<FaMapLocationDot />}>
                        Map
                    </MenuItem>
                </Menu>

                <div className="logout-container" onClick={handleLogout}>
                    <RiLogoutBoxFill className="logout-icon" />
                    <p className={collapsed? 'logout-text' : 'logout-text-expanded'}>Logout</p>
                </div>

            </Sidebar>
        </div>
    );
};

export default SideNavigation;