const axios = require("axios");
const apiConfig = require("../config/apiConfig");

async function fetchOHLCV(exchange, marketType, symbol, interval, limit, start, end) {
  try {
    if (!apiConfig[exchange] || !apiConfig[exchange][marketType]) {
      throw new Error("Invalid exchange or market type");
    }

    const url = apiConfig[exchange][marketType];

    symbol = symbol.toUpperCase();

    let params = { symbol, interval, limit };

    if (exchange === "bybit") {

      const intervalMap = {
        "1m": "1", "3m": "3", "5m": "5", "15m": "15",
        "30m": "30", "1h": "60", "2h": "120", "4h": "240",
        "6h": "360", "12h": "720", "1d": "1440"
      };

      params = {
        category: marketType === "futures" ? "linear" : "spot", 
        symbol,
        interval: intervalMap[interval] || "1", 
        limit: limit || 100,
        ...(start && { start }),
        ...(end && { end }),
      };
    } else if (exchange === "kucoin") {

      symbol = symbol.replace("USDT", "-USDT");

      const intervalMap = {
        "1m": "1min", "3m": "3min", "5m": "5min", "15m": "15min",
        "30m": "30min", "1h": "1hour", "2h": "2hour", "4h": "4hour",
        "6h": "6hour", "8h": "8hour", "12h": "12hour", "1d": "1day",
        "1w": "1week"
      };

      params = {
        type: intervalMap[interval] || "1min", 
        symbol,
        startAt: start ? Math.floor(start / 1000) : undefined,  
        endAt: end ? Math.floor(end / 1000) : undefined         
      };
    } else if (exchange === "mexc") {
      params = {
        symbol,
        interval,
        limit: limit || 100,
        startTime: start ? start : undefined,
        endTime: end ? end : undefined,
      };
    }

    const response = await axios.get(url, { params });

    let ohlcvData = [];

    if (exchange === "bybit") {
      if (!response.data.result || !response.data.result.list || response.data.result.list.length === 0) {
        throw new Error("No OHLCV data returned from Bybit");
      }
      ohlcvData = response.data.result.list.map((candle) => ({
        timestamp: parseInt(candle[0]) * 1000, 
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5]),
      }));
    } else if (exchange === "kucoin") {
      if (!response.data.data) {
        throw new Error("Invalid KuCoin response format");
      }
      ohlcvData = response.data.data.map((candle) => ({
        timestamp: parseInt(candle[0]) * 1000, 
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5]),
      }));
    } else {
      ohlcvData = response.data.map((candle) => ({
        timestamp: candle[0],
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5]),
      }));
    }

    return ohlcvData;
  } catch (error) {
    console.error(`Error fetching ${exchange} OHLCV:`, error.message);
    return [];
  }
}

module.exports = { fetchOHLCV };
