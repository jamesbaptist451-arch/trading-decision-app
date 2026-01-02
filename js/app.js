const decisionNoticias = document.getElementById("decision-noticias");
const finalSignal = document.getElementById("final-signal");

function evaluarNoticias() {
  const escenarios = [
    {
      texto: "Noticias positivas 🟢",
      color: "green",
      signal: "BUY",
      signalColor: "green"
    },
    {
      texto: "Noticias mixtas 🟡",
      color: "orange",
      signal: "WAIT",
      signalColor: "orange"
    },
    {
      texto: "Noticias negativas 🔴",
      color: "red",
      signal: "SELL",
      signalColor: "red"
    }
  ];

  const resultado = escenarios[Math.floor(Math.random() * escenarios.length)];

  // Noticias
  decisionNoticias.textContent = resultado.texto;
  decisionNoticias.style.color = resultado.color;
  decisionNoticias.style.fontWeight = "bold";

  // Señal final
  finalSignal.textContent = resultado.signal;
  finalSignal.style.color = resultado.signalColor;
  finalSignal.style.fontWeight = "bold";
  finalSignal.style.fontSize = "1.4em";
}

evaluarNoticias();
