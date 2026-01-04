const fetch = require("node-fetch");

const BASE = "https://api.binance.com";

async function getMarkets() {
  const res = await fetch(`${BASE}/api/v3/ticker/24hr`);
  const data = await res.json();

  return data
    .filter(p => p.symbol.endsWith("USDT"))
    .map(p => ({
      symbol: p.symbol,
      volume: Number(p.quoteVolume),
      change: Number(p.priceChangePercent)
    }));
}

module.exports = { getMarkets };
