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
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/polygons/${polygon.id}`,
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
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/polygons/${polygonId}`,
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
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/polygons/${polygonId}`,
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

const getPolygons = async (offset: number) => {
    try{
        // Get polygons from database
        const polygons = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_SERVER_URL}/polygons?offset=${offset}`,
            withCredentials: true,
        });

        // Create the Polygon object to be returned
        const newPolygons: Polygon[] = polygons.data.map((polygon: any) => ({
            id: polygon.id,
            name: polygon.name,
            description: polygon.description,
            startDate: polygon.startDate,
            endDate: polygon.endDate,
            coordinates: polygon.coordinates,
            tags: polygon.tags,
        }));

        return newPolygons;
    }catch(error){
        console.error("Error getting polygons:", error);
    }
};

export default {
    savePolygon,
    updatePolygon,
    deletePolygon,
    getPolygon,
    getPolygons,
}