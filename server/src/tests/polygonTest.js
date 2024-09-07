import axios from 'axios';

const testPolygon = async () => {
    const payload = {
        polygon: {
            coordinates: [
                [-64.4223974609375,-33.0500418281354],
                [-64.3674658203125,-33.17427120683167],
                [-64.285068359375,-33.05119290567516]
            ],
            name: 'Test Polygon',
            description: ''
        }
    };

    try {
        // Add polygon
        const response = await axios.post('http://localhost:5000/polygon', payload);
        console.log('Polygon Data:', response.data);

        // Update polygon
        payload.polygon.name = 'Updated Polygon';
        payload.polygon.description = 'Updated Description';
        const updatedResponse = await axios.put(`http://localhost:5000/polygon/${response.data.id}`, payload);
        console.log('Updated Polygon:', updatedResponse.data);

        // Delete polygon
        const deletedResponse = await axios.delete(`http://localhost:5000/polygon/${response.data.id}`);
        console.log('Deleted Polygon:', deletedResponse.data);

    } catch (error) {
        console.error('Error testing polygon:', error.response ? error.response.data : error.message);
    }
}

testPolygon();