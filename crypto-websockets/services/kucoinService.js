const WebSocket = require("ws");
const reconnect = require("../utils/reconnect");
const logger = require("../utils/logger");

class KucoinService {
    static connect(broadcast, marketType) {
        const url = marketType === "spot"
            ? "wss://ws-api.kucoin.com/endpoint"
            : "wss://futures.kucoin.com/endpoint";

        const kucoinWS = new WebSocket(url);

        kucoinWS.on("open", () => {
            logger.info(`✅ Kucoin ${marketType} WebSocket connected`);
            const subscribeMessage = {
                id: Date.now(),
                type: "subscribe",
                topic: `/market/match:${marketType === "spot" ? "BTC-USDT" : "XBTUSDTM"}`,
                privateChannel: false,
                response: true
            };
            kucoinWS.send(JSON.stringify(subscribeMessage));
        });

        kucoinWS.on("message", (data) => {
            try {
                const parsedData = JSON.parse(data);
                if (parsedData.topic && parsedData.topic.includes("/market/match")) {
                    const trade = parsedData.data;
                    const formattedData = {
                        exchange: "kucoin",
                        market: marketType,
                        time: trade.time,
                        price: trade.price,
                        volume: trade.size
                    };
                    broadcast(formattedData);
                }
            } catch (error) {
                logger.error(`❌ Kucoin ${marketType} parsing error: ${error.message}`);
            }
        });

        reconnect(kucoinWS, url);
    }
}

module.exports = KucoinService;
