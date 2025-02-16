const FuturesModel = require("../models/futuresModel");
const logger = require("../utils/logger");

function startFuturesServer() {
    const futuresModel = new FuturesModel(5002);
    futuresModel.start();
    logger.info("Futures Market WebSocket running on ws://localhost:5002");
}

module.exports = startFuturesServer;
