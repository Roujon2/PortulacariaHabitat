import React from "react";

// Nav sidebar imports
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

import './sideNavigation.css';

import { IoMdMenu } from "react-icons/io";
import { FaMapLocationDot } from "react-icons/fa6";
import { RiLogoutBoxFill } from "react-icons/ri";


// Side navigation component
const SideNavigation: React.FC = () => {
    const [collapsed, setCollapsed] = React.useState<boolean>(true);

    const handleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className='sidebar-container'>
            <Sidebar
            collapsed={collapsed}>
                
                <Menu>
                    <MenuItem onClick={handleCollapse} icon={<IoMdMenu className={collapsed? '' : 'rotated'} />}>
                    </MenuItem>
                    <MenuItem icon={<FaMapLocationDot />}>
                        Map
                    </MenuItem>
                    <MenuItem icon={<RiLogoutBoxFill />}>
                        Logout
                    </MenuItem>
                </Menu>

            </Sidebar>
        </div>
    );
};

export default SideNavigation;