import useWebSocket from "../hook/useWebSocket";

const LiveTrade = ({ marketType, exchange, symbol }) => {
  const tradeData = useWebSocket(marketType, exchange, symbol);

  return (
    <div className="p-4 bg-gray-800 text-white rounded-md shadow-md">
      <h2 className="text-lg font-bold">{exchange} - {symbol} ({marketType.toUpperCase()})</h2>
      {tradeData ? (
        <div className="mt-2">
          <p><span className="font-semibold">Last Price:</span> {tradeData.lastPrice || tradeData.p}</p>
          <p><span className="font-semibold">Volume:</span> {tradeData.volume24h || tradeData.q}</p>
        </div>
      ) : (
        <p>Waiting for trade data...</p>
      )}
    </div>
  );
};

export default LiveTrade;
