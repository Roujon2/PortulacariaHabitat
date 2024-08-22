import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import SideNavigation from "../../Organisms/SideNavigation/SideNavigation";


// Component to wrap all pages in
const MainWrapper: React.FC = ({ }) => {
    const location = useLocation();

    // Conditionally render side navigation based on the current route (this is a failsafe, the router should handle this)
    const showSideNav = location.pathname !== "/login" && location.pathname !== "/auth/callback";

    return (
        <div className="main-wrapper">
            {showSideNav && <SideNavigation />}
            <div className="content-wrapper">
                <Outlet />
            </div>
        </div>
    );
};

export default MainWrapper;