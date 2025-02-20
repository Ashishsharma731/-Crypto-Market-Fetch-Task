const axios = require("axios");

async function getKucoinToken() {
  try {
    const response = await axios.post("https://api.kucoin.com/api/v1/bullet-public");
    return response.data.data.token;
  } catch (error) {
    console.error("Error getting KuCoin token:", error.message);
    return null;
  }
}

module.exports = { getKucoinToken };
