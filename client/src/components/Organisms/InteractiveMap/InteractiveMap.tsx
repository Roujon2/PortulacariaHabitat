import React, { useState } from "react";
import './interactiveMap.css';
import { DrawingManagerF, GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import type { LoadScriptProps } from "@react-google-maps/api";
import SavePolygonMenu, {SavePolygonMenuProps} from "../../Atoms/SavePolygonMenu/SavePolygonMenu";
import {Polygon, NewPolygon } from "../../../types/polygon";

import polygonApi from "../../../api/polygonApi";

import axios from 'axios';

const libraries: LoadScriptProps['libraries'] = ['drawing'];

const mapOptions = {
    zoomControl: false,
    streetViewControl: false,
    disableDefaultUI: true,
};

// Component for displaying and functionality of interactive map
const InteractiveMap: React.FC = () => {
    const [showSavePolygonMenu, setShowSavePolygonMenu] = useState<boolean>(false);

    // Map state var
    const [map, setMap] = useState<google.maps.Map | null>(null);
    // Drawing manager state var
    const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);

    // State var for the selected drawn polygon
    const [selectedPolygon, setSelectedPolygon] = useState<NewPolygon | Polygon | null>(null);
    const [drawnPolygon, setDrawnPolygon] = useState<google.maps.Polygon | null>(null);


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
        console.log('Map loaded.');

        // Set the map state var
        setMap(map);
    }

    // Function to handle drawing manager load
    const onDrawingManagerLoad = (drawingManager: google.maps.drawing.DrawingManager) => {
        console.log('Drawing manager loaded:', drawingManager);

        // Set the drawing manager state var
        setDrawingManager(drawingManager);
    }

    // Function to handle polygon complete
    const onPolygonComplete = (polygon: google.maps.Polygon) => {
        // Change selected drawing cursor to hand
        if (drawingManager) {
            drawingManager.setDrawingMode(null);
        }

        console.log('Polygon complete. Coords: ', polygon.getPath().getArray());
        setShowSavePolygonMenu(true);

        // Create the polygon object
        const polygonObj: NewPolygon = {
            name: '',
            description: '',
            coordinates: polygon.getPath().getArray().map((coord) => ({ lat: coord.lat(), lng: coord.lng() })),
            locality: '',
            ownershipType: '',
            seriesName: '',
            notes: '',
            created: '',
        }

        setSelectedPolygon(polygonObj);

        // Set the drawn polygon to the polygon ref
        setDrawnPolygon(polygon);
    }

    // Function to handle the save polygon form submission
    const handleSave: SavePolygonMenuProps['onSave'] = async (formData) => {
        console.log('Save polygon form data:', formData);
        setShowSavePolygonMenu(false);

        // If there is no selected polygon, return
        if (!selectedPolygon) return;

        // Extract the polygon data from the form data and create new polygon object
        const newPolygon: NewPolygon = {
            ...selectedPolygon,
            name: formData.name,
            description: formData.description,
            coordinates: selectedPolygon.coordinates,
        }
        
        try{
            // Send polygon to backend and get polygon object
            const savedPolygon : Polygon | undefined = await polygonApi.savePolygon(newPolygon);
            
            // Retrieve id and set to selected
            setSelectedPolygon(savedPolygon || null);
        }catch(error){
            console.error("Error saving polygon:", error);
        }
    }

    // Function handling the cancel button on the save polygon form
    const handleCancel = () => {
        setShowSavePolygonMenu(false);
        if (drawnPolygon) {
            drawnPolygon.setMap(null);
        }
        setSelectedPolygon(null);
    }

    // Function to add an overlay to the map
    const addOverlay = (url: string) => {
        // If there is no map, return
        if (!map) return;

        const overlayMapParams = new google.maps.ImageMapType({
            getTileUrl: (coord: google.maps.Point, zoom: number) => {
                return url
                    .replace('{x}', coord.x.toString())
                    .replace('{y}', coord.y.toString())
                    .replace('{z}', zoom.toString());
            },
            tileSize: new google.maps.Size(256, 256),
            opacity: 0.5,
            name: 'NDVI'
        });

        map.overlayMapTypes.push(overlayMapParams);
    };

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
                    options={mapOptions}
                >
                    <DrawingManagerF
                        options={{
                            drawingControl: true,
                            drawingControlOptions: {
                                drawingModes: [google.maps.drawing.OverlayType.POLYGON],
                                position: google.maps.ControlPosition.TOP_LEFT,
                            },
                            polygonOptions: {
                                fillColor: '#FF0000',
                                fillOpacity: 0.35,
                                strokeWeight: 5,
                                clickable: false,
                                editable: true,
                                zIndex: 1,
                            },
                        }}
                        onPolygonComplete={onPolygonComplete}
                        onLoad={onDrawingManagerLoad}
                    />

                    {showSavePolygonMenu && <SavePolygonMenu onSave={handleSave} onCancel={handleCancel} />}

                </GoogleMap>
            )}
        </div>
        
    );
}

export default InteractiveMap;