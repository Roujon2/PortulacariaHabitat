import React from "react";
import { Tooltip, TooltipProps } from "@mui/material";

import './hoverText.css';

// Custom tooltip settings
const defaultTooltipSettings = {
    enterDelay: 500,
    leaveDelay: 200,
    arrow: true,
}

interface HoverTextProps extends TooltipProps {
    title: string;
}

const HoverText: React.FC<HoverTextProps> = ({ title, children, ...props }) => {
    return (
        <Tooltip {...defaultTooltipSettings} title={title} {...props}  {...defaultTooltipSettings}>
            {children}
        </Tooltip>
    )
};


export default HoverText;