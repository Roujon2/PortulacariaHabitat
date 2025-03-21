import React, { useEffect, useRef } from "react";

import { usePolygonContext } from "../../../contexts/PolygonContext";

import { useAlert } from "../../../contexts/AlertContext";

interface SSEComponentProps {
    setServerOnline: (serverOnline: boolean) => void;
}

// Variable to keep track of number of reconnect attempts
let reconnectAttempts = 0;

const SSEComponent: React.FC<SSEComponentProps> = ({ setServerOnline }) => {
    const { refreshPolygons } = usePolygonContext();
    // Alert context
    const { showAlert } = useAlert();

    // Event source ref
    const eventSourceRef = useRef<EventSource | null>(null);


    useEffect(() => {
        // Helper function to establish the SSE connection
        const connectSSE = () => {
            // Create a new EventSource instance
            var eventSourceRef = new EventSource(`${process.env.REACT_APP_BACKEND_SERVER_URL}/sse/events`, { withCredentials: true });

            // Successful connection
            eventSourceRef.onopen = () => {
                console.log('SSE connection established!');
                // Reset reconnect attempts
                reconnectAttempts = 0;
                setServerOnline(true);
            };

            // Listen for messages from the server
            eventSourceRef.onmessage = (event) => {
                const data = JSON.parse(event.data);
                refreshPolygons();

                // Switch statement to set success message based on event type
                switch (data.action){
                    case 'polygon_update':
                        showAlert('Polygon updated', 'success');
                        break;

                    case 'polygon_delete':
                        // data is an array of deleted polygon ids
                        const countDeleted = data.data.length;
                        if (countDeleted > 1){
                            showAlert(`${countDeleted} polygons deleted`, 'success');
                        }else if(countDeleted === 1){
                            showAlert('Polygon deleted', 'success');
                        }else{
                            showAlert('No polygons deleted', 'info');
                        }
                        break;

                    case 'polygon_save':
                        showAlert('Polygon saved', 'success');
                        break;
                    
                    case 'spekboom_mask_processing':
                        showAlert('Spekboom mask processing', 'info');
                        break;

                    default:
                        break;
                }
                
            };

            // Handle any errors
            eventSourceRef.onerror = (error) => {
                console.error('SSE connection error:', error);
                // Close and retry connection on error
                eventSourceRef.close()

                // If reconnect attempts exceed 5, stop trying to reconnect
                if (reconnectAttempts > 5) {
                    console.log('Failed to reconnect after 5 attempts');

                    // Set server online state to false
                    setServerOnline(false);
                }else{
                    // Reconnect after 3 seconds
                    setTimeout(() => {
                        console.log('Reconnecting...');
                        connectSSE();
                        // Increment reconnect attempts
                        reconnectAttempts++;
                    }, 3000);
                }

            };

        };

        connectSSE();

        // Cleanup on component unmount
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current?.close();
            }
        };
        }, [setServerOnline]); 

    return null;
}

export default SSEComponent;