import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import SideNavigation from "../../Organisms/SideNavigation/SideNavigation";
import InteractiveMap from "../../Organisms/InteractiveMap/InteractiveMap";

import './mainWrapper.css';

// Content imports
import Home from "../Home/Home";
import HelpMenu from "../../Organisms/HelpMenu/HelpMenu";
import ProfileMenu from "../../Organisms/ProfileMenu/ProfileMenu";

import Resizable from 'react-resizable-layout';

// Component to wrap all pages in
const MainWrapper: React.FC = ({ }) => {
    const location = useLocation();

    const [selectedMenu, setSelectedMenu] = React.useState<string>('help');

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
                <Resizable axis="x" min={100}>
                    {({ position, separatorProps }) => (
                        <div className="resizable-container" >
                            {/* Interactive Map */}
                            <div className="map-container" style={{ width: position }}>
                                <InteractiveMap />
                            </div>

                            {/* Resize Handle */}
                            <div className="resize-handle" {...separatorProps} />

                            {/* Content Wrapper */}
                            <div className="content-wrapper" style={{ width: `calc(100% - ${position}px)` }}>
                                {selectedMenu === 'map' && <Home />}
                                {selectedMenu === 'help' && <HelpMenu />}
                                {selectedMenu === 'profile' && <ProfileMenu />}
                            </div>
                        </div>
                    )}
                </Resizable>
            </div>
        </div>
    );
};

export default MainWrapper;