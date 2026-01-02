import { newsDecision } from "./modules/newsEngine.js";

const resultadoNoticias = newsDecision(noticiasDelDia);

console.log(resultadoNoticias);

import { newsDecision } from "./modules/newsEngine.js";

// 📰 NOTICIAS SIMULADAS DEL DÍA
const noticiasDelDia = [
  {
    titulo: "US CPI comes higher than expected",
    tipo: "MACRO",
    impacto: "ALTO",
    direccion: "BEARISH",
    confianza: 0.9
  },
  {
    titulo: "Bitcoin ETF sees strong institutional inflows",
    tipo: "ETF",
    impacto: "ALTO",
    direccion: "BULLISH",
    confianza: 0.8
  }
];

// Ejecutar motor de noticias
const resultadoNoticias = newsDecision(noticiasDelDia);

const semaforo = document.getElementById("semaforo");
const icono = document.getElementById("icono");
const texto = document.getElementById("texto");

// Reset clases
semaforo.className = "";

switch (resultadoNoticias.estado) {
  case "BLOQUEADO":
    semaforo.classList.add("bloqueado");
    icono.innerText = "⛔";
    texto.innerText = "NO TRADE · Noticias de alto impacto";
    break;

  case "BULLISH":
    semaforo.classList.add("bullish");
    icono.innerText = "🟢";
    texto.innerText = "CONTEXTO BULLISH · Buscar LONG";
    break;

  case "BEARISH":
    semaforo.classList.add("bearish");
    icono.innerText = "🔴";
    texto.innerText = "CONTEXTO BEARISH · Buscar SHORT";
    break;

  default:
    semaforo.classList.add("neutral");
    icono.innerText = "⚪";
    texto.innerText = "NEUTRAL · Esperar confirmación";
}


// Ver resultado
console.log("Resultado noticias:", resultadoNoticias);


async function cargarPrecioBTC() {
  try {
    const res = await fetch(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    );
    const data = await res.json();

    document.getElementById("btcPrecio").innerText =
      `$${parseFloat(data.price).toFixed(2)}`;

  } catch (error) {
    document.getElementById("btcPrecio").innerText = "Error al cargar precio";
  }
}

cargarPrecioBTC();

import { newsDecision } from "./modules/newsEngine.js";

// Simulación de noticias del día
const noticiasDelDia = [
  {
    titulo: "US CPI higher than expected",
    tipo: "MACRO",
    impacto: "ALTO",
    direccion: "BEARISH",
    confianza: 0.9,
    hora: "14:30"
  }
];

// Evaluar automáticamente al cargar
const decision = newsDecision(noticiasDelDia);

console.log("DECISIÓN FINAL:", decision.estado);

// Actualizar UI básica (texto)
const decisionEl = document.getElementById("decision-noticias");
if (decisionEl) {
  decisionEl.textContent = decision.estado;
}

document.addEventListener("DOMContentLoaded", () => {
  const decisionNoticias = document.getElementById("decision-noticias");

  if (decisionNoticias) {
    decisionNoticias.textContent = "Noticias neutrales 📊";
  }
});



