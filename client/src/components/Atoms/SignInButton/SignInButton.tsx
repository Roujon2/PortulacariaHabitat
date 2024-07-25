import React from 'react';
import './signInButton.css';
import GoogleButton from 'react-google-button';

// Sign in through Google button

interface SignInButtonProps {
    onClick: () => void;
    isLoading: boolean;
}

const SignInButton: React.FC<SignInButtonProps> = ({ onClick, isLoading }) => {
    return (
        <GoogleButton onClick={onClick} disabled={isLoading} className='sign-in__button'/>
    );
};

export default SignInButton;