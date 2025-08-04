const express = require("express");
const Airtable = require("airtable");

const router = express.Router();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

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

    await base(process.env.AIRTABLE_TABLE_NAME).create([
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
