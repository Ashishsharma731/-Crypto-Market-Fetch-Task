const WebSocket = require("ws");
const axios = require("axios");
const http = require("http");
const symbolMap = require("../models/exchangeModel"); 
const KucoinAuth = require("../utils/kucoinAuth"); 
const symbols = require("./symbols");

const exchanges = {
  binance: "wss://stream.binance.com:9443/ws",
  bybit: "wss://stream.bybit.com/v5/public/spot",
  mexc: "wss://wbs.mexc.com/ws",
  kucoin: "wss://ws-api-spot.kucoin.com/",
};

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const wsClients = new Set();

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

server.listen(8080, () => {
  console.log(" WebSocket Server running on ws://localhost:8080");
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
    const response = await axios.post("https://api.kucoin.com/api/v1/bullet-public");
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
    console.log(` ${exchange} Data:`, data.toString());

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
    setTimeout(() => connectWebSocket(exchange, url, message), 9000);
  });
}

// Start fetching exchange data
module.exports = { connectToExchanges };
