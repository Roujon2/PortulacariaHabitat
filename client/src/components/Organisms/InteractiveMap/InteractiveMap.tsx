import React, { useState } from "react";
import './interactiveMap.css';
import { DrawingManager, GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import type { LoadScriptProps } from "@react-google-maps/api";

const libraries: LoadScriptProps['libraries'] = ['drawing'];

// Component for displaying and functionality of interactive map

const InteractiveMap: React.FC = () => {
    // Load the google maps api script
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
        libraries,
        id: 'google-map-script',
    });

    // Cache center
    const center = useMemo(() => ({ lat: -30.989205, lng: -64.486241  }), []);

    // Function to handle map loaded
    const onMapLoad = (map: google.maps.Map) => {
        // Set drawing manager options
        const drawingManager = new window.google.maps.drawing.DrawingManager({
            drawingControl: true,
            drawingControlOptions: {
                drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
                position: window.google.maps.ControlPosition.TOP_CENTER
            },
            polygonOptions: {
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                strokeWeight: 5,
                clickable: false,
                editable: true,
                zIndex: 1
            }
        });

        // Set drawing manager to map
        drawingManager.setMap(map);
    }


    // If there is an error loading the script
    if (loadError) return <div>Error loading maps</div>;

    return (
        <div className='interactive-map-container'>
            {!isLoaded ? <div>Loading...</div> : (
                <GoogleMap
                    mapContainerClassName="interactive-map"
                    center={center}
                    zoom={8}
                    onLoad={onMapLoad}
                >
                </GoogleMap>
            )}
        </div>
        
    );
}

export default InteractiveMap;