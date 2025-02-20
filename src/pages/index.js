import { useState } from "react";
import LiveTrade from "../components/LiveTrade";
// import OHLCV from "../components/OHLCV";

export default function Home() {
  const [marketType, setMarketType] = useState("spot");
  const [exchange, setExchange] = useState("binance");
  const [symbol, setSymbol] = useState("BTCUSDT");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold">Crypto Trading Dashboard</h1>

      {/* OHLCV Data */}
      {/* <OHLCV /> */}

      {/* Market Type Selection */}
      <div className="mt-4">
        <label className="mr-2">Market Type:</label>
        <button
          onClick={() => setMarketType("spot")}
          className={`px-4 py-2 mx-2 rounded ${marketType === "spot" ? "bg-blue-500" : "bg-gray-700"}`}
        >
          Spot
        </button>
        <button
          onClick={() => setMarketType("futures")}
          className={`px-4 py-2 mx-2 rounded ${marketType === "futures" ? "bg-blue-500" : "bg-gray-700"}`}
        >
          Futures
        </button>
      </div>

      {/* Exchange Selection */}
      <div className="mt-4">
        <label className="mr-2">Exchange:</label>
        {["binance", "bybit", "mexc", "kucoin"].map((ex) => (
          <button
            key={ex}
            onClick={() => setExchange(ex)}
            className={`px-4 py-2 mx-2 rounded ${exchange === ex ? "bg-green-500" : "bg-gray-700"}`}
          >
            {ex.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Live Trade Data */}
      <div className="mt-6">
        <LiveTrade marketType={marketType} exchange={exchange} symbol={symbol} />
      </div>
    </div>
  );
}
