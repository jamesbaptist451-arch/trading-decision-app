import { analizarNoticias } from "../modules/newsEngine.js";

const decisionNoticias = document.getElementById("decision-noticias");

if (decisionNoticias) {
  const resultado = analizarNoticias();
  decisionNoticias.textContent = resultado.texto;
  decisionNoticias.className = resultado.color;
}
