require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const binance = require("./binance");

app.get("/api/markets", async (req, res) => {
  const data = await binance.getMarkets();
  res.json(data);
});

app.listen(3000, () => {
  console.log("Backend activo en puerto 3000");
});

