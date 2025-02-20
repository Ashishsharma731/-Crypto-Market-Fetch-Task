import { useEffect, useState } from "react";
import axios from "axios";

const OHLCV = () => {
  const [ohlcv, setOhlcv] = useState(null);

  useEffect(() => {
    axios.get("/api/ohlcv")
      .then((res) => setOhlcv(res.data))
      .catch((err) => console.error("Failed to fetch OHLCV data", err));
  }, []);

  return (
    <div className="p-4 bg-gray-700 text-white rounded-md shadow-md">
      <h2 className="text-lg font-bold">OHLCV Data</h2>
      {ohlcv ? (
        <div className="mt-2">
          <p><span className="font-semibold">Open:</span> {ohlcv.open}</p>
          <p><span className="font-semibold">High:</span> {ohlcv.high}</p>
          <p><span className="font-semibold">Low:</span> {ohlcv.low}</p>
          <p><span className="font-semibold">Close:</span> {ohlcv.close}</p>
          <p><span className="font-semibold">Volume:</span> {ohlcv.volume}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default OHLCV;
