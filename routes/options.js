const express = require("express");
const Airtable = require("airtable");

const router = express.Router();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

// GET para listar opções
router.get("/", async (req, res) => {
  try {
    const records = await base(process.env.AIRTABLE_OPTIONS_TABLE)
      .select()
      .all();

    const options = records.map((record) => ({
      id: record.id,
      categoria: record.get("Categoria"),
      valor: record.get("Valor"),
    }));

    res.status(200).json(options);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar opções" });
  }
});

// POST para adicionar uma nova opção
router.post("/", async (req, res) => {
  try {
    const { categoria, valor } = req.body;

    if (!categoria || !valor) {
      return res
        .status(400)
        .json({ error: "Categoria e Valor são obrigatórios" });
    }

    await base(process.env.AIRTABLE_OPTIONS_TABLE).create([
      {
        fields: {
          Categoria: categoria,
          Valor: valor,
        },
      },
    ]);

    res.status(200).json({ message: "Opção adicionada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar opção" });
  }
});

module.exports = router;
