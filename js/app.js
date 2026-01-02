const decisionNoticias = document.getElementById("decision-noticias");

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

evaluarNoticias();
