require("dotenv").config();
const startSpotServer = require("./controllers/spotController");
const startFuturesServer = require("./controllers/futuresController");

startSpotServer();
startFuturesServer();
