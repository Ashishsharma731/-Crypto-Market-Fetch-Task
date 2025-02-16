const WebSocket = require("ws");
const BinanceService = require("../services/binanceService");
const BybitService = require("../services/bybitService");
const KucoinService = require("../services/kucoinService");
const MEXCService = require("../services/mexcService");

class FuturesModel {
    constructor(port) {
        this.port = port;
        this.server = new WebSocket.Server({ port });
    }

    start() {
        this.server.on("connection", (ws) => {
            console.log("New Futures Market Client Connected");

            ws.on("close", () => console.log("Futures Market Client Disconnected"));
        });

        // Broadcast function
        const broadcast = (data) => {
            this.server.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        };

        // Connect to different exchanges
        BinanceService.connect(broadcast, "futures");
        BybitService.connect(broadcast, "futures");
        KucoinService.connect(broadcast, "futures");
        MEXCService.connect(broadcast, "futures");
    }
}

module.exports = FuturesModel;
