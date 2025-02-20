const symbolMap = {
  binance: (symbol) => symbol.toLowerCase() + "@aggTrade",
  bybit: (symbol) => `tickers.${symbol}`,
  mexc: (symbol) => ({ method: "sub.ticker", param: { symbol: symbol.replace("USDT", "_USDT") } }),
  kucoin: (symbol) => `/contractMarket/level2:${symbol.replace("USDT", "M")}`,
};

module.exports = symbolMap;
