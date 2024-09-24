import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import SideNavigation from "../../Organisms/SideNavigation/SideNavigation";

import './mainWrapper.css';

// Content imports
import Home from "../Home/Home";


// Component to wrap all pages in
const MainWrapper: React.FC = ({ }) => {
    const location = useLocation();

    const [selectedMenu, setSelectedMenu] = React.useState<string>('polygons');

    const handleNav = (menu: string) => {
        setSelectedMenu(menu);
    };

    // Conditionally render side navigation based on the current route (this is a failsafe, the router should handle this)
    const showSideNav = location.pathname !== "/login" && location.pathname !== "/auth/callback";

    const showMap = location.pathname !== "/login" && location.pathname !== "/auth/callback";

    return (
        <div className="main-wrapper">
            {showSideNav && <SideNavigation onNavigate={handleNav} />}

            <div className="main-content">
                <Home selectedMenu={selectedMenu} />
            </div>
        </div>
    );
};

export default MainWrapper;