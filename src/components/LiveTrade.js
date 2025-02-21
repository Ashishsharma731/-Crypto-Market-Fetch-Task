import useWebSocket from "../hook/useWebSocket";
import useWebSocketSpot from "../hook/useWebSocketSpot";

const LiveTrade = ({ exchange, symbol }) => {
  const spotData = useWebSocketSpot(exchange, symbol);
  const futuresData = useWebSocket(exchange, symbol);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Spot Market Data */}
      <div className="p-4 bg-blue-800 text-white rounded-md shadow-md">
        <h2 className="text-lg font-bold">{exchange} - {symbol} (SPOT)</h2>
        {spotData ? (
          <div className="mt-2">
            <p><span className="font-semibold">Last Price:</span> {spotData.lastPrice || spotData.p}</p>
            <p><span className="font-semibold">Volume:</span> {spotData.volume24h || spotData.q}</p>
          </div>
        ) : (
          <p>Waiting for Spot trade data...</p>
        )}
      </div>

      {/* Futures Market Data */}
      <div className="p-4 bg-green-800 text-white rounded-md shadow-md">
        <h2 className="text-lg font-bold">{exchange} - {symbol} (FUTURES)</h2>
        {futuresData ? (
          <div className="mt-2">
            <p><span className="font-semibold">Last Price:</span> {futuresData.lastPrice || futuresData.p}</p>
            <p><span className="font-semibold">Volume:</span> {futuresData.volume24h || futuresData.q}</p>
          </div>
        ) : (
          <p>Waiting for Futures trade data...</p>
        )}
      </div>
    </div>
  );
};

export default LiveTrade;
