const noticia = {
  titulo: "CPI higher than expected",
  tipo: "MACRO",        // MACRO | FED | ETF | GEO | CRYPTO
  impacto: "ALTO",      // ALTO | MEDIO | BAJO
  direccion: "BEARISH", // BULLISH | BEARISH | NEUTRAL
  confianza: 0.9,       // 0 a 1
  timestamp: Date.now()
};

function clasificarNoticia(titulo) {
  const t = titulo.toLowerCase();

  if (t.includes("cpi") || t.includes("inflation")) {
    return { tipo: "MACRO", impacto: "ALTO" };
  }

  if (t.includes("fed") || t.includes("powell")) {
    return { tipo: "FED", impacto: "ALTO" };
  }

  if (t.includes("etf")) {
    return { tipo: "ETF", impacto: "ALTO" };
  }

  if (t.includes("war") || t.includes("conflict")) {
    return { tipo: "GEO", impacto: "ALTO" };
  }

  return { tipo: "OTHER", impacto: "BAJO" };
}

function evaluarRiesgoMacro(noticias) {
  return noticias.some(n =>
    n.impacto === "ALTO" &&
    (n.tipo === "MACRO" || n.tipo === "FED")
  );
}

function calcularImpacto(noticia) {
  let score = 0;

  if (noticia.impacto === "ALTO") score = 3;
  if (noticia.impacto === "MEDIO") score = 1;

  if (noticia.direccion === "BEARISH") score *= -1;
  if (noticia.direccion === "NEUTRAL") score = 0;

  return score * noticia.confianza;
}

function newsDecision(noticias) {
  if (evaluarRiesgoMacro(noticias)) {
    return {
      estado: "BLOQUEADO",
      razon: "Evento macro de alto impacto"
    };
  }

  const scoreTotal = noticias.reduce(
    (acc, n) => acc + calcularImpacto(n),
    0
  );

  if (scoreTotal > 2) return { estado: "BULLISH", score: scoreTotal };
  if (scoreTotal < -2) return { estado: "BEARISH", score: scoreTotal };

  return { estado: "NEUTRAL", score: scoreTotal };
}
