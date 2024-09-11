import axios from 'axios';
import { NewPolygon, Polygon } from '../types/polygon';

// Function to save polygon to the database
const savePolygon = async (polygon: NewPolygon) => {
    try{
        // Save polygon to database
        const savedPolygon = await axios({
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/polygons`,
            data: polygon,
            withCredentials: true,
        });

        // Create the Polygon object to be returned
        const newPolygon: Polygon = {
            id: savedPolygon.data.id,
            name: polygon.name,
            description: polygon.description,
            locality: polygon.locality,
            ownership_type: polygon.ownership_type,
            farm_series_name: polygon.farm_series_name,
            notes: polygon.notes,
            created_at: savedPolygon.data.created_at,
            coordinates: polygon.coordinates,
        }

        return newPolygon;
    }catch(error){
        console.error("Error saving polygon:", error);
    }
}

// Function to update polygon in the database
const updatePolygon = async (polygon: Polygon) => {
    try{
        // Update polygon in database
        const updatedPolygon = await axios({
            method: 'put',
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/polygons/${polygon.id}`,
            data: polygon,
            withCredentials: true,
        });

        // Create the Polygon object to be returned
        const newPolygon: Polygon = {
            id: updatedPolygon.data.id,
            name: polygon.name,
            description: polygon.description,
            locality: polygon.locality,
            ownership_type: polygon.ownership_type,
            farm_series_name: polygon.farm_series_name,
            notes: polygon.notes,
            created_at: polygon.created_at,
            coordinates: polygon.coordinates,
        }

        return newPolygon;
    }catch(error){
        console.error("Error updating polygon:", error);
    }
}

// Function to delete polygon from the database
const deletePolygon = async (polygonId: number) => {
    try{
        // Delete polygon from database
        await axios({
            method: 'delete',
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/polygons/${polygonId}`,
            withCredentials: true,
        });

    }catch(error){
        console.error("Error deleting polygon:", error);
    }
}
// Function deleting multiple polygons
const deletePolygons = async (polygonIds: number[]) => {
    try{
        // Delete polygons from database
        const deletedPolygons = await axios({
            method: 'delete',
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/polygons`,
            data: polygonIds,
            withCredentials: true,
        });

        return deletedPolygons.data;
    }catch(error){
        console.error("Error deleting polygons:", error);
    }
};


// Function to get polygon from id
const getPolygon = async (polygonId: number) => {
    try{
        // Get polygon from database
        const polygon = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/polygons/${polygonId}`,
            withCredentials: true,
        });

        // Create the Polygon object to be returned
        const newPolygon: Polygon = {
            id: polygon.data.id,
            name: polygon.data.name,
            description: polygon.data.description,
            locality: polygon.data.locality,
            ownership_type: polygon.data.ownerShipType,
            farm_series_name: polygon.data.farm_series_name,
            notes: polygon.data.notes,
            created_at: polygon.data.created_at,
            coordinates: polygon.data.coordinates,
        }

        return newPolygon;
    }catch(error){
        console.error("Error getting polygon:", error);
    }
}

const getPolygons = async (limit: number, offset: number) => {
    try{
        // Get polygons from database
        const polygons = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/polygons?limit=${limit}&offset=${offset}`,
            withCredentials: true,
        });

        // Create the Polygon object to be returned
        const newPolygons: Polygon[] = polygons.data.map((polygon: Polygon) => ({
            id: polygon.id,
            name: polygon.name,
            description: polygon.description,
            coordinates: polygon.coordinates,
            locality: polygon.locality,
            ownership_type: polygon.ownership_type,
            farm_series_name: polygon.farm_series_name,
            notes: polygon.notes,
            created_at: polygon.created_at,
        }));

        return newPolygons;
    }catch(error){
        console.error("Error getting polygons:", error);
    }
};

const getPolygonCount = async () => {
    try{
        // Get polygon count from database
        const polygonCount = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/polygons/count`,
            withCredentials: true,
        });

        return polygonCount.data;
    }catch(error){
        console.error("Error getting polygon count:", error);
    }
}

export default {
    savePolygon,
    updatePolygon,
    deletePolygon,
    getPolygon,
    getPolygons,
    deletePolygons,
    getPolygonCount,
}