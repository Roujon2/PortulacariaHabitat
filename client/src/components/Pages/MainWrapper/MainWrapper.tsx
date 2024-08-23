import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import SideNavigation from "../../Organisms/SideNavigation/SideNavigation";

import InteractiveMap from "../../Organisms/InteractiveMap/InteractiveMap";

import './mainWrapper.css';


// Component to wrap all pages in
const MainWrapper: React.FC = ({ }) => {
    const location = useLocation();

    // Conditionally render side navigation based on the current route (this is a failsafe, the router should handle this)
    const showSideNav = location.pathname !== "/login" && location.pathname !== "/auth/callback";

    const showMap = location.pathname !== "/login" && location.pathname !== "/auth/callback";

    return (
        <div className="main-wrapper">
            {showSideNav && <SideNavigation />}

            <div className="main-content">

                <div className="map-container" style={{ display: showMap ? 'flex' : 'none' }}>
                    <InteractiveMap />
                </div>

                <div className="content-wrapper">
                    <Outlet />
                </div>

            </div>
        </div>
    );
};

export default MainWrapper;