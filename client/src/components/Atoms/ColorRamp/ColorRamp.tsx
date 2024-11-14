import React from 'react';

import './colorRamp.css';


// Component props
interface ColorRampProps {
    min: number;
    max: number;
    palette: string[];
}


// Component
const ColorRamp: React.FC<ColorRampProps> = ({ min, max, palette }) => {
    // Convert palette colors into CSS linear gradient
    const colors = palette.join(', ');
    const gradient = `linear-gradient(to right, ${colors})`;

    return (
        <div className="color-ramp">
            <div className="color-ramp__gradient" style={{ background: gradient }} />
            <div className="color-ramp__labels">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};

export default ColorRamp;