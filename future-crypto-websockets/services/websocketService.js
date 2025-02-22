const WebSocket = require("ws");
const axios = require("axios");
const http = require("http");
const symbolMap = require("../models/exchangeModel"); 
const KucoinAuth = require("../utils/kucoinAuth");
const symbols = require("./symbols");

const exchanges = {
  binance: "wss://fstream.binance.com/ws",
  bybit: "wss://stream.bybit.com/v5/public/linear",
  mexc: "wss://contract.mexc.com/edge",
  kucoin: "wss://ws-api-futures.kucoin.com/",
};

// Create HTTP server for WebSocket
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Store connected clients
const wsClients = new Set();

// Handle new WebSocket connections
wss.on("connection", (ws) => {
  console.log(" New Client Connected");

  ws.on("message", (message) => {
    console.log(" Received:", message.toString());
  });

  ws.on("close", () => {
    console.log(" Client Disconnected");
    wsClients.delete(ws);
  });

  wsClients.add(ws);
});

server.listen(7000, () => {
  console.log(" WebSocket Server running on ws://localhost:7000");
});

async function connectToExchanges() {
  for (const symbol of symbols) {
    connectWebSocket("binance", `${exchanges.binance}/${symbolMap.binance(symbol)}`);

    connectWebSocket("bybit", exchanges.bybit, JSON.stringify({
      op: "subscribe",
      args: [symbolMap.bybit(symbol)],
    }));

    connectWebSocket("mexc", exchanges.mexc, JSON.stringify({
      method: "SUBSCRIPTION",
      params: [symbolMap.mexc(symbol)],
    }));

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
}


async function getKucoinToken() {
  try {
    const response = await axios.post("https://api-futures.kucoin.com/api/v1/bullet-public");
    return response.data.data.token;
  } catch (error) {
    console.error(" Error getting KuCoin token:", error.message);
    return null;
  }
}

function connectWebSocket(exchange, url, message = null) {
  console.log(` Connecting to ${exchange} WebSocket...`);
  const ws = new WebSocket(url);

  ws.symbol = symbols;

  ws.on("open", () => {
    console.log(` Connected to ${exchange}`);
    if (message) ws.send(message);
  });

  ws.on("message", (data) => {
    console.log(` ${exchange} ${ws.symbol} Data:`, data.toString());

    // Forward data to all connected WebSocket clients
    wsClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        // client.send(data.toString());
        client.send(JSON.stringify({ exchange, symbol: ws.symbol, data: JSON.parse(data.toString()) }));
      }
    });
  });

  ws.on("error", (err) => {
    console.error(` ${exchange} WebSocket error:`, err.message);
  });

  ws.on("close", () => {
    console.log(` ${exchange} WebSocket closed. Reconnecting...`);
    setTimeout(() => connectWebSocket(exchange, url, message), 7000);
  });
}

// Start fetching exchange data
// connectToExchanges();
module.exports = { connectToExchanges };
