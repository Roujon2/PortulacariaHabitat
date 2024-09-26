import React, { useEffect } from "react";

import { usePolygonContext } from "../../../contexts/PolygonContext";

function SSEComponent() {
    const { refreshPolygons } = usePolygonContext();

    useEffect(() => {
        // Create a new EventSource instance
        var eventSource = new EventSource(`${process.env.REACT_APP_BACKEND_SERVER_URL}/sse/events`, { withCredentials: true });

        // Listen for messages from the server
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received event:', data);
            refreshPolygons();

            // Switch statement to set success message based on event type
            


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