const express = require("express");
const { getOHLCV } = require("../controllers/exchangeController");
const router = express.Router();

router.get("/ohlcv", getOHLCV);

module.exports = router;
