import axios from 'axios';

const testClassifier = async () => {
    const payload = {
        coordinates: [
            [-64.4223974609375,-33.0500418281354],
            [-64.3674658203125,-33.17427120683167],
            [-64.285068359375,-33.05119290567516]
        ],
        startDate: '2020-01-01',
        endDate: '2020-12-31'
      };

    try {
        const response = await axios.post('http://localhost:5000/classifier/test', payload);
        console.log('Classifier Data:', response.data);
    } catch (error) {
        console.error('Error testing classifier:', error.response ? error.response.data : error.message);
    }
}
    
testClassifier();