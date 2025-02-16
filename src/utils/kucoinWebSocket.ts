const BINANCE_WS_URL = "wss://stream.binance.com:9443/ws/btcusdt@aggTrade";

export function connectKucoinWebSocket(updatePrice: (price: string) => void) {
  const socket = new WebSocket(BINANCE_WS_URL);

  socket.onopen = () => {
    console.log("Connected to Binance WebSocket");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data && data.p) {
      updatePrice(data.p);
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
