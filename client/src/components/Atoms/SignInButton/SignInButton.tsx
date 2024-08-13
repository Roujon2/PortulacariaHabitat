import React from 'react';
import './signInButton.css';
import GoogleButton from 'react-google-button';

import { reuleaux } from 'ldrs';

// Sign in through Google button

interface SignInButtonProps {
    onClick: () => void;
    isLoading: boolean;
    disabled?: boolean;
}

const SignInButton: React.FC<SignInButtonProps> = ({ onClick, isLoading, disabled }) => {

    reuleaux.register();

    return (
        <div className='sign-in_container'>
            {isLoading ? 
                React.createElement('l-reuleaux', {
                    size: "37",
                    stroke: "5",
                    'stroke-length': "0.15",
                    'bg-opacity': "0.1",
                    speed: "1.2", 
                    color: '#482895'
                })
                : 
                <GoogleButton onClick={onClick} disabled={disabled} className='sign-in__button'/> }
        </div>

    );
};

export default SignInButton;