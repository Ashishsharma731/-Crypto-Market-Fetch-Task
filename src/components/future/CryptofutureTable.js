import { useEffect, useState } from "react";
import { connectBinanceFutureWebSocket } from "@/utils/binance/binanceFutureWebSocket";

export default function CryptoFutureTable() {
  const [prices, setPrices] = useState({
    btcusdt: "Loading...",
    ethusdt: "Loading...",
    solusdt: "Loading...",
  });

  useEffect(() => {
    const socket = connectBinanceFutureWebSocket(setPrices);

    return () => socket.close();
  }, []);

  return (
    <div className="overflow-x-auto p-6">
      <table className="min-w-full border border-gray-300 text-center">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Currency Name</th>
            <th className="border px-4 py-2">Gate.io</th>
            <th className="border px-4 py-2">Binance</th>
            <th className="border px-4 py-2">Kucoin</th>
            <th className="border px-4 py-2">HTX</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">Bitcoin (BTC)</td>
            <td className="border px-4 py-2">$43,000</td>
            <td className="border px-4 py-2">{prices.btcusdt}</td>
            <td className="border px-4 py-2">$42,950</td>
            <td className="border px-4 py-2">$43,050</td>
          </tr>
          <tr className="bg-gray-100">
            <td className="border px-4 py-2">Ethereum (ETH)</td>
            <td className="border px-4 py-2">$3,000</td>
            <td className="border px-4 py-2">{prices.ethusdt}</td>
            <td className="border px-4 py-2">$2,980</td>
            <td className="border px-4 py-2">$3,010</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">Solana (SOL)</td>
            <td className="border px-4 py-2">$120</td>
            <td className="border px-4 py-2">{prices.solusdt}</td>
            <td className="border px-4 py-2">$118</td>
            <td className="border px-4 py-2">$121</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
