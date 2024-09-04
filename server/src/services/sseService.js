// Store client connections
const clients = new Map();

// Add a client to the store
function addClient(clientId, res) {
    clients.set(clientId, res);
};

// Remove a client from the store
function removeClient(clientId) {
    clients.delete(clientId);
};

// Send event to specific client
function sendEvent(clientId, data) {
    const client = clients.get(clientId);
    if (client) {
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    }
};


export default {
    addClient,
    removeClient,
    sendEvent
}