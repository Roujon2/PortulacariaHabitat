import React, { useState } from "react";
import './interactiveMap.css';
import { DrawingManagerF, GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import type { LoadScriptProps } from "@react-google-maps/api";
import SavePolygonMenu, {SavePolygonMenuProps} from "../../Atoms/SavePolygonMenu/SavePolygonMenu";
import {Polygon} from "../../../types/polygon";

const libraries: LoadScriptProps['libraries'] = ['drawing'];

const mapOptions = {
    zoomControl: false,
    streetViewControl: false,
    disableDefaultUI: true,
};


// Component for displaying and functionality of interactive map
const InteractiveMap: React.FC = () => {
    const [showSavePolygonMenu, setShowSavePolygonMenu] = useState<boolean>(false);

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
        console.log('Map loaded:', map);
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

            return updatedPolygon;
        });
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