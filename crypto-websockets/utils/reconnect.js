const WebSocket = require("ws");
const logger = require("./logger");

function reconnect(ws, url) {
    ws.on("close", () => {
        logger.warn(`WebSocket disconnected from ${url}. Reconnecting...`);
        setTimeout(() => {
            reconnect(new WebSocket(url), url);
        }, 5000);
    });

    ws.on("error", (err) => {
        logger.error(`WebSocket error: ${err.message}`);
    });
}

module.exports = reconnect;
