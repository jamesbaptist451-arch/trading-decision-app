const btcPriceEl = document.getElementById("btc-price");
const decisionNoticias = document.getElementById("decision-noticias");
const finalSignalEl = document.getElementById("final-signal");
const analysisDetailsEl = document.getElementById("analysis-details");
const alertStatusEl = document.getElementById("alert-status");

let lastAlertSignal = null;
let lastSignal = null;
let priceHistory = [];
const EMA_PERIOD = 20;
const RSI_PERIOD = 14;


let lastPrice = null;
let currentNewsScore = 0;

// Precio BTC
async function cargarPrecioBTC() {
  // 1️⃣ Intentar BINANCE
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT",
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    const data = await response.json();
    const price = parseFloat(data.price);

    actualizarPrecio(price, "Binance");
    return;

  } catch (e) {
    console.warn("Binance no disponible, intentando CoinGecko...");
  }

  // 2️⃣ Intentar COINGECKO
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );

    const data = await response.json();
    const price = data.bitcoin.usd;

    actualizarPrecio(price, "CoinGecko");
    return;

  } catch (e) {
    console.warn("CoinGecko no disponible, usando último precio...");
  }

  // 3️⃣ FALLBACK FINAL
  const fallbackPrice = lastPrice || 43000;
  actualizarPrecio(fallbackPrice, "Estimado");
}
function actualizarPrecio(price, fuente) {
  btcPriceEl.textContent = `$${price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} (${fuente})`;

  // Momentum simple
  if (lastPrice !== null) {
    if (price > lastPrice) btcPriceEl.style.color = "green";
    else if (price < lastPrice) btcPriceEl.style.color = "red";
    else btcPriceEl.style.color = "gray";
  }

  lastPrice = price;
  calcularDecisionFinal();
}



    // Momentum simple
    if (lastPrice !== null) {
      if (price > lastPrice) {
        btcPriceEl.style.color = "green";
      } else if (price < lastPrice) {
        btcPriceEl.style.color = "red";
      } else {
        btcPriceEl.style.color = "gray";
      }
    }

    lastPrice = price;
    priceHistory.push(price);
if (priceHistory.length > 100) {
  priceHistory.shift();
}

    function calcularDecisionFinal() {
  if (lastPrice === null) return;

  let signal = "WAIT";
  let color = "orange";

  const ema = calcularEMA(priceHistory, EMA_PERIOD);
  const rsi = calcularRSI(priceHistory, RSI_PERIOD);

  // 📰 Si hay noticias fuertes, mandan
  if (currentNewsScore !== 0) {
    if (currentNewsScore === 1 && btcPriceEl.style.color === "green") {
      signal = "BUY";
      color = "green";
    } else if (currentNewsScore === -1 && btcPriceEl.style.color === "red") {
      signal = "SELL";
      color = "red";
    }
  }

  // 📊 Si NO hay noticias → análisis técnico
  if (currentNewsScore === 0 && ema && rsi) {
    let confirmations = 0;

    if (lastPrice > ema) confirmations++;
    if (rsi > 55) confirmations++;

    if (confirmations >= 2) {
      signal = "BUY";
      color = "green";
    }

    confirmations = 0;
    if (lastPrice < ema) confirmations++;
    if (rsi < 45) confirmations++;

    if (confirmations >= 2) {
      signal = "SELL";
      color = "red";
    }
  }

  finalSignalEl.textContent = signal;
  finalSignalEl.style.color = color;
  finalSignalEl.style.fontWeight = "bold";
  finalSignalEl.style.fontSize = "1.4em";
}


// Noticias
async function evaluarNoticias() {
  try {
    const response = await fetch(
      "https://api.allorigins.win/raw?url=https://nfs.faireconomy.media/ff_calendar_thisweek.json"
    );
    const data = await response.json();

    // Filtrar noticias de alto impacto USD
    const highImpactUSD = data.filter(
      n => n.impact === "High" && n.currency === "USD"
    );

    let score = 0;

    highImpactUSD.forEach(noticia => {
     const actual = parseFloat(
       String(noticia.actual).replace("%", "")     
     );
     const forecast = parseFloat(
       String(noticia.forecast).replace("%", "")
     );

     if (!isNaN(actual) && !isNaN(forecast)) {
       if (actual > forecast) score += 1;
       if (actual < forecast) score -= 1;
     }

      }
    });

    // Clasificación final
    let texto = "Noticias mixtas 🟡";
    let color = "orange";

    if (score > 0) {
      texto = "Noticias macro positivas 🟢";
      color = "green";
    } else if (score < 0) {
      texto = "Noticias macro negativas 🔴";
      color = "red";
    }

    decisionNoticias.textContent = texto;
    decisionNoticias.style.color = color;
    decisionNoticias.style.fontWeight = "bold";

    currentNewsScore = score > 0 ? 1 : score < 0 ? -1 : 0;
    calcularDecisionFinal();

  } catch (error) {
    decisionNoticias.textContent = "Noticias no disponibles";
    decisionNoticias.style.color = "gray";
    currentNewsScore = 0;
  }
}


// Decisión final
function calcularDecisionFinal() {
  if (lastPrice === null) return;

  let signal = "WAIT";
  let color = "orange";
  let motivo = "Esperando confirmaciones";

  const ema = calcularEMA(priceHistory, EMA_PERIOD);
  const rsi = calcularRSI(priceHistory, RSI_PERIOD);

  // 📰 Noticias mandan si existen
  if (currentNewsScore !== 0) {
    if (currentNewsScore === 1 && btcPriceEl.style.color === "green") {
      signal = "BUY";
      color = "green";
      motivo = "Noticias positivas + momentum alcista";
    } else if (currentNewsScore === -1 && btcPriceEl.style.color === "red") {
      signal = "SELL";
      color = "red";
      motivo = "Noticias negativas + momentum bajista";
    } else {
      motivo = "Noticias presentes pero sin confirmación técnica";
    }
    actualizarAlerta(signal);
    const riskPlanEl = document.getElementById("risk-plan");
    riskPlanEl.textContent = calcularRiesgo(signal, lastPrice);

  }
    lanzarAlerta(signal, motivo);
    


  // 📊 Análisis técnico cuando no hay noticias
  if (currentNewsScore === 0 && ema && rsi) {
    if (lastPrice > ema && rsi > 55) {
      signal = "BUY";
      color = "green";
      motivo = "Precio sobre EMA + RSI fuerte";
    } else if (lastPrice < ema && rsi < 45) {
      signal = "SELL";
      color = "red";
      motivo = "Precio bajo EMA + RSI débil";
    } else {
      motivo = "Mercado lateral (EMA y RSI sin alineación)";
    }
  }

  // Mostrar señal
  finalSignalEl.textContent = signal;
  finalSignalEl.style.color = color;
  finalSignalEl.style.fontWeight = "bold";
  finalSignalEl.style.fontSize = "1.4em";

  // Mostrar detalles
  analysisDetailsEl.textContent = `
EMA(20): ${ema ? ema.toFixed(2) : "—"}
RSI(14): ${rsi ? rsi.toFixed(1) : "—"}
Motivo: ${motivo}
  `;
}

// Inicializar
cargarPrecioBTC();
evaluarNoticias();

// Actualizar cada 10s
setInterval(() => {
  cargarPrecioBTC();
  evaluarNoticias();
}, 10000);

function calcularEMA(prices, period) {
  if (prices.length < period) return null;
  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b) / period;

  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  return ema;
}

function calcularRSI(prices, period) {
  if (prices.length < period + 1) return null;

  let gains = 0;
  let losses = 0;

  for (let i = prices.length - period; i < prices.length - 1; i++) {
    const diff = prices[i + 1] - prices[i];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }

  const rs = gains / (losses || 1);
  return 100 - 100 / (1 + rs);
}

function lanzarAlerta(signal, motivo) {
  if (signal === lastSignal) return;

  if (signal === "BUY" || signal === "SELL") {
    alert(`🔔 SEÑAL ${signal}\n\n${motivo}`);
    lastSignal = signal;
  }
}
function actualizarAlerta(signal) {
  if (signal === lastAlertSignal) return;

  if (signal === "BUY") {
    alertStatusEl.textContent = "🟢 Oportunidad de COMPRA detectada";
    alertStatusEl.style.color = "green";
    lastAlertSignal = signal;
  } else if (signal === "SELL") {
    alertStatusEl.textContent = "🔴 Señal de VENTA / Riesgo alto";
    alertStatusEl.style.color = "red";
    lastAlertSignal = signal;
  } else {
    alertStatusEl.textContent = "Sin alertas";
    alertStatusEl.style.color = "gray";
    lastAlertSignal = signal;
  }
}

function calcularRiesgo(signal, price) {
  if (signal === "WAIT" || !price) {
    return "Sin plan (esperando señal clara)";
  }

  // volatilidad simple: rango de los últimos 10 precios
  const lookback = 10;
  if (priceHistory.length < lookback) {
    return "Recolectando datos para riesgo…";
  }

  const recent = priceHistory.slice(-lookback);
  const high = Math.max(...recent);
  const low = Math.min(...recent);
  const range = high - low || price * 0.002; // fallback 0.2%

  let entry = price;
  let stop, target;

  if (signal === "BUY") {
    stop = entry - range * 0.8;
    target = entry + range * 1.6; // R/R ≈ 1:2
  } else if (signal === "SELL") {
    stop = entry + range * 0.8;
    target = entry - range * 1.6;
  }

  const rr = Math.abs((target - entry) / (entry - stop)).toFixed(2);

  return `
Entrada: ${entry.toLocaleString()}
Stop Loss: ${stop.toLocaleString()}
Take Profit: ${target.toLocaleString()}
R/R: 1:${rr}
  `;
}

