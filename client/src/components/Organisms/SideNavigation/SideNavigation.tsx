import React, { useContext } from "react";

// Nav sidebar imports
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

import { Link } from 'react-router-dom';

import axios from 'axios';
import { AuthContext, AuthContextProps } from '../../../contexts/AuthContext';

import './sideNavigation.css';

import { IoMdMenu } from "react-icons/io";
import { RiLogoutBoxFill } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
import { PiPolygonDuotone } from "react-icons/pi";
import { MdHelp } from "react-icons/md";



import LogoutConfirmation from "../../Atoms/LogoutConfirmation/LogoutConfirmation";


const serverUrl = process.env.REACT_APP_BACKEND_SERVER_URL as string;

interface SideNavigationProps {
    onNavigate: (menu: string) => void;
}


// Side navigation component
const SideNavigation: React.FC<SideNavigationProps> = ({onNavigate}) => {
    // Login state
    const { checkLoginState } = useContext(AuthContext) as AuthContextProps; 

    // Navigation collapse state
    const [collapsed, setCollapsed] = React.useState<boolean>(true);

    // Selected menu for navigation
    const [selectedMenu, setSelectedMenu] = React.useState<string>('polygons');

    // Logout confirmation
    const [showLogoutConfirmation, setShowLogoutConfirmation] = React.useState<boolean>(false);

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
            <Sidebar collapsed={collapsed}
                rootStyles={{
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                }}
            >
                <Menu
                    menuItemStyles={
                        {
                            button: ( {active, disabled} ) => ({
                                transition: 'all 0.3s',
                                ['&:hover']: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                },
                                backgroundColor: disabled ? 'rgba(0, 0, 0, 0.03)' : 'rgba(0, 0, 0, 0)',
                            })
                        }
                    }
                >
                    <MenuItem onClick={handleCollapse} icon={<IoMdMenu className={collapsed? 'item-collapse' : 'item-collapse-rotated'} />}>
                    </MenuItem>
                    <MenuItem icon={<MdAccountCircle />}  className={selectedMenu === 'profile' ? 'menu-item_active' : 'menu-item'} onClick={() => {setSelectedMenu('profile'); onNavigate('profile')}} disabled={selectedMenu === 'profile'} >
                        Profile
                    </MenuItem>
                    <MenuItem icon={<PiPolygonDuotone />}  className={selectedMenu === 'polygons' ? 'menu-item_active' : 'menu-item'} onClick={() => {setSelectedMenu('polygons'); onNavigate('polygons')}} disabled={selectedMenu === 'polygons'} >
                        Polygons
                    </MenuItem>
                    <MenuItem icon={<MdHelp />}  className={selectedMenu === 'help' ? 'menu-item_active' : 'menu-item'} onClick={() => {setSelectedMenu('help'); onNavigate('help')}} disabled={selectedMenu === 'help'} >
                        Help
                    </MenuItem>
                </Menu>

                <div className="logout-container" onClick={() => setShowLogoutConfirmation(true)}>
                    <RiLogoutBoxFill className="logout-icon" />
                    <p className={collapsed? 'logout-text' : 'logout-text-expanded'}>Logout</p>
                </div>
            </Sidebar>

            {showLogoutConfirmation && (
                <>
                    <div className='logout-confirmation-overlay active'></div>
                    <LogoutConfirmation confirmLogout={handleLogout} cancelLogout={() => setShowLogoutConfirmation(false)} />
                </>
            )}
        </div>
    );
};

export default SideNavigation;