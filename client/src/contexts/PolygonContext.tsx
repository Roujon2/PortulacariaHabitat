import React, { createContext, useContext, useState, useEffect } from 'react';
import polygonApi from '../api/polygonApi';
import { Polygon } from '../types/polygon';

interface PolygonContextProps {
    polygons: Polygon[];
    fetchPolygons: (refreshAll: boolean) => void;
    loading: boolean;
    loadMorePolygons: () => void;
    deletePolygons: (polygons: Polygon[]) => void;
    hasMore: boolean;
}

const PolygonContext = createContext<PolygonContextProps | undefined>(undefined);

interface PolygonContextProviderProps {
    children: React.ReactNode;
}

export const PolygonContextProvider: React.FC<PolygonContextProviderProps> = ({ children }) => {
    const [polygons, setPolygons] = useState<Polygon[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

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

    const fetchPolygons = async (refreshAll: boolean) => {
        try {
            setLoading(true);

            let fetchedPolygons: Polygon[] | undefined;

            if (refreshAll){

                // Get all polygons from beginning until offset
                fetchedPolygons = await polygonApi.getPolygons((offset || 10), 0);
            }else{
                // Get polygons from offset
                fetchedPolygons = await polygonApi.getPolygons(10, offset);

            }

            if (fetchedPolygons) {
                // Check unique polygons and add them 
                const uniquePolygons = fetchedPolygons.filter((polygon: Polygon) => !polygons.find(p => p.id === polygon.id));
                setPolygons([...polygons, ...uniquePolygons]);

                // Fetch polygon count
                const polygonCount = await fetchPolygonCount();

                if (polygonCount && polygons.length >= polygonCount.count) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error("Error fetching polygons:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolygons(false);
    }, [offset]);

    const loadMorePolygons = () => {
        setOffset(offset + 10);
    };

    // Function to delete polygons
    const deletePolygons = async (polygons: Polygon[]) => {
        try {
            setLoading(true);

            // Get polygon ids
            const polygonIds = polygons.map(polygon => polygon.id);

            const deletedPolygons = await polygonApi.deletePolygons(polygonIds);

            if (deletedPolygons) {
                // Remove deleted polygons from state
                const updatedPolygons = polygons.filter(polygon => !deletedPolygons.find((deletedPolygon: Polygon) => deletedPolygon.id === polygon.id));
                setPolygons(updatedPolygons);
            }
        } catch (error) {
            console.error("Error deleting polygons:", error);
        } finally {
            setLoading(false);
        }
    };

    console.log(polygons);

    return (
        <PolygonContext.Provider value={{ polygons, fetchPolygons, loading, loadMorePolygons, deletePolygons, hasMore }}>
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