const RISK_PER_TRADE = 0.01;
const ACCOUNT_BALANCE = 1000;

async function getBinancePairs() {
  const res = await fetch("https://api.binance.com/api/v3/exchangeInfo");
  const data = await res.json();
  return data.symbols
    .filter(s => s.quoteAsset === "USDT" && s.status === "TRADING")
    .map(s => s.symbol);
}

async function getCandle(symbol) {
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=100`
  );
  return await res.json();
}

function calculateEMA(data, period) {
  const k = 2 / (period + 1);
  let ema = data[0];
  data.forEach(price => ema = price * k + ema * (1 - k));
  return ema;
}

function analyze(symbol, candles) {
  const closes = candles.map(c => parseFloat(c[4]));
  const ema20 = calculateEMA(closes.slice(-20), 20);
  const ema50 = calculateEMA(closes.slice(-50), 50);

  if (ema20 > ema50) return { symbol, side: "LONG" };
  if (ema20 < ema50) return { symbol, side: "SHORT" };
  return null;
}

function riskManagement(entry, side) {
  const riskAmount = ACCOUNT_BALANCE * RISK_PER_TRADE;
  const sl = side === "LONG" ? entry * 0.98 : entry * 1.02;
  const tp = side === "LONG" ? entry * 1.04 : entry * 0.96;
  return { sl, tp, riskAmount };
}

async function run() {
  const pairs = await getBinancePairs();
  const results = [];

  for (let i = 0; i < 20; i++) {
    const symbol = pairs[i];
    const candles = await getCandle(symbol);
    const signal = analyze(symbol, candles);
    if (signal) results.push(signal);
  }

  const best = results.slice(0, 2);
  document.getElementById("bestTrades").innerHTML =
    best.map(t => `${t.symbol} → ${t.side}`).join("<br>");

  document.getElementById("finalSignal").innerText =
    best.length ? "READY" : "WAIT";
}

run();
