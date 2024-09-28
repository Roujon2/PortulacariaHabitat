import React from "react";
import { Tooltip, TooltipProps } from "@mui/material";

import './hoverText.css';

// Custom tooltip settings
const defaultTooltipSettings: Partial<TooltipProps> = {
    enterDelay: 1200,
    leaveDelay: 200,
    arrow: true,
    placement: "bottom",
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