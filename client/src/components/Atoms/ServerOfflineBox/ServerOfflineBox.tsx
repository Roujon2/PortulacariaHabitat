import React from "react";

import { TbReload } from "react-icons/tb";

import './serverOfflineBox.css';


// Component to display a message when the server is offline
const ServerOfflineBox: React.FC = () => {
    return (
        <div className='server-offline-box'>
            <div className="server-offline-box-overlay"></div>
            <div className="server-offline-box-content">
                <h1> Connection Interrupted </h1>
                <p> Failed to establish connection with the server. Please check your internet connection and try again. </p>
                <button onClick={() => window.location.reload()} className="server-offline-reload">
                    <TbReload />
                </button>
            </div>
        </div>
    );
};

export default ServerOfflineBox;