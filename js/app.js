const btcPriceEl = document.getElementById("btc-price");
const decisionNoticias = document.getElementById("decision-noticias");

// Obtener precio BTC
async function cargarPrecioBTC() {
  try {
    const response = await fetch(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    );
    const data = await response.json();

    const price = parseFloat(data.price).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    btcPriceEl.textContent = `$${price}`;
  } catch (error) {
    btcPriceEl.textContent = "Error cargando precio";
  }
}

// Simulación temporal de noticias
function evaluarNoticias() {
  const escenarios = [
    { texto: "Noticias positivas 🟢", color: "green" },
    { texto: "Noticias mixtas 🟡", color: "orange" },
    { texto: "Noticias negativas 🔴", color: "red" }
  ];

  const resultado = escenarios[Math.floor(Math.random() * escenarios.length)];

  decisionNoticias.textContent = resultado.texto;
  decisionNoticias.style.color = resultado.color;
  decisionNoticias.style.fontWeight = "bold";
}

// Inicializar
cargarPrecioBTC();
evaluarNoticias();

// 🔁 Actualización automática cada 30 segundos
setInterval(() => {
  cargarPrecioBTC();
  evaluarNoticias();
}, 30000);
