const btcPriceEl = document.getElementById("btc-price");
const decisionNoticias = document.getElementById("decision-noticias");
const finalSignalEl = document.getElementById("final-signal");

let priceHistory = [];
const EMA_PERIOD = 20;
const RSI_PERIOD = 14;


let lastPrice = null;
let currentNewsScore = 0;

// Precio BTC
async function cargarPrecioBTC() {
  try {
    const response = await fetch(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    );
    const data = await response.json();
    const price = parseFloat(data.price);

    btcPriceEl.textContent = `$${price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

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

    calcularDecisionFinal();
  } catch (error) {
    btcPriceEl.textContent = "Error cargando precio";
  }
}

// Noticias
async function evaluarNoticias() {
  try {
    const response = await fetch(
      "https://nfs.faireconomy.media/ff_calendar_thisweek.json"
    );
    const data = await response.json();

    // Filtrar noticias de alto impacto USD
    const highImpactUSD = data.filter(
      n => n.impact === "High" && n.currency === "USD"
    );

    let score = 0;

    highImpactUSD.forEach(noticia => {
      if (noticia.actual && noticia.forecast) {
        if (noticia.actual > noticia.forecast) score += 1;
        if (noticia.actual < noticia.forecast) score -= 1;
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

  if (currentNewsScore === 1 && btcPriceEl.style.color === "green") {
    signal = "BUY";
    color = "green";
  } else if (currentNewsScore === -1 && btcPriceEl.style.color === "red") {
    signal = "SELL";
    color = "red";
  }

  finalSignalEl.textContent = signal;
  finalSignalEl.style.color = color;
  finalSignalEl.style.fontWeight = "bold";
  finalSignalEl.style.fontSize = "1.4em";
}

// Inicializar
cargarPrecioBTC();
evaluarNoticias();

// Actualizar cada 30s
setInterval(() => {
  cargarPrecioBTC();
  evaluarNoticias();
}, 30000);
