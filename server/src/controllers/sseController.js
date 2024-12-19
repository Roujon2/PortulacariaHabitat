import sseService from "../services/sseService.js";

// SSE connection handler
function connect(req, res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();

    // Get user id from request object
    const clientId = req.user.id;

    // Send keep-alive
    const keepAliveInterval = setInterval(() => {
        sseService.sendEvent(clientId, { message: "Keep-alive" });
        res.write(': keep-alive\n\n');
    }, 30000);


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