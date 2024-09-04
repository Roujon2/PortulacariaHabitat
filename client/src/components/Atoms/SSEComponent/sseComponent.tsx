import React, { useEffect } from "react";

function SSEComponent() {
    useEffect(() => {
        // Create a new EventSource instance
        const eventSource = new EventSource('http://localhost:5000/sse/events', { withCredentials: true });

        // Listen for messages from the server
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Received event:', data);
        };

        // Handle any errors (optional)
        eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            // Optional: Close and retry connection on error
        };

        // Cleanup on component unmount
        return () => {
            eventSource.close();
        };
    }, []); // Empty dependency array to run once on mount

    return (
        <div>
            <h1>Listening for SSE Events...</h1>
        </div>
    );
}

export default SSEComponent;