import axios from 'axios';

const testHealthCheck = async () => {
    try {
        const response = await axios.get('http://localhost:5000/health');
        console.log('Health Check:', response.data);
    } catch (error) {
        console.error('Error checking health:', error.response ? error.response.data : error.message);
    }
};

testHealthCheck();