const WebSocket = require("ws");
const reconnect = require("../utils/reconnect");
const logger = require("../utils/logger");

class MEXCService {
    static connect(broadcast, marketType) {
        const url = marketType === "spot"
            ? "wss://wbs.mexc.com/ws"
            : "wss://contract.mexc.com/ws";

        const mexcWS = new WebSocket(url);

        mexcWS.on("open", () => {
            logger.info(`✅ MEXC ${marketType} WebSocket connected`);
            const subscribeMessage = {
                method: "SUBSCRIPTION",
                params: [`trade.BTC_USDT`]
            };
            mexcWS.send(JSON.stringify(subscribeMessage));
        });

        mexcWS.on("message", (data) => {
            try {
                const parsedData = JSON.parse(data);
                if (parsedData.d && parsedData.d.length > 0) {
                    const trade = parsedData.d[0];
                    const formattedData = {
                        exchange: "mexc",
                        market: marketType,
                        time: trade.t,
                        price: trade.p,
                        volume: trade.q
                    };
                    broadcast(formattedData);
                }
            } catch (error) {
                logger.error(`❌ MEXC ${marketType} parsing error: ${error.message}`);
            }
        });

        reconnect(mexcWS, url);
    }
}

module.exports = MEXCService;
