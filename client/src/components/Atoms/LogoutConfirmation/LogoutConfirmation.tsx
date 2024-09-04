import React from "react";

import './logoutConfirmation.css';


interface LogoutConfirmationProps {
    confirmLogout: () => void;
    cancelLogout: () => void;
}

// Logout confirmation box component
const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({ confirmLogout, cancelLogout }) => {
    return (
        <div className='logout-confirmation-container'>
            <div className='logout-confirmation-box'>
                <div className='logout-confirmation-header'>
                    <h3 className='logout-confirmation-text'>Are you sure you want to logout?</h3>
                    <h4 className='logout-confirmation-subtext'>All unsaved changes will be lost.</h4>
                </div>
                <div className='logout-confirmation-buttons'>
                    <button className='logout-confirmation-button cancel' onClick={cancelLogout}>Cancel</button>
                    <button className='logout-confirmation-button confirm' onClick={confirmLogout}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmation;