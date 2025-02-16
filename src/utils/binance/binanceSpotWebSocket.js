const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws";

export function connectBinanceSpotWebSocket(updatePrices) {
  const socket = new WebSocket(
    `${BINANCE_WS_URL}/btcusdt@aggTrade/ethusdt@aggTrade/solusdt@aggTrade`
  );

  socket.onopen = () => {
    console.log("Connected to Binance WebSocket");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data && data.s && data.p) {
      const symbol = data.s.toLowerCase(); 
      updatePrices((prevPrices) => ({
        ...prevPrices,
        [symbol]: parseFloat(data.p).toFixed(2),
      }));
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket Disconnected");
  };
  

  return socket;
}
