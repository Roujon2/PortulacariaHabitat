import React from "react";

// Nav sidebar imports
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

import './sideNavigation.css';

import { IoMdMenu } from "react-icons/io";
import { FaMapLocationDot } from "react-icons/fa6";
import { RiLogoutBoxFill } from "react-icons/ri";

interface SideNavigationProps {
    onMapClick: () => void;
    onLogoutClick: () => void;
}



// Side navigation component
const SideNavigation: React.FC<SideNavigationProps> = ({ onMapClick, onLogoutClick }) => {
    const [collapsed, setCollapsed] = React.useState<boolean>(true);

    const handleCollapse = () => {
        setCollapsed(!collapsed);
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

                <div className="logout-container" onClick={onLogoutClick}>
                    <RiLogoutBoxFill className="logout-icon" />
                    <p className={collapsed? 'logout-text' : 'logout-text-expanded'}>Logout</p>
                </div>

            </Sidebar>
        </div>
    );
};

export default SideNavigation;