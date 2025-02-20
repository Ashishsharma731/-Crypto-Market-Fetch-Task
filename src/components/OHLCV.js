"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Bar,
  Line,
  CartesianGrid,
} from "recharts";

const OHLCV = () => {
  const [exchange, setExchange] = useState("binance");
  const [marketType, setMarketType] = useState("spot");
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState("1m");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOHLCV = async () => {
    setLoading(true);
    try {

      const res = await axios.get(`http://localhost:5000/api/ohlcv`, {
        params: { exchange, marketType, symbol, interval, limit: 50 },
      });
      
      const formattedData = res.data.data.map((candle) => ({
        timestamp: new Date(candle.timestamp).toLocaleTimeString(), 
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: candle.volume,
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching OHLCV data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOHLCV();
  }, [exchange, marketType, symbol, interval]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Candlestick Chart</h1>

      <div className="flex gap-4 mt-4">
        <select
          className="p-2 border rounded text-black bg-white"
          value={exchange}
          onChange={(e) => setExchange(e.target.value)}
        >
          <option value="binance">Binance</option>
          <option value="bybit">Bybit</option>
          <option value="mexc">MEXC</option>
          <option value="kucoin">KuCoin</option>
        </select>

        <select
          className="p-2 border rounded text-black bg-white"
          value={marketType}
          onChange={(e) => setMarketType(e.target.value)}
        >
          <option value="spot">Spot</option>
          <option value="futures">Futures</option>
        </select>

        <select
          className="p-2 border rounded text-black bg-white"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        >
          <option value="BTCUSDT">BTC/USDT</option>
          <option value="ETHUSDT">ETH/USDT</option>
        </select>

        <select
          className="p-2 border rounded text-black bg-white"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
        >
          <option value="1m">1m</option>
          <option value="5m">5m</option>
          <option value="15m">15m</option>
          <option value="1h">1h</option>
        </select>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data}>
              <XAxis dataKey="timestamp" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />

              <Bar dataKey="close" fill="green" />

              <Line dataKey="high" stroke="black" strokeWidth={1} dot={false} />
              <Line dataKey="low" stroke="black" strokeWidth={1} dot={false} />

            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">No data available</p>
        )}
      </div>
    </div>
  );
};

export default OHLCV;
