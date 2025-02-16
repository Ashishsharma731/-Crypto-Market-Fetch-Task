const WebSocket = require("ws");
const reconnect = require("../utils/reconnect");
const logger = require("../utils/logger");

class BinanceService {
    static connect(broadcast, marketType) {
        const url = marketType === "spot"
            ? "wss://stream.binance.com:9443/ws/btcusdt@trade"
            : "wss://fstream.binance.com/ws/btcusdt@trade";
        
        const binanceWS = new WebSocket(url);

        binanceWS.on("open", () => logger.info(`✅ Binance ${marketType} WebSocket connected`));

        binanceWS.on("message", (data) => {
            const parsedData = JSON.parse(data);
            broadcast({ exchange: "binance", market: marketType, ...parsedData });
        });

        reconnect(binanceWS, url);
    }
}

module.exports = BinanceService;
