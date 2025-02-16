const { fetchOHLCV } = require("../models/exchangeModel");

async function getOHLCV(req, res) {
  try {
    const { exchange, marketType, symbol, interval, limit } = req.query;

    if (!exchange || !marketType || !symbol || !interval || !limit) {
      return res.status(400).json({ error: "Missing query parameters" });
    }

    const data = await fetchOHLCV(exchange, marketType, symbol, interval, limit);
    res.json({ exchange, marketType, symbol, interval, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getOHLCV };
