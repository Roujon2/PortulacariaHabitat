import React from "react";
import { Polygon, NewPolygon } from "../../../types/polygon";

import './polygonCard.css'

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

    const [clicked, setClicked] = React.useState(false);

    // If shape is card view
    if (shape === 'card') {

        return (
            <div className='polygon-card' onClick={() => setClicked(true)}>
                <input type="checkbox" className="polygon-card__checkbox" />   
                
                <svg className="polygon-preview" viewBox={`0 0 ${boxWidth} ${boxHeight}`} width={boxWidth} height={boxHeight}>
                    <path d={`M ${scaledCoords.map(coord => `${coord.x} ${coord.y}`).join(' L ')} Z`} fill="none" stroke="black"/>
                </svg>
                <h2 className="polygon-title">{polygon.name}</h2>
                <div className="polygon-tags">
                    {polygon.tags && polygon.tags.length > 0 ? (
                        polygon.tags.map((tag, index) => (
                            <span key={index} className="polygon-tag">
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span className="polygon-tag">No tags</span>
                    )}
                </div>
            
            </div>
        );
    }
    else if (shape === 'list'){

        return (
            <div className="polygon-list">
                <h2 className="polygon-title">{polygon.name}</h2>
                <div className="polygon-tags">
                    {polygon.tags && polygon.tags.length > 0 ? (
                        polygon.tags.map((tag, index) => (
                            <span key={index} className="polygon-tag">
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span className="polygon-tag">No tags</span>
                    )}
                </div>
                <svg className="polygon-preview" viewBox={`0 0 ${boxWidth} ${boxHeight}`} width={boxWidth} height={boxHeight}>
                    <path d={`M ${scaledCoords.map(coord => `${coord.x} ${coord.y}`).join(' L ')} Z`} fill="none" stroke="black"/>
                </svg>
            
            </div>

        );
    }else{
        return (
            <div className="polygon-list">
                <h2 className="polygon-title">{polygon.name}</h2>
                <div className="polygon-tags">
                    {polygon.tags && polygon.tags.length > 0 ? (
                        polygon.tags.map((tag, index) => (
                            <span key={index} className="polygon-tag">
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span className="polygon-tag">No tags</span>
                    )}
                </div>
                <svg className="polygon-preview" viewBox={`0 0 ${boxWidth} ${boxHeight}`} width={boxWidth} height={boxHeight}>
                    <path d={`M ${scaledCoords.map(coord => `${coord.x} ${coord.y}`).join(' L ')} Z`} fill="none" stroke="black"/>
                </svg>
            
            </div>

        );
    }
};

export default PolygonCard;