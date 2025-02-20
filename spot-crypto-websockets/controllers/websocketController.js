const WebSocketService = require("../services/websocketService");

class WebSocketController {
  static async start() {
    await WebSocketService.connectToExchanges();
  }
}

module.exports = WebSocketController;
