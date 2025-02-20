import { useEffect, useState } from "react";

// Your backend WebSocket server URLs
const SPOT_WS_URL = "ws://localhost:6000";   // Replace with your Spot WebSocket server
const FUTURES_WS_URL = "ws://localhost:7000"; // Replace with your Futures WebSocket server

const useWebSocket = (marketType, exchange, symbol) => {
  const [tradeData, setTradeData] = useState(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    let wsUrl = marketType === "spot" ? SPOT_WS_URL : FUTURES_WS_URL;
    const webSocket = new WebSocket(wsUrl);

    webSocket.onopen = () => {
      console.log("Connected to WebSocket Server");
      const subscribeMessage = JSON.stringify({ exchange, symbol });
      webSocket.send(subscribeMessage);
    };

    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTradeData(data);
    };

    webSocket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    webSocket.onclose = () => {
      console.log("WebSocket Closed. Reconnecting...");
      setTimeout(() => {
        setWs(new WebSocket(wsUrl));
      }, 5000);
    };

    setWs(webSocket);

    return () => {
      webSocket.close();
    };
  }, [marketType, exchange, symbol]);

  return tradeData;
};

export default useWebSocket;
