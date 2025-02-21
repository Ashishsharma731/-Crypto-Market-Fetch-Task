import { useEffect, useState, useRef } from "react";

const SPOT_WS_URL = "ws://localhost:8080";

const useWebSocketSpot = (exchange, symbol) => {
  const [tradeData, setTradeData] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {

      wsRef.current = new WebSocket(SPOT_WS_URL);

      wsRef.current.onopen = () => {
        console.log(" Connected to SPOT WebSocket");
        wsRef.current.send(JSON.stringify({ exchange, symbol }));
      };

      wsRef.current.onmessage = (event) => {
        setTradeData(JSON.parse(event.data));
      };

      wsRef.current.onerror = (error) => console.error(" WebSocket Error:", error);

      wsRef.current.onclose = () => {
        console.warn(" WebSocket Disconnected. Reconnecting...");
        setTimeout(connectWebSocket, 5000); 
      };
    };

    connectWebSocket(); 

    return () => {
      console.log(" Closing WebSocket...");
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [exchange, symbol]); 

  return tradeData;
};

export default useWebSocketSpot;
