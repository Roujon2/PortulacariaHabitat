import React, { createContext, useContext, useState, useEffect } from 'react';
import polygonApi from '../api/polygonApi';
import { Polygon } from '../types/polygon';

import SuccessConfirmationBox from '../components/Atoms/SuccessConfirmationBox/SuccessConfirmationBox';
import { useAlert } from './AlertContext';

interface PolygonContextProps {
    polygons: Polygon[];
    refreshPolygons: () => void;
    loading: boolean;
    loadMorePolygons: () => void;
    hasMore: boolean;
    updatePolygon: (polygon: Polygon) => void;
    polygonsOnMap: Polygon[];
    setPolygonsOnMap: (polygons: Polygon[]) => void;
    resetMapPolygons: () => void;
    selectedPolygonDetailsId: number | null;
    setSelectedPolygonDetailsId: (id: number | null) => void;
    polygonToUpdate: Polygon | null;
    centerOnPolygons: Polygon[];
    setCenterOnPolygons: (polygons: Polygon[]) => void;

    putOnMap: (polygons: Polygon[]) => void;
    deletePolygons: (polygons: Polygon[]) => void;
    polygonsToMap: Polygon[];
    polygonsToDelete: Polygon[];
    setPolygonsToMap: (polygons: Polygon[]) => void;
    setPolygonsToDelete: (polygons: Polygon[]) => void;

    polygonResultsOnMap : Polygon[];
    setPolygonResultsOnMap: (polygons: Polygon[]) => void;

    getSpekboomClassification: (polygonId: number) => void;
    polygonSpekboomClassification: {overlayUrl: string, polygonId: number, downloadUrl: string} | null;

    overlays: { [key: number]: { overlay: google.maps.ImageMapType, downloadUrl: string } };
    setOverlays: React.Dispatch<React.SetStateAction<{ [key: number]: { overlay: google.maps.ImageMapType; downloadUrl: string; }; }>>;
}

const call_limit = 10;

const PolygonContext = createContext<PolygonContextProps | undefined>(undefined);

interface PolygonContextProviderProps {
    children: React.ReactNode;
}

export const PolygonContextProvider: React.FC<PolygonContextProviderProps> = ({ children }) => {
    // Alert context
    const { showAlert } = useAlert();

    const [polygons, setPolygons] = useState<Polygon[]>([]);
    // Polygons on the map
    const [polygonsOnMap, setPolygonsOnMap] = useState<Polygon[]>([]);
    // Polygon results on the map
    const [polygonResultsOnMap, setPolygonResultsOnMap] = useState<Polygon[]>([]);

    // Polygon to be updated 
    const [polygonToUpdate, setPolygonToUpdate] = useState<Polygon | null>(null);
    // Polygons to add on map
    const [polygonsToMap, setPolygonsToMap] = useState<Polygon[]>([]);
    // Polygons to delete on map
    const [polygonsToDelete, setPolygonsToDelete] = useState<Polygon[]>([]);

    // Polygon spekboom mask
    const [polygonSpekboomClassification, setPolygonSpekboomClassification] = useState<{overlayUrl: string, polygonId: number, downloadUrl: string} | null>(null);

    // Selected polygon for showing details
    const [selectedPolygonDetailsId, setSelectedPolygonDetailsId] = useState<number | null>(null);

    const [loading, setLoading] = useState<boolean>(false);

    // Statevar for last updated polygon for dynamic pagination
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    // Check if there are more polygons to fetch
    const [hasMore, setHasMore] = useState<boolean>(true);

    // Var handling polygon to center on
    const [centerOnPolygons, setCenterOnPolygons] = useState<Polygon[]>([]);

    // Overlay dictionary holding overlay and downloadurl for the polygon results on the map
    const [overlays, setOverlays] = useState<{
        [key: string]: { overlay: google.maps.ImageMapType; downloadUrl: string };
    }>({});
      


    const fetchPolygonCount = async () => {
        try {
            const polygonCount = await polygonApi.getPolygonCount();

            return polygonCount;
        } catch (error) {
            console.error("Error fetching polygon count:", error);
        }
    }

    // Function to refresh list on map
    const resetMapPolygons = async () => {
        setPolygonsOnMap([]);

        // Reset polygon results on map
        
    }

    // Function to refresh the list of polygons
    const refreshPolygons = async () => {
        try{
            setLoading(true);

            // Fetch polygons from the database
            const fetchedPolygons = await polygonApi.refreshPolygons(lastUpdated, call_limit);

            if(fetchedPolygons && fetchedPolygons.length > 0){
                // Fetch polygon count
                const polygonCount = await fetchPolygonCount();

                // Set last_updated to the last polygon
                setLastUpdated(fetchedPolygons[fetchedPolygons.length - 1].updated_at);
  
                // Check if there are more polygons to fetch
                if(fetchedPolygons.length < polygonCount.count){
                    setHasMore(true);
                }else{
                    setHasMore(false);
                }

                // Reset polygon list
                setPolygons(fetchedPolygons);
            }else{
                setHasMore(false);
            }
        }catch(error){
            console.error("Error refreshing polygons:", error);
        }finally{
            setLoading(false);
        }
    };

    // Function to load more polygons
    const loadMorePolygons = async () => {
        if(!hasMore){
            return;
        }

        try{
            setLoading(true);

            // Fetch older polygons from the database
            const fetchedPolygons = await polygonApi.loadMorePolygons(lastUpdated, call_limit);

            if(fetchedPolygons && fetchedPolygons.length > 0){
                // Fetch polygon count
                const polygonCount = await fetchPolygonCount();

                // Set last_updated to the last polygon
                setLastUpdated(fetchedPolygons[fetchedPolygons.length - 1].updated_at);

                // Check if there are more polygons to fetch
                if([...polygons, ...fetchedPolygons].length < polygonCount.count){
                    setHasMore(true);
                }else{
                    setHasMore(false);
                }

                // Add the fetched polygons to the list
                setPolygons([...polygons, ...fetchedPolygons]);
            }else{
                setHasMore(false);
            }

        }catch(error){
            console.error("Error loading more polygons:", error);
        }finally{
            setLoading(false);
        }
    };

    // Function to delete polygons
    const deletePolygons = async (polygons: Polygon[]) => {
        try {
            setLoading(true);

            // Get polygon ids
            const polygonIds = polygons.map(polygon => polygon.id);

            await polygonApi.deletePolygons(polygonIds);

            // Remove polygons from map 
            removeFromMap(polygons);

            // Remove polygons from list
            setPolygons((currentPolygons) => {
                return currentPolygons.filter(p => !polygonIds.includes(p.id));
            });

        } catch (error) {
            console.error("Error deleting polygons:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to update polygon
    const updatePolygon = async (polygon: Polygon) => {
        // Call api to update in database
        await polygonApi.updatePolygon(polygon);

        // Set polygon to update
        setPolygonToUpdate(polygon);
        // Change the updated polygon in the list
        setPolygonsOnMap((currentPolygons) => {
            return currentPolygons.map(p => {
                if(p.id === polygon.id){
                    return polygon;
                }
                return p;
            });
        });

    };


    // Function to put polygon on map
    const putOnMap = (polygons: Polygon[]) => {
        // Add the polygons to the list and queue them to be added to the map
        setPolygonsToMap(polygons);

        setPolygonsOnMap((currentPolygons) => {
            // Filter out polygons that are already on map
            const newPolygons = polygons.filter(p => !currentPolygons.find(cp => cp.id === p.id));
            return [...currentPolygons, ...newPolygons];
        });
    };
    // Function to delete polygons from map
    const removeFromMap = (polygons: Polygon[]) => {
        // Add polygons to list to be deleted from map
        setPolygonsToDelete(polygons);

        setPolygonsOnMap((currentPolygons) => { 
            // Filter out polygons
            return currentPolygons.filter(p => !polygons.find(cp => cp.id === p.id));
        });
    };
    

    // Retrieve spekboom classification for polygon
    const getSpekboomClassification = async (polygonId: number) => {
        // If polygon id in polygonResultsOnMap, return
        if(polygonResultsOnMap.find(p => p.id === polygonId)){
            showAlert('Spekboom mask already on map', 'warning');
            return;
        }

        setLoading(true);
        try{
            // Call api to get spekboom mask
            const spekboomMask = await polygonApi.getSpekboomClassification(polygonId);

            // Retrieve overlay url from spekboomMask response
            const overlayUrl : string = spekboomMask.map.urlFormat;
            
            const downloadUrl : string = spekboomMask.downloadUrl;


            // Build spekboomMask object
            const spekboomMaskObject = {
                overlayUrl: overlayUrl,
                polygonId: polygonId,
                downloadUrl: downloadUrl
            };

            // Set spekboom mask polygon
            setPolygonSpekboomClassification(spekboomMaskObject);

        }catch(error){
            showAlert('Unable to retrieve the Spekboom classification. Try again later.', 'error');
        }finally{
            setLoading(false);
        }
    };



    return (
        <PolygonContext.Provider value={{ polygons, refreshPolygons, 
                                        loading, loadMorePolygons, 
                                        deletePolygons, hasMore, updatePolygon, 
                                        polygonsOnMap, putOnMap, resetMapPolygons, polygonsToDelete, polygonsToMap, setPolygonsOnMap,
                                        setPolygonsToMap, setPolygonsToDelete,
                                        selectedPolygonDetailsId, setSelectedPolygonDetailsId,
                                        polygonToUpdate,
                                        centerOnPolygons, setCenterOnPolygons,
                                        polygonResultsOnMap, setPolygonResultsOnMap,
                                        getSpekboomClassification, polygonSpekboomClassification,
                                        overlays, setOverlays
                                        }}>
            {children}
        </PolygonContext.Provider>
    );
};

export const usePolygonContext = () => {
    const context = useContext(PolygonContext);

    if (!context) {
        throw new Error('usePolygonContext must be used within a PolygonContextProvider');
    }

    return context;
};