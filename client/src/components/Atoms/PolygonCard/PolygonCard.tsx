import React from "react";
import { Polygon, NewPolygon } from "../../../types/polygon";

import './polygonCard.css'

import { AiFillEdit } from "react-icons/ai";
import { FaMapLocationDot } from "react-icons/fa6";


interface PolygonCardProps {
    polygon: Polygon;
    shape: string;
}



const scaleCoords = (coords: google.maps.LatLngLiteral[], svgWidth: number, svgHeight:number) => {
    // Bounding box of coords
    const minLat = Math.min(...coords.map(coord => coord.lat));
    const maxLat = Math.max(...coords.map(coord => coord.lat));
    const minLng = Math.min(...coords.map(coord => coord.lng));
    const maxLng = Math.max(...coords.map(coord => coord.lng));

    // Ranges
    const latRange = maxLat - minLat || 0.0001;
    const lngRange = maxLng - minLng || 0.0001;

    // Scale coords to fit svgWidth and svgHeight
    return coords.map(coord => ({
        x: (coord.lng - minLng) / lngRange * svgWidth,
        y: svgHeight - ((coord.lat - minLat) / latRange) * svgHeight
    }));
}

const boxWidth = 100;
const boxHeight = 100;

// Polygon card component
const PolygonCard: React.FC<PolygonCardProps> = ({ polygon, shape }) => {
    // Scale coordinates to maintain relative shape
    const scaledCoords = scaleCoords(polygon.coordinates, boxWidth, boxHeight);

    // Handle button clicks
    const handleButtonClick = (action: string) => {
        console.log(`${action} button clicked`);
        // Implement button actions here
    };

    // If shape is card view
    if (shape === 'card') {

        return (
            <div className='polygon-card'>
                <input type="checkbox" className="polygon-card__checkbox" />   

                <div className="polgon-card__content">
                    <svg className="polygon-preview" viewBox={`0 0 ${boxWidth} ${boxHeight}`} width={boxWidth} height={boxHeight}>
                        <path d={`M ${scaledCoords.map(coord => `${coord.x} ${coord.y}`).join(' L ')} Z`} fill="none" stroke="black"/>
                    </svg>
                    <h2 className="polygon-title">{polygon.name}</h2>
                </div>

                <div className="polygon-buttons">
                    <FaMapLocationDot onClick={() => handleButtonClick('View')} className="polygon-button" />
                    <AiFillEdit onClick={() => handleButtonClick('Edit')} className="polygon-button" />
                </div>
            
            </div>
        );
    }
    else if (shape === 'list'){

        return (
            <div className="polygon-list">
                <h2 className="polygon-title">{polygon.name}</h2>
                <svg className="polygon-preview" viewBox={`0 0 ${boxWidth} ${boxHeight}`} width={boxWidth} height={boxHeight}>
                    <path d={`M ${scaledCoords.map(coord => `${coord.x} ${coord.y}`).join(' L ')} Z`} fill="none" stroke="black"/>
                </svg>
            
            </div>

        );
    }else{
        return (
            <div className="polygon-list">
                <h2 className="polygon-title">{polygon.name}</h2>
                <svg className="polygon-preview" viewBox={`0 0 ${boxWidth} ${boxHeight}`} width={boxWidth} height={boxHeight}>
                    <path d={`M ${scaledCoords.map(coord => `${coord.x} ${coord.y}`).join(' L ')} Z`} fill="none" stroke="black"/>
                </svg>
            
            </div>

        );
    }
};

export default PolygonCard;