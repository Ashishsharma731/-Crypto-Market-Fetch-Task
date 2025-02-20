const symbolMap = {
    binance: (symbol) => symbol.toLowerCase() + "@aggTrade",
    bybit: (symbol) => `tickers.${symbol}`,
    mexc: (symbol) => `spot@public.deals.v3.api@${symbol}`,
    kucoin: (symbol) => `/market/level2:${symbol.replace("USDT", "-USDT")}`,
  };
  
  module.exports = symbolMap;
  