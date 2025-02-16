const WebSocket = require("ws");
const BinanceService = require("../services/binanceService");
const BybitService = require("../services/bybitService");
const KucoinService = require("../services/kucoinService");
const MEXCService = require("../services/mexcService");

class SpotModel {
    constructor(port) {
        this.port = port;
        this.server = new WebSocket.Server({ port });
    }

    start() {
        this.server.on("connection", (ws) => {
            console.log("New Spot Market Client Connected");

            ws.on("close", () => console.log("Spot Market Client Disconnected"));
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
        BinanceService.connect(broadcast, "spot");
        BybitService.connect(broadcast, "spot");
        KucoinService.connect(broadcast, "spot");
        MEXCService.connect(broadcast, "spot");
    }
}

module.exports = SpotModel;
