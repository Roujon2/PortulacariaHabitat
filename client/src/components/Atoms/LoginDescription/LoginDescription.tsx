import React from 'react';
import './loginDescription.css';

// Login description component
const LoginDescription: React.FC = () => {
    return (
        <div className='login-desc'>
            <p>
                Spekboom Mapping is a web application that allows users to map the location of spekboom plants. 
                Spekboom is a plant native to South Africa and is known for its carbon sequestration capabilities. 
                By mapping the location of spekboom plants, users can help contribute to the fight against climate change.
            </p>
        </div>
    );
}

export default LoginDescription;