import sseService from "../services/sseService.js";

// SSE connection handler
function connect(req, res) {
    // Release db client since sse won't be using it
    const dbClient = res.locals.dbClient
    dbClient.release();

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();

    // Get user id from request object
    const clientId = req.user.id;

    // Add client to the store
    sseService.addClient(clientId, res);

    // Send a welcome message
    sseService.sendEvent(clientId, { message: "SSE Connection established!" });

    // Handle connection close
    req.on("close", () => {
        sseService.removeClient(clientId);
    });
};

export default {
    connect
}