const WebSocket = require("ws");
const axios = require("axios");
const symbolMap = require("../models/exchangeModel");
const KucoinAuth = require("../utils/kucoinAuth");

const exchanges = {
  binance: "wss://stream.binance.com:9443/ws",
  bybit: "wss://stream.bybit.com/v5/public/spot",
  mexc: "wss://wbs.mexc.com/ws",
  kucoin: "wss://ws-api-spot.kucoin.com/",
};

const wsClients = {};

async function getKucoinToken() {
  try {
    const response = await axios.post("https://api.kucoin.com/api/v1/bullet-public");
    return response.data.data.token;
  } catch (error) {
    console.error("Error getting KuCoin token:", error.message);
    return null;
  }
}

async function connectToExchanges() {
  const symbol = "BTCUSDT";

  // Binance WebSocket
  connectWebSocket(
    "binance",
    `${exchanges.binance}/${symbolMap.binance(symbol)}`
  );

  // Bybit WebSocket
  connectWebSocket("bybit", exchanges.bybit, JSON.stringify({
    op: "subscribe",
    args: [symbolMap.bybit(symbol)],
  }));

  // MEXC WebSocket
  connectWebSocket("mexc", exchanges.mexc, JSON.stringify({
    method: "SUBSCRIPTION",
    params: [symbolMap.mexc(symbol)],
  }));

  // KuCoin WebSocket (Requires Auth)
  const token = await getKucoinToken();
  if (token) {
    connectWebSocket("kucoin", `${exchanges.kucoin}?token=${token}`, JSON.stringify({
      id: "1",
      type: "subscribe",
      topic: symbolMap.kucoin(symbol),
      response: true,
    }));
  }
}

function connectWebSocket(exchange, url, message = null) {
  console.log(`Connecting to ${exchange} WebSocket...`);

  const ws = new WebSocket(url);

  ws.on("open", () => {
    console.log(`${exchange} WebSocket connected.`);
    if (message) ws.send(message);
  });

  ws.on("message", (data) => {
    console.log(`${exchange} Data:`, data.toString());
  });

  ws.on("error", (err) => {
    console.error(`${exchange} WebSocket error:`, err.message);
  });

  ws.on("close", () => {
    console.log(`${exchange} WebSocket closed. Reconnecting...`);
    setTimeout(() => connectWebSocket(exchange, url, message), 6000);
  });

  wsClients[exchange] = ws;
}

module.exports = { connectToExchanges };
