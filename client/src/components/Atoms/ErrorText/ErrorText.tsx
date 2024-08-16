import React from "react";

interface ErrorTextProps {
    message: string;
}

const ErrorText: React.FC<ErrorTextProps> = ({ message }) => {
    return (
        <p className='error-text'>{message}</p>
    );
};

export default ErrorText;