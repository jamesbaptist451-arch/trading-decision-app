const axios = require("axios");

const BASE = "https://api.binance.com";

async function getMarkets() {
  const res = await axios.get(`${BASE}/api/v3/ticker/24hr`);

  return res.data
    .filter(p => p.symbol.endsWith("USDT"))
    .map(p => ({
      symbol: p.symbol,
      volume: Number(p.quoteVolume),
      change: Number(p.priceChangePercent)
    }));
}

module.exports = { getMarkets };
