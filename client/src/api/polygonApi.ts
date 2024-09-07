import axios from 'axios';
import { NewPolygon, Polygon } from '../types/polygon';

// Function to save polygon to the database
const savePolygon = async (polygon: NewPolygon) => {
    try{
        // Save polygon to database
        const savedPolygon = await axios({
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/polygon`,
            data: polygon,
            withCredentials: true,
        });

        // Create the Polygon object to be returned
        const newPolygon: Polygon = {
            id: savedPolygon.data.id,
            name: polygon.name,
            description: polygon.description,
            startDate: polygon.startDate,
            endDate: polygon.endDate,
            coordinates: polygon.coordinates,
            tags: polygon.tags,
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
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/polygon/${polygon.id}`,
            data: polygon,
            withCredentials: true,
        });

        // Create the Polygon object to be returned
        const newPolygon: Polygon = {
            id: updatedPolygon.data.id,
            name: polygon.name,
            description: polygon.description,
            startDate: polygon.startDate,
            endDate: polygon.endDate,
            coordinates: polygon.coordinates,
            tags: polygon.tags,
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
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/polygon/${polygonId}`,
            withCredentials: true,
        });

    }catch(error){
        console.error("Error deleting polygon:", error);
    }
}

// Function to get polygon from id
const getPolygon = async (polygonId: number) => {
    try{
        // Get polygon from database
        const polygon = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/polygon/${polygonId}`,
            withCredentials: true,
        });

        // Create the Polygon object to be returned
        const newPolygon: Polygon = {
            id: polygon.data.id,
            name: polygon.data.name,
            description: polygon.data.description,
            startDate: polygon.data.startDate,
            endDate: polygon.data.endDate,
            coordinates: polygon.data.coordinates,
            tags: polygon.data.tags,
        }

        return newPolygon;
    }catch(error){
        console.error("Error getting polygon:", error);
    }
}

export default {
    savePolygon,
    updatePolygon,
    deletePolygon,
    getPolygon,
}