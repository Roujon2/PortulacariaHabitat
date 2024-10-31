import sseService from "../services/sseService.js";

// SSE connection handler
function connect(req, res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();

    // Send keep-alive
    const keepAliveInterval = setInterval(() => {
        res.write(': keep-alive\n\n');
    }, 3000);

    // Initial heartbeat
    res.write("\n\n");

    // Get user id from request object
    const clientId = req.user.id;

    // Add client to the store
    sseService.addClient(clientId, res);

    // Send a welcome message
    sseService.sendEvent(clientId, { message: "Initial SSE message" });

    // Handle connection close
    req.on("close", () => {
        clearInterval(keepAliveInterval);
        sseService.removeClient(clientId);
    });
};

export default {
    connect
}