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



