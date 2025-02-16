const SpotModel = require("../models/spotModel");
const logger = require("../utils/logger");

function startSpotServer() {
    const spotModel = new SpotModel(5001);
    spotModel.start();
    logger.info("Spot Market WebSocket running on ws://localhost:5001");
}

module.exports = startSpotServer;
