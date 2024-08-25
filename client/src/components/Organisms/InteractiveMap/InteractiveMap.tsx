import React, { useState } from "react";
import './interactiveMap.css';
import { DrawingManagerF, GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import type { LoadScriptProps } from "@react-google-maps/api";
import SavePolygonMenu, {SavePolygonMenuProps} from "../../Atoms/SavePolygonMenu/SavePolygonMenu";
import {Polygon} from "../../../types/polygon";

import axios from 'axios';
import { url } from "inspector";
import { get } from "http";
import Callback from './../../Callback';

const libraries: LoadScriptProps['libraries'] = ['drawing'];

const mapOptions = {
    zoomControl: false,
    streetViewControl: false,
    disableDefaultUI: true,
};

// Function to get ndvi data from backend
const getNDVIData = async (polygon: Polygon) => {
    try{
        const ndviData = await axios({
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/ndvi/polygon`,
            data: polygon,
            withCredentials: true,
        });
        console.log(ndviData.data);

        return ndviData.data;

    }catch(error){
        console.error("Error getting ndvi data:", error);  
    }
}

// Function to get classifier data from backend
const classifyPolygon = async (polygon: Polygon) => {
    try{
        const classifierData = await axios({
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/classifier/test`,
            data: {polygon: polygon},
            withCredentials: true,
        });

        return classifierData.data;

    }catch(error){
        console.error("Error getting classifier data:", error);  
    }
}

// Component for displaying and functionality of interactive map
const InteractiveMap: React.FC = () => {
    const [showSavePolygonMenu, setShowSavePolygonMenu] = useState<boolean>(false);

    // Map state var
    const [map, setMap] = useState<google.maps.Map | null>(null);

    // State var for the selected drawn polygon
    const [selectedPolygon, setSelectedPolygon] = useState<Polygon | null>(null);


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

    // Function to handle polygon complete
    const onPolygonComplete = (polygon: google.maps.Polygon) => {
        console.log('Polygon complete. Coords: ', polygon.getPath().getArray());
        setShowSavePolygonMenu(true);

        // Create the polygon object
        const polygonObj: Polygon = {
            name: '',
            description: '',
            startDate: '',
            endDate: '',
            coordinates: polygon.getPath().getArray().map((coord) => ({ lat: coord.lat(), lng: coord.lng() })),
        }

        setSelectedPolygon(polygonObj);
    }

    // Function to handle the save polygon form submission
    const handleSave: SavePolygonMenuProps['onSave'] = (formData) => {
        console.log('Save polygon form data:', formData);
        setShowSavePolygonMenu(false);

        // Add the form data to the selected polygon
        setSelectedPolygon((prev) => {
            if (!prev) return null;

            const updatedPolygon = {
                ...prev,
                name: formData.name,
                description: formData.description,
                startDate: formData.startDate,
                endDate: formData.endDate,
            }
            
            console.log('Updated polygon:', updatedPolygon);

            /*// Make api call to get ndvi data
            getNDVIData(updatedPolygon).then(ndviData => {
              // Add overlay to the map
              addOverlay(ndviData.urlFormat);
            });
            */

            // Make api call to get classifier data
            classifyPolygon(updatedPolygon).then(classifierData => {
              addOverlay(classifierData.urlFormat);
            });

            return updatedPolygon;
        });

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
                    />

                    {showSavePolygonMenu && <SavePolygonMenu onSave={handleSave} />}

                </GoogleMap>
            )}
        </div>
        
    );
}

export default InteractiveMap;