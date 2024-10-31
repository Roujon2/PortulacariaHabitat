import axios from 'axios';
import { NewPolygon, Polygon } from '../types/polygon';

// Function to save polygon to the database
const savePolygon = async (polygon: NewPolygon) => {
    const backendStatus = await checkBackendStatus();

    if (!backendStatus){
        console.error("Server is offline!");
        return;
    }

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
            updated_at: savedPolygon.data.updated_at,
            classification_status: savedPolygon.data.classification_status,
        }

        return newPolygon;
    }catch(error){
        console.error("Error saving polygon:", error);
    }
}

// Function to update polygon in the database
const updatePolygon = async (polygon: Polygon) => {
    const backendStatus = await checkBackendStatus();

    if (!backendStatus){
        console.error("Server is offline!");
        return;
    }

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
            updated_at: updatedPolygon.data.updated_at,
            classification_status: updatedPolygon.data.classification_status,
        }

        return newPolygon;
    }catch(error){
        console.error("Error updating polygon:", error);
    }
}

// Function to delete polygon from the database
const deletePolygon = async (polygonId: number) => {
    const backendStatus = await checkBackendStatus();

    if (!backendStatus){
        console.error("Server is offline!");
        return;
    }

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
    const backendStatus = await checkBackendStatus();

    if (!backendStatus){
        console.error("Server is offline!");
        return;
    }

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
    const backendStatus = await checkBackendStatus();

    if (!backendStatus){
        console.error("Server is offline!");
        return;
    }

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
            updated_at: polygon.data.updated_at,
            classification_status: polygon.data.classification_status,
        }

        return newPolygon;
    }catch(error){
        console.error("Error getting polygon:", error);
    }
}

// Function to refresh the table of polygons
const refreshPolygons = async (last_updated_at: string | null, limit: number) => {
    const backendStatus = await checkBackendStatus();

    if (!backendStatus){
        console.error("Server is offline!");
        return;
    }

    try{
        // Get polygons from database
        const polygons = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/polygons/refresh`,
            withCredentials: true,
            // Build params object (last_updated_at may be null)
            params: last_updated_at ? { last_updated_at, limit } : { limit },
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
            updated_at: polygon.updated_at,
            classification_status: polygon.classification_status,
        }));

        return newPolygons;
    }catch(error){
        console.error("Error refreshing polygons:", error);
    }
};

// Function to load more polygons to list
const loadMorePolygons = async (last_updated_at: string | null, limit: number) => {
    const backendStatus = await checkBackendStatus();

    if (!backendStatus){
        console.error("Server is offline!");
        return;
    }

    try{
        // Get polygons from database
        const polygons = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/polygons/loadmore`,
            withCredentials: true,
            // Build params object (last_updated_at may be null)
            params: last_updated_at ? { last_updated_at, limit } : { limit },
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
            updated_at: polygon.updated_at,
            classification_status: polygon.classification_status,
        }));

        return newPolygons;
    }catch(error){
        console.error("Error loading more polygons:", error);
    }
};

const getPolygonCount = async () => {
    const backendStatus = await checkBackendStatus();

    if (!backendStatus){
        console.error("Server is offline!");
        return;
    }

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

// Function to classify a polygon
const classifyPolygon = async (polygon: Polygon) => {
    const backendStatus = await checkBackendStatus();

    if (!backendStatus){
        console.error("Server is offline!");
        return;
    }

    try{
        // Post polygon to classification endpoint
        const classifiedPolygon = await axios({
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/classifier/test`,
            data: {polygon: polygon},
            withCredentials: true,
        });

        // Return overlay data
        return classifiedPolygon.data;

    }catch(error){
        console.error("Error classifying polygon:", error);
    }
};

// Function to get polygon classification result
const getPolygonClassification = async (polygonId: number) => {
    const backendStatus = await checkBackendStatus();

    if (!backendStatus){
        console.error("Server is offline!");
        return;
    }

    try{
        // Get polygon classification from database
        const classification = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/classifier/${polygonId}`,
            withCredentials: true,
        });

        return classification.data;
    }catch(error){
        console.error("Error getting polygon classification:", error);
    }
}

// Function to get spekboom mask
const getSpekboomMask = async (polygonId: number) => {
    const backendStatus = await checkBackendStatus();

    if (!backendStatus){
        console.error("Server is offline!");
        return;
    }

    try{
        // Post polygon to spekboom mask endpoint
        const spekboomMask = await axios({
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/polygons/${polygonId}/classify/spekboom_mask`,
            withCredentials: true,
        });

        // Return overlay data
        return spekboomMask.data;

    }catch(error){
        console.error("Error getting spekboom mask:", error);
    }
}

// Function to check backend status
const checkBackendStatus = async () => {
    try{
        // Get backend status
        const status = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/health`,
            withCredentials: true,
        });

        return status.data.status === 200;
    }catch(error){
        console.error("Error getting backend status:", error);
        return false;
    }
}

export default {
    savePolygon,
    updatePolygon,
    deletePolygon,
    getPolygon,
    deletePolygons,
    getPolygonCount,
    refreshPolygons,
    loadMorePolygons,
    classifyPolygon,
    getPolygonClassification,
    getSpekboomMask,
    checkBackendStatus,
}