const dotenv = require("dotenv");
dotenv.config(); // carrega o .env antes de tudo

const express = require("express");
const cors = require("cors");
const ordersRouter = require("./routes/orders");
const optionsRouter = require("./routes/options");

console.log(
  "API Key carregada:",
  process.env.AIRTABLE_API_KEY ? "OK" : "NÃO LIDA"
);

const app = express(); // cria o app antes de usar

app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/orders", ordersRouter);
app.use("/api/options", optionsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
