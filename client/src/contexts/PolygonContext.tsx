import React, { createContext, useContext, useState, useEffect } from 'react';
import polygonApi from '../api/polygonApi';
import { Polygon } from '../types/polygon';

interface PolygonContextProps {
    polygons: Polygon[];
    refreshPolygons: () => void;
    loading: boolean;
    loadMorePolygons: () => void;
    deletePolygons: (polygons: Polygon[]) => void;
    hasMore: boolean;
    updatePolygon: (polygon: Polygon) => void;
    putOnMap: (polygons: Polygon[]) => void;
    polygonsOnMap: Polygon[];
    resetMapPolygons: () => void;
    selectedPolygonDetailsId: number | null;
    setSelectedPolygonDetailsId: (id: number | null) => void;
    polygonToUpdate: Polygon | null;
}

const call_limit = 10;

const PolygonContext = createContext<PolygonContextProps | undefined>(undefined);

interface PolygonContextProviderProps {
    children: React.ReactNode;
}

export const PolygonContextProvider: React.FC<PolygonContextProviderProps> = ({ children }) => {
    const [polygons, setPolygons] = useState<Polygon[]>([]);
    // Polygons on the map
    const [polygonsOnMap, setPolygonsOnMap] = useState<Polygon[]>([]);

    // Polygon to be updated 
    const [polygonToUpdate, setPolygonToUpdate] = useState<Polygon | null>(null);

    // Selected polygon for showing details
    const [selectedPolygonDetailsId, setSelectedPolygonDetailsId] = useState<number | null>(null);

    const [loading, setLoading] = useState<boolean>(false);

    // Statevar for last updated polygon for dynamic pagination
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    // Check if there are more polygons to fetch
    const [hasMore, setHasMore] = useState<boolean>(true);

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
            polygons.forEach(p => removeFromMap(p));

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
        setPolygonsOnMap((currentPolygons) => {
            // Filter out polygons that are already on map
            const newPolygons = polygons.filter(p => !currentPolygons.find(cp => cp.id === p.id));
            return [...currentPolygons, ...newPolygons];
        });
    };
    // Function to delete from map
    const removeFromMap = (polygon: Polygon) => {
        setPolygonsOnMap((currentPolygons) => { 
            // Filter out polygons
            return currentPolygons.filter(p => p.id !== polygon.id);
        });
    };


    return (
        <PolygonContext.Provider value={{ polygons, refreshPolygons, 
                                        loading, loadMorePolygons, 
                                        deletePolygons, hasMore, updatePolygon, 
                                        polygonsOnMap, putOnMap, resetMapPolygons, 
                                        selectedPolygonDetailsId, setSelectedPolygonDetailsId,
                                        polygonToUpdate }}>
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