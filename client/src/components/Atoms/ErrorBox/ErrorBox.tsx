import React from "react";

import './errorBox.css';

interface ErrorBoxProps {
  message: string;
  handleExit: () => void;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ message, handleExit }) => {
  return (
    <div className="error-box">
        <div className="error-box-overlay"></div>
        <div className="error-box-content">
            <p className="error-message">{message}</p>
            <button className="error-box-button" onClick={handleExit}>Exit</button>
        </div>
    </div>
  );
};

export default ErrorBox;