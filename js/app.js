const btcPriceEl = document.getElementById("btc-price");
const decisionNoticias = document.getElementById("decision-noticias");
const finalSignalEl = document.getElementById("final-signal");

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
    calcularDecisionFinal();
  } catch (error) {
    btcPriceEl.textContent = "Error cargando precio";
  }
}

// Noticias
function evaluarNoticias() {
  const escenarios = [
    { texto: "Noticias positivas 🟢", score: 1, color: "green" },
    { texto: "Noticias mixtas 🟡", score: 0, color: "orange" },
    { texto: "Noticias negativas 🔴", score: -1, color: "red" }
  ];

  const resultado = escenarios[Math.floor(Math.random() * escenarios.length)];

  decisionNoticias.textContent = resultado.texto;
  decisionNoticias.style.color = resultado.color;
  decisionNoticias.style.fontWeight = "bold";

  currentNewsScore = resultado.score;
  calcularDecisionFinal();
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
