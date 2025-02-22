import { useState, useEffect } from "react";
import useWebSocket from "../hook/useWebSocket";

const LiveTrade = ({ marketType, exchange, symbol }) => {
  const [lastPrice, setLastPrice] = useState({});
  const [volume, setVolume] = useState({});
  
  const tradeData = useWebSocket(marketType, exchange, symbol);


  const getNormalizedSymbol = (exchange, marketType, data) => {
    switch (exchange.toLowerCase()) {
      case "binance":
        return marketType === "spot" ? data?.s : data?.s; // Futures might wrap in `data` formate"BTCUSDT"
  
      case "bybit":
        return marketType === "spot"    // formate"BTCUSDT"
          ? data?.data?.symbol
          : data?.data?.symbol; // Futures may use  
  
      case "mexc":
        return marketType === "spot"    //formate"BTCUSDT"
          ? data?.s 
          : data?.symbol?.replace("_", ""); // Futures may use formate "BTC_USDT"
  
      case "kucoin":
        return marketType === "spot"  // formate for spot "BTC-USDT"
          ? data?.data?.symbol?.replace("-", "") 
          : data?.topic?.split(":")[1] ; // Futures might differ Formate "/contractMarket/level2:XBTUSDM"
  
      default:
        return data?.symbol || data?.data?.symbol; 
    }
  };


  useEffect(() => {
    if (!tradeData?.symbol?.length) return;
  
    tradeData.symbol.forEach((sym) => {
      const receivedSymbol = getNormalizedSymbol(exchange, marketType, tradeData.data);
  
      if (tradeData.exchange === exchange && receivedSymbol === sym) {
        if (marketType === "spot") {
          setLastPrice((prev) => ({
            ...prev,
            [sym]: tradeData?.data?.p
              ? parseFloat(tradeData?.data?.p).toFixed(3)
              : tradeData?.data?.data?.lastPrice ||
                tradeData?.data?.d?.deals?.[0]?.p ||
                tradeData?.data?.data?.changes?.bids?.[0]?.[0] ||
                prev?.[sym],
          }));
  
          setVolume((prev) => ({
            ...prev,
            [sym]: tradeData?.data?.q
              ? parseFloat(tradeData?.data?.q).toFixed(3)
              : tradeData?.data?.data?.volume24h ||
                tradeData?.data?.d?.deals?.[0]?.v ||
                tradeData?.data?.data?.changes?.bids?.[0]?.[1] ||
                prev?.[sym],
          }));
        } else if (marketType === "futures") {
          setLastPrice((prev) => ({
            ...prev,
            [sym]: tradeData?.data?.p ||
              tradeData?.data?.data?.ask1Price ||
              tradeData?.data?.data?.lastPrice ||
              (tradeData?.data?.topic?.includes("level2")
                ? tradeData?.data?.data?.change.split(",")[0]
                : prev?.[sym]),
          }));
  
          setVolume((prev) => ({
            ...prev,
            [sym]: tradeData?.data?.q ||
              tradeData?.data?.data?.ask1Size ||
              tradeData?.data?.data?.volume ||
              (tradeData?.data?.topic?.includes("level2") ? 0 : prev?.[sym]),
          }));
        }
      }
    });
  }, [tradeData, exchange, marketType]);
  
  return (
    <div className="p-4 bg-gray-800 text-white rounded-md shadow-md">
      <h2 className="text-lg font-bold">
        {exchange.toUpperCase()} - ({marketType.toUpperCase()})
      </h2>
      <table className="w-full mt-2 border-collapse border border-gray-600">
        <thead>
          <tr className="bg-gray-700">
            <th className="border border-gray-600 px-4 py-2">Symbol</th>
            <th className="border border-gray-600 px-4 py-2">Last Price</th>
            <th className="border border-gray-600 px-4 py-2">Volume</th>
          </tr>
        </thead>
        <tbody>
          {tradeData?.symbol?.map((sym) => (
            <tr key={sym}>
              <td className="border border-gray-600 px-4 py-2">{sym}</td>
              <td className="border border-gray-600 px-4 py-2">
                {lastPrice[sym] || "Waiting..."}
              </td>
              <td className="border border-gray-600 px-4 py-2">
                {volume[sym] || "Waiting..."}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LiveTrade;
