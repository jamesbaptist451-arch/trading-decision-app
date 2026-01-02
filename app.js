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

const resultadoNoticias = newsDecision(noticiasDelDia);

console.log(resultadoNoticias);

