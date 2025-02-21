import { useEffect, useState, useRef } from "react";

const FUTURES_WS_URL = "ws://localhost:7000";

const useWebSocket = (exchange, symbol) => {
  const [tradeData, setTradeData] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);

  useEffect(() => {
    if (wsRef.current) wsRef.current.close(); 

    const webSocket = new WebSocket(FUTURES_WS_URL);
    wsRef.current = webSocket;

    webSocket.onopen = () => {
      console.log(" Connected to FUTURES WebSocket");
      webSocket.send(JSON.stringify({ exchange, symbol }));
    };

    webSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setTradeData((prev) => (JSON.stringify(prev) !== JSON.stringify(data) ? data : prev));
      } catch (error) {
        console.error(" Error parsing FUTURES message:", error);
      }
    };

    webSocket.onerror = (error) => console.error(" FUTURES WebSocket Error:", error);

    webSocket.onclose = () => {
      console.warn(" FUTURES WebSocket Disconnected. Reconnecting...");
      reconnectTimerRef.current = setTimeout(() => {
        wsRef.current = new WebSocket(FUTURES_WS_URL);
      }, 5000);
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
      clearTimeout(reconnectTimerRef.current);
    };
  }, [exchange, symbol]);

  return tradeData;
};

export default useWebSocket;
