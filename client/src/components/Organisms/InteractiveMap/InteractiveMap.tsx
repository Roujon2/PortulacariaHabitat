import React, { useEffect, useState } from "react";
import './interactiveMap.css';
import { DrawingManagerF, GoogleMap } from "@react-google-maps/api";
import { useMemo } from "react";
import { LoadScriptProps, useJsApiLoader } from "@react-google-maps/api";
import SavePolygonMenu, {SavePolygonMenuProps} from "../../Atoms/SavePolygonMenu/SavePolygonMenu";
import {Polygon, NewPolygon } from "../../../types/polygon";

import polygonApi from "../../../api/polygonApi";

import { usePolygonContext } from "../../../contexts/PolygonContext";

import { TbReload } from "react-icons/tb";

import SuccessConfirmationBox from "../../Atoms/SuccessConfirmationBox/SuccessConfirmationBox";

import ColorRamp from "../../Atoms/ColorRamp/ColorRamp";

import PolygonWidget from "../../Atoms/PolygonWidget/PolygonWidget";


import ErrorBox from "../../Atoms/ErrorBox/ErrorBox";
import { useAlert } from "../../../contexts/AlertContext";

const libraries: LoadScriptProps['libraries'] = ['drawing'];

const mapOptions = {
    zoomControl: false,
    streetViewControl: false,
    disableDefaultUI: true,
    scaleControl: true
};

// Component for displaying and functionality of interactive map
const InteractiveMap: React.FC = () => {
    // Alert context
    const { showAlert } = useAlert();

    // State var map key to force reload
    const [mapKey, setMapKey] = useState<number>(0);

    const [showSavePolygonMenu, setShowSavePolygonMenu] = useState<boolean>(false);

    const [showErrorBox, setShowErrorBox] = useState<boolean>(false);

    // Access polygons to be on map from context
    const { resetMapPolygons, setSelectedPolygonDetailsId, selectedPolygonDetailsId, polygonToUpdate, putOnMap, 
        centerOnPolygons, setCenterOnPolygons, polygonsToDelete, polygonsToMap, setPolygonsToDelete, 
        setPolygonsToMap,
        setPolygonResultsOnMap, polygonResultsOnMap,
        polygonSpekboomClassification, polygonsOnMap, setPolygonsOnMap, overlays, setOverlays
        } = usePolygonContext();

    // Local state var for the polygons currently drawn on the map
    const [drawnPolygons, setDrawnPolygons] = useState<google.maps.Polygon[]>([]);

    // Map state var
    const [map, setMap] = useState<google.maps.Map | null>(null);
    // Drawing manager state var
    const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);

    // State var for the selected drawn polygon
    const [selectedPolygon, setSelectedPolygon] = useState<NewPolygon | Polygon | null>(null);
    const [drawnPolygon, setDrawnPolygon] = useState<google.maps.Polygon | null>(null);


    // Function to get the opacity of an overlay
    const getOverlayOpacity = (polygonId: number) => {
        const overlay = overlays[polygonId]?.overlay;
        return overlay ? overlay.getOpacity() : -1;
    };

    // Function to handle the opacity change for a specific overlay
    const handleOverlayOpacityChange = (polygonId: number, newOpacity: number) => {
        const overlay = overlays[polygonId].overlay;
        const downloadUrl = overlays[polygonId].downloadUrl;
        if (overlay) {
            overlay.setOpacity(newOpacity);
            setOverlayOpacity(newOpacity);
            setOverlays((prev) => ({
                            ...prev,
                            [polygonId]: { overlay, downloadUrl },
                          }));
              
              
        }   
    };
    // Function to handle the slider change for a specific overlay changed by the widget slider
    const handleSpecificOpacityChange = (polygonId: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const newOpacity = parseFloat(e.target.value);
        handleOverlayOpacityChange(polygonId, newOpacity);
    };

    // State for overlay opacity
    const [overlayOpacity, setOverlayOpacity] = useState<number>(0.8);

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
                setCenterOnPolygons([polygonToUpdate]);
            }
        }
    }, [polygonToUpdate]);

    // UseEffect tracking selected polygon details id
    useEffect(() => {
        if (selectedPolygonDetailsId) {
            // Change stroke color of selected polygon
            changeStrokeColor(selectedPolygonDetailsId, '#FFA500');

            // Change opacity state var to selected polygon overlay's current opacity
            setOverlayOpacity(getOverlayOpacity(selectedPolygonDetailsId));
        }else{
            setOverlayOpacity(-1);
        }
    }, [selectedPolygonDetailsId]);

    // UseEffect tracking the polygon to center on
    useEffect(() => {
        if (centerOnPolygons) {
            if(centerOnPolygons.length > 0 && map){
                // Check if at least one polygon is on map
                const drawnPolygonsIds = drawnPolygons.map(p => p.get('id'));
                const centerOnPolygonsIds = centerOnPolygons.map(p => p.id);
                const polygonsOnMap = centerOnPolygonsIds.filter(id => drawnPolygonsIds.includes(id));

                if (polygonsOnMap.length === 0) {
                    return;
                }

                // Get map bounds
                const bounds = new google.maps.LatLngBounds();

                // Find the polygons in drawn polygons
                centerOnPolygons.forEach(polygon => {
                    const drawnPolygon = drawnPolygons.find(p => p.get('id') === polygon.id);
                    if (drawnPolygon) {
                        const polygonCoords = polygon.coordinates.map(coord => ({ lat: coord.lat, lng: coord.lng }));
                        polygonCoords.forEach(coord => {
                            bounds.extend(coord);
                        });
                    }
                });

                // Center map to bounds
                map.fitBounds(bounds);

                // Reset center on polygons
                setCenterOnPolygons([]);
            }
        }
    }, [centerOnPolygons]);

    // UseEffect tracking polygons to map
    useEffect(() => {
        if (polygonsToMap.length > 0) {
            // Filter out polygons that are already on map
            const newPolygons = polygonsToMap.filter(p => !drawnPolygons.find(dp => dp.get('id') === p.id));

            // Add new polygons to the map
            newPolygons.forEach(polygon => {
                addPolygonToMap(polygon);
            });

            // Reset polygons to map
            setPolygonsToMap([]);

            // Set success message
            if (newPolygons.length === 1) {
                showAlert('Polygon added to map', 'success');
            }else if(newPolygons.length > 1){
                showAlert(`${newPolygons.length} polygons added to map`, 'success');
            }else{
                showAlert('Polygon/s already on map', 'info');
            }

            // Center map to the new polygons
            setCenterOnPolygons(newPolygons);

            // Put polygon details for first polygon added
            setSelectedPolygonDetailsId(polygonsToMap[0].id);

            // Change stroke color of first polygon added
            changeStrokeColor(polygonsToMap[0].id, '#FFA500');

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


    // UseEffect to track polygon spekboom mask to display
    useEffect(() => {
        if (polygonSpekboomClassification) {
            // Overlay spekboom mask on map
            if(polygonSpekboomClassification.overlayUrl && polygonSpekboomClassification.polygonId){
                // Overlay
                addOverlay(polygonSpekboomClassification.overlayUrl, polygonSpekboomClassification.downloadUrl, polygonSpekboomClassification.polygonId);
                
                showAlert('Spekboom classification overlay added to map', 'success');
            }else{
                console.error("No overlay url found in spekboom mask data.");
                showAlert('Error adding spekboom classification overlay to map', 'error');
            }
        }
    }, [polygonSpekboomClassification]);


    // Load the google maps api script
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string,
        libraries,
    });

    // Cache center
    const center = useMemo(() => ({ lat: -32.2506, lng: 24.5259 }), []);

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

        // If the polygon has less then 3 vertices, show error message and return
        if (polygon.getPath().getLength() < 3) {    
            setShowErrorBox(true);

            // Remove the polygon
            polygon.setMap(null);

            return;
        }

        // If the polygon is not closed, close it
        if (!polygon.getPath().getAt(0).equals(polygon.getPath().getAt(polygon.getPath().getLength() - 1))) {
            polygon.getPath().push(polygon.getPath().getAt(0));
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
            showAlert('Unable to save polygon. Please try again.', 'error');
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
    const addOverlay = (overlayUrl: string, downloadUrl: string, polygonId: number) => {
        // If there is no map, return
        if (!map) return;

        // If the overlay already exists, return
        if (overlays[polygonId]) return;

        const overlayMapParams = new google.maps.ImageMapType({
            getTileUrl: (coord: google.maps.Point, zoom: number) => {
    
                return overlayUrl
                    .replace('{x}', coord.x.toString())
                    .replace('{y}', coord.y.toString())
                    .replace('{z}', zoom.toString());
            },
            tileSize: new google.maps.Size(256, 256),
            opacity: 0.8,
            name: 'Abundance',
            maxZoom: 13,
        });

        map.overlayMapTypes.push(overlayMapParams);
        
        // Add overlay to overlays
        setOverlays(prev => ({ ...prev, [polygonId]: { overlay: overlayMapParams, downloadUrl: downloadUrl} }));

        // Add result to polygon results on map
        // Get polygon from id
        const polygon : Polygon | undefined = polygonsOnMap.find(p => p.id === polygonId);
        if (polygon) {
            setPolygonResultsOnMap([...polygonResultsOnMap, polygon]);
        }

        setSelectedPolygonDetailsId(null);
        setSelectedPolygonDetailsId(polygonId);

        // Set the overlay opacity to this overlay if the selected polygon is this polygon
        setOverlayOpacity(overlayMapParams.getOpacity());


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
                // Selected details for clicked polygon
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
                    const overlayIndex = map.overlayMapTypes.getArray().indexOf(overlays[id].overlay);
                    if (overlayIndex > -1) {
                        map.overlayMapTypes.removeAt(overlayIndex);
                    }
                    setOverlays(prev => {
                        const newOverlays = { ...prev };
                        delete newOverlays[id];
                        return newOverlays;
                    });
                }

                // Remove polygon from polygons on map
                setPolygonResultsOnMap(polygonResultsOnMap.filter((p: Polygon) => p.id !== id));

                setPolygonsOnMap(polygonsOnMap.filter((p: Polygon) => p.id !== id));

                showAlert('Polygon removed from map', 'info');

                setSelectedPolygonDetailsId(null);
                
            }
        }
    }

    // Function to change the stroke color of the selected polygon
    const changeStrokeColor = (id: number, color: string) => {
        if (map) {
            // Reset stroke color of all polygons
            drawnPolygons.forEach(polygon => {
                polygon.setOptions({
                    strokeColor: '#FF0000',
                });
            });

            // Change the stroke color of the selected polygon
            const polygon = drawnPolygons.find(p => p.get('id') === id);
            if (polygon) {
                polygon.setOptions({
                    strokeColor: color,
                });
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

    // Function to reload the map
    const reloadMap = () => {
        // Reset everything
        setDrawnPolygons([]);
        setOverlays({});
        setCenterOnPolygons([]);
        setSelectedPolygon(null);
        setDrawnPolygon(null);
        setShowSavePolygonMenu(false);
        setShowErrorBox(false);
        setSelectedPolygonDetailsId(null);

        setPolygonResultsOnMap([]);

        // Reset map polygons
        resetMapPolygons();

        // Reload the map
        setMapKey(prev => prev + 1);

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
                    key={mapKey}
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

                    <button className='reload-button' onClick={reloadMap}>
                        <TbReload />
                    </button>

                    <PolygonWidget
                        opacity={overlayOpacity}
                        handleOpacityChange={handleSpecificOpacityChange(selectedPolygonDetailsId as number)}
                        handleRemoveFromMap={() => removePolygonFromMap(selectedPolygonDetailsId as number)}
                    />

                    {showSavePolygonMenu && <SavePolygonMenu onSave={handleSave} onCancel={handleCancel} />}

                    {showErrorBox && <ErrorBox message="Polygon must have at least 3 vertices." handleExit={() => setShowErrorBox(false)} />}

                    <ColorRamp min={'<10%'} max={'24%<'} palette={["#0000ff","#0000ff","#0000ff","#ffff00","#ffff00","#ffff00","#ff0000","#ff0000","#ff0000"]} />
                    
                </GoogleMap>
            )}
        </div>
        
    );
}

export default InteractiveMap;