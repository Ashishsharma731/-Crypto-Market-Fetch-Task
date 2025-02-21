module.exports = {
    binance: {
      spot: "https://api.binance.com/api/v3/klines",
      futures: "https://fapi.binance.com/fapi/v1/klines",
    },
    bybit: {
      spot: "https://api.bybit.com/v5/market/kline?category=linear",
      futures: "https://api.bybit.com/v5/market/kline?category=linear",
    },
    mexc: {
      spot: "https://api.mexc.com/api/v3/klines",
      futures: "https://contract.mexc.com/api/v1/contract/kline",
    },
    kucoin: {
      spot: "https://api.kucoin.com/api/v1/market/candles",
      futures: "https://api.kucoin.com/api/v1/market/candles",
    },
  };
  