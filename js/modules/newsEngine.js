export function analizarNoticias() {
  // Simulación de noticias del día
  const escenarios = [
    { texto: "Noticias positivas 🟢", color: "buy" },
    { texto: "Noticias mixtas 🟡", color: "wait" },
    { texto: "Noticias negativas 🔴", color: "sell" }
  ];

  return escenarios[Math.floor(Math.random() * escenarios.length)];
}
