const express = require("express");
const Airtable = require("airtable");

const router = express.Router();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

// GET para listar pedidos
router.get("/", async (req, res) => {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_ORDERS)
      .select()
      .all();

    const orders = records.map((record) => ({
      id: record.id,
      cliente: record.get("Cliente"),
      produto: record.get("Produto"),
      quantidade: record.get("Quantidade"),
      recheio: record.get("Recheio"),
      observacao: record.get("Observação"),
      entrega: record.get("Entrega"),
      endereco: record.get("Endereço"),
      statusPagamento: record.get("Status Pagamento"),
      dataPedido: record.get("Data Pedido"),
      dataEntrega: record.get("Data Entrega"),
      valorTotal: record.get("Valor Total (€)"),
    }));

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
});

// POST para criar pedido
router.post("/", async (req, res) => {
  try {
    const {
      cliente,
      produto,
      quantidade,
      saborRecheio,
      observacao,
      entrega,
      endereco,
      statusPagamento,
      dataEntrega,
    } = req.body;

    let valorUnitario = 4.5;
    if (produto.toLowerCase().includes("brigadeiro")) valorUnitario = 1;

    const valorTotal = quantidade * valorUnitario;

    await base(process.env.AIRTABLE_TABLE_ORDERS).create([
      {
        fields: {
          Cliente: cliente,
          Produto: produto,
          Quantidade: quantidade,
          Recheio: Array.isArray(saborRecheio) ? saborRecheio : [saborRecheio],
          Observação: observacao,
          Entrega: entrega,
          Endereço: endereco,
          "Status Pagamento": statusPagamento,
          "Data Entrega": dataEntrega,
          "Valor Total (€)": valorTotal,
        },
      },
    ]);

    res.status(200).json({ message: "Pedido salvo com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar pedido" });
  }
});

module.exports = router;
