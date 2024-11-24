import React from 'react';

import './colorRamp.css';


// Component props
interface ColorRampProps {
    min: string;
    max: string;
    palette: string[];
}


// Component
const ColorRamp: React.FC<ColorRampProps> = ({ min, max, palette }) => {
    // Convert palette colors into CSS linear gradient
    const colors = palette.join(', ');

    return (
        <div className="color-bar-container">
            <div className='color-bar-title'>
                <span>Spekboom Growth Probability</span>
            </div>
            <div
                className="color-bar"
                style={{ background: `linear-gradient(to right, ${colors})` }}
            />
            <div className="color-bar-labels">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};

export default ColorRamp;