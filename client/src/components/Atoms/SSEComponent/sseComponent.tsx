import React, { useEffect } from "react";

import { usePolygonContext } from "../../../contexts/PolygonContext";

function SSEComponent() {
    const { refreshPolygons, setSuccessMessage } = usePolygonContext();

    useEffect(() => {
        // Create a new EventSource instance
        var eventSource = new EventSource(`${process.env.REACT_APP_BACKEND_SERVER_URL}/sse/events`, { withCredentials: true });

        // Listen for messages from the server
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received event:', data);
            refreshPolygons();

            // Switch statement to set success message based on event type
            switch (data.action){
                case 'polygon_update':
                    setSuccessMessage('Polygon updated');
                    break;

                case 'polygon_delete':
                    // data is an array of deleted polygon ids
                    const countDeleted = data.data.length;
                    if (countDeleted > 1){
                        setSuccessMessage(`${countDeleted} polygons deleted`);
                    }else if(countDeleted === 1){
                        setSuccessMessage('Polygon deleted');
                    }else{
                        setSuccessMessage('No polygons deleted');
                    }
                    break;

                case 'polygon_save':
                    setSuccessMessage('Polygon saved');
                    break;
                
                case 'spekboom_mask_processing':
                    setSuccessMessage('Spekboom mask processing');
                    break;

                default:
                    break;
            }
            
        };

        // Handle any errors (optional)
        eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            // Optional: Close and retry connection on error
            eventSource.close();
            // Reconnect after 3 seconds
            setTimeout(() => {
                console.log('Reconnecting...');
                eventSource = new EventSource(`${process.env.REACT_APP_BACKEND_SERVER_URL}/sse/events`, { withCredentials: true });
            }, 3000);

        };

        // Cleanup on component unmount
        return () => {
            eventSource.close();
        };
        }, []); // Empty dependency array to run once on mount

    return null;
}

export default SSEComponent;