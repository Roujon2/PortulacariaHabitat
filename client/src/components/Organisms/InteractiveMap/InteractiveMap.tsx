import React, { useEffect, useState } from "react";
import './interactiveMap.css';
import { DrawingManagerF, GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import type { LoadScriptProps } from "@react-google-maps/api";
import SavePolygonMenu, {SavePolygonMenuProps} from "../../Atoms/SavePolygonMenu/SavePolygonMenu";
import {Polygon, NewPolygon } from "../../../types/polygon";

import polygonApi from "../../../api/polygonApi";

import axios from 'axios';
import { usePolygonContext } from "../../../contexts/PolygonContext";

const libraries: LoadScriptProps['libraries'] = ['drawing'];

const mapOptions = {
    zoomControl: false,
    streetViewControl: false,
    disableDefaultUI: true,
};

// Component for displaying and functionality of interactive map
const InteractiveMap: React.FC = () => {
    const [showSavePolygonMenu, setShowSavePolygonMenu] = useState<boolean>(false);

    // Access polygons to be on map from context
    const { resetMapPolygons, setSelectedPolygonDetailsId, polygonToUpdate, putOnMap, centerOnPolygon, setCenterOnPolygon, polygonsToDelete, polygonsToMap, setPolygonsToDelete, setPolygonsToMap, polygonToClassify } = usePolygonContext();

    // Local state var for the polygons currently drawn on the map
    const [drawnPolygons, setDrawnPolygons] = useState<google.maps.Polygon[]>([]);

    // Map state var
    const [map, setMap] = useState<google.maps.Map | null>(null);
    // Drawing manager state var
    const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);

    // State var for the selected drawn polygon
    const [selectedPolygon, setSelectedPolygon] = useState<NewPolygon | Polygon | null>(null);
    const [drawnPolygon, setDrawnPolygon] = useState<google.maps.Polygon | null>(null);

    // Map var for overlays on map linked to polygon id
    const [overlays, setOverlays] = useState<{ [key: number]: google.maps.ImageMapType }>({});


    // UseEffect tracking polygon to update
    useEffect(() => {
        if (polygonToUpdate) {
            const polygonToUpdateIndex = drawnPolygons.findIndex(p => p.get('id') === polygonToUpdate.id);
            if (polygonToUpdateIndex >= 0) {
                const polygonOnMap = drawnPolygons[polygonToUpdateIndex];

                // Update polygon on map
                polygonOnMap.setOptions({
                    paths: polygonToUpdate.coordinates.map(coord => ({ lat: coord.lat, lng: coord.lng })),
                });

                // Update drawnPolygons
                setDrawnPolygons(prev => {
                    const newDrawnPolygons = [...prev];
                    newDrawnPolygons[polygonToUpdateIndex] = polygonOnMap;
                    return newDrawnPolygons;
                });

                // Center map to the updated polygon
                setCenterOnPolygon(polygonToUpdate);

            }
        }
    }, [polygonToUpdate]);

    // UseEffect tracking the polygon to center on
    useEffect(() => {
        if (centerOnPolygon) {
            const polygonToCenterOn = drawnPolygons.find(p => p.get('id') === centerOnPolygon.id);
            if (polygonToCenterOn) {
                // Center map to the updated polygon
                const centroid = calculateCentroid(centerOnPolygon);
                map?.setCenter(centroid);
                // Zoom to fit bounds of polygon
                const bounds = new google.maps.LatLngBounds();
                centerOnPolygon.coordinates.forEach(coord => {
                    bounds.extend(coord);
                });
                map?.fitBounds(bounds);
                setCenterOnPolygon(null);
            }
        }
    }, [centerOnPolygon]);

    // UseEffect tracking polygons to map
    useEffect(() => {
        if (polygonsToMap.length > 0) {
            // Filter out polygons that are already on map
            const newPolygons = polygonsToMap.filter(p => !drawnPolygons.find(dp => dp.get('id') === p.id));

            // Add new polygons to the map
            newPolygons.forEach(polygon => {
                addPolygonToMap(polygon);
            });

            // Put polygon details for first polygon added
            setSelectedPolygonDetailsId(polygonsToMap[0].id);

            // Reset polygons to map
            setPolygonsToMap([]);
        }
    }, [polygonsToMap]);

    // UseEffect tracking polygons to delete
    useEffect(() => {
        if (polygonsToDelete.length > 0) {
            polygonsToDelete.forEach(polygon => {
                removePolygonFromMap(polygon.id);
            });

            // Reset polygons to delete
            setPolygonsToDelete([]);
        }
    }, [polygonsToDelete]);

    // UseEffect tracking polygon to classify
    useEffect(() => {
        if (polygonToClassify) {
            // Call backend to classify polygon
            polygonApi.classifyPolygon(polygonToClassify)
                .then((classifyData) => {
                    // Overlay the classified polygon on the map
                    if(classifyData.urlFormat){
                        addOverlay(classifyData.urlFormat, polygonToClassify);
                    }else{
                        console.error("No url format found in classify data.");
                    }
                })
                .catch((error) => {
                    console.error("Error classifying polygon:", error);
                });
        }
    }, [polygonToClassify]);


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

        // Reset map polygons
        resetMapPolygons();

        // Set the map state var
        setMap(map);
    }

    // Function to handle drawing manager load
    const onDrawingManagerLoad = (drawingManager: google.maps.drawing.DrawingManager) => {
        // Set the drawing manager state var
        setDrawingManager(drawingManager);
    }

    // Function to handle polygon complete
    const onPolygonComplete = (polygon: google.maps.Polygon) => {
        // Change selected drawing cursor to hand
        if (drawingManager) {
            drawingManager.setDrawingMode(null);
        }

        setShowSavePolygonMenu(true);

        // Create the polygon object
        const polygonObj: NewPolygon = {
            name: '',
            description: '',
            coordinates: polygon.getPath().getArray().map((coord) => ({ lat: coord.lat(), lng: coord.lng() })),
            locality: '',
            ownership_type: '',
            farm_series_name: '',
            notes: '',
            classified: false,
        }

        setSelectedPolygon(polygonObj);

        // Set the drawn polygon to the polygon ref
        setDrawnPolygon(polygon);
    }
    
    // Function to handle the save polygon form submission
    const handleSave: SavePolygonMenuProps['onSave'] = async (formData) => {
        setShowSavePolygonMenu(false);

        // If there is no selected polygon, return
        if (!selectedPolygon) return;

        // Extract the polygon data from the form data and create new polygon object
        const newPolygon: NewPolygon = {
            ...selectedPolygon,
            name: formData.name,
            description: formData.description,
            coordinates: selectedPolygon.coordinates,
            locality: formData.locality,
            ownership_type: formData.ownership_type,
            farm_series_name: formData.farm_series_name,
            notes: formData.notes,
        }
        
        try{
            // Send polygon to backend and get polygon object
            const savedPolygon : Polygon | undefined = await polygonApi.savePolygon(newPolygon);
            
            // Retrieve id and set to selected
            setSelectedPolygon(savedPolygon || null);
            
            // Remove the drawn polygon from the map
            if (savedPolygon && drawnPolygon) {
                drawnPolygon.setMap(null);
                // Reset drawn polygon
                setDrawnPolygon(null);

                // Add the polygon to the map
                putOnMap([savedPolygon]);
            }
        }catch(error){
            console.error("Error saving polygon:", error);
        }
    }

    // Function handling the cancel button on the save polygon form
    const handleCancel = () => {
        setShowSavePolygonMenu(false);
        if (drawnPolygon) {
            drawnPolygon.setMap(null);
            setDrawnPolygon(null);
        }
        setSelectedPolygon(null);
    }

    // Function to add an overlay to the map
    const addOverlay = (url: string, polygon: Polygon) => {
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
            opacity: 0.8,
            name: 'NDVI'
        });

        map.overlayMapTypes.push(overlayMapParams);
        
        // Add overlay to overlays
        setOverlays(prev => ({ ...prev, [polygon.id]: overlayMapParams }));
    };

    // Function to add polygon to the map
    const addPolygonToMap = (polygon: Polygon) => {
        if (map) {
            // If polygon is already drawn, skip
            if (drawnPolygons.find(p => p.get('id') === polygon.id)) return;


            const polygonCoords = polygon.coordinates.map(coord => ({ lat: coord.lat, lng: coord.lng }));

            const newPolygon = new google.maps.Polygon({
                paths: polygonCoords,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0,
            });

            newPolygon.set('id', polygon.id);

            newPolygon.addListener('click', () => {
                // Selecte details for clicked polygon
                setSelectedPolygonDetailsId(newPolygon.get('id'));
            });


            newPolygon.setMap(map);

            // Add polygon to drawn polygons
            setDrawnPolygons(prev => [...prev, newPolygon]);
        }
    }
    // Function to remove polygon from the map
    const removePolygonFromMap = (id: number) => {
        if (map) {
            const polygonToRemove = drawnPolygons.find(p => p.get('id') === id);
            if (polygonToRemove) {
                polygonToRemove.setMap(null);
                setDrawnPolygons(prev => prev.filter(p => p.get('id') !== id));

                // Remove overlay if exists
                if (overlays[id]) {
                    const overlayIndex = map.overlayMapTypes.getArray().indexOf(overlays[id]);
                    if (overlayIndex > -1) {
                        map.overlayMapTypes.removeAt(overlayIndex);
                    }
                    setOverlays(prev => {
                        const newOverlays = { ...prev };
                        delete newOverlays[id];
                        return newOverlays;
                    });
                }
            }
        }
    }

    // Function to calculate polygon centroid
    const calculateCentroid = (polygon: Polygon) => {
        const polygonCoords = polygon.coordinates.map(coord => ({ lat: coord.lat, lng: coord.lng }));

        const polygonBounds = new google.maps.LatLngBounds();
        polygonCoords.forEach(coord => {
            polygonBounds.extend(coord);
        });

        return polygonBounds.getCenter();
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
                        onLoad={onDrawingManagerLoad}
                    />

                    {showSavePolygonMenu && <SavePolygonMenu onSave={handleSave} onCancel={handleCancel} />}

                </GoogleMap>
            )}
        </div>
        
    );
}

export default InteractiveMap;