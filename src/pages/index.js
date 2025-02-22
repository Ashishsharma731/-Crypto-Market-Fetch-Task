import { useState } from "react";
import LiveTrade from "../components/LiveTrade";
import OHLCV from "../components/OHLCV";

export default function Home() {
  const [marketType, setMarketType] = useState("spot");
  const [exchange, setExchange] = useState("binance");
  const [symbol, setSymbol] = useState("BTCUSDT");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-6 text-center">Crypto Trading Dashboard</h1>
      
      {/* Market & Exchange Selection */}
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Select Market & Exchange</h2>

        {/* Market Type Buttons */}
        <div className="flex justify-center gap-4 mb-4">
          {["spot", "futures"].map((type) => (
            <button
              key={type}
              onClick={() => setMarketType(type)}
              className={`px-5 py-2 font-medium rounded-lg transition-all ${
                marketType === type ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Exchange Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {["binance", "bybit", "mexc", "kucoin"].map((ex) => (
            <button
              key={ex}
              onClick={() => setExchange(ex)}
              className={`px-5 py-2 font-medium rounded-lg transition-all ${
                exchange === ex ? "bg-green-600" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {ex.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Live Trade & OHLCV Section */}
      <div className="w-full max-w-4xl mt-6 space-y-6">

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <LiveTrade marketType={marketType} exchange={exchange} symbol={symbol} />
        </div>
        <OHLCV />
      </div>
    </div>
  );
}
