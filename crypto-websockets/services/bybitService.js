const WebSocket = require("ws");
const reconnect = require("../utils/reconnect");
const logger = require("../utils/logger");

class BybitService {
    static connect(broadcast, marketType) {
        const url = marketType === "spot"
            ? "wss://stream.bybit.com/spot/public/v3"
            : "wss://stream.bybit.com/v5/public/futures";

        const bybitWS = new WebSocket(url);

        bybitWS.on("open", () => {
            logger.info(` Bybit ${marketType} WebSocket connected`);
            const subscribeMessage = {
                op: "subscribe",
                args: [`publicTrade.BTCUSDT`]
            };
            bybitWS.send(JSON.stringify(subscribeMessage));
        });

        bybitWS.on("message", (data) => {
            try {
                const parsedData = JSON.parse(data);
                if (parsedData.topic && parsedData.topic.includes("publicTrade")) {
                    const trade = parsedData.data[0];
                    const formattedData = {
                        exchange: "bybit",
                        market: marketType,
                        time: trade.T,
                        price: trade.p,
                        volume: trade.v
                    };
                    broadcast(formattedData);
                }
            } catch (error) {
                logger.error(` Bybit ${marketType} parsing error: ${error.message}`);
            }
        });

        reconnect(bybitWS, url);
    }
}

module.exports = BybitService;
