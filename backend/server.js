import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const app = express();
app.use(cors());
app.use(express.json());

// 🔒 Middleware de token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

  const token = authHeader.split(" ")[1];
  if (token !== process.env.API_TOKEN) return res.status(403).json({ error: "Token inválido" });

  next();
}

// ROTAS DE CATEGORIAS
app.get("/api/categorias", authMiddleware, async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM categorias ORDER BY nome");
  res.json(rows);
});

app.post("/api/categorias", authMiddleware, async (req, res) => {
  const { nome } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO categorias (nome) VALUES ($1) RETURNING *",
    [nome]
  );
  res.status(201).json(rows[0]);
});

app.put("/api/categorias/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  const { rowCount } = await pool.query(
    "UPDATE categorias SET nome = $1 WHERE id = $2",
    [nome, id]
  );
  if (rowCount === 0) return res.status(404).json({ error: "Categoria não encontrada" });
  res.json({ message: "Atualizada com sucesso" });
});

app.delete("/api/categorias/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { rowCount } = await pool.query("DELETE FROM categorias WHERE id = $1", [id]);
  if (rowCount === 0) return res.status(404).json({ error: "Categoria não encontrada" });
  res.json({ message: "Deletada com sucesso" });
});

// ROTAS DE PRODUTOS
app.get("/api/produtos", authMiddleware, async (req, res) => {
  const { categoria } = req.query;
  let query = `
    SELECT p.*, c.nome AS categoria_nome
    FROM produtos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
  `;
  const params = [];
  if (categoria) {
    query += " WHERE p.categoria_id = $1";
    params.push(categoria);
  }
  query += " ORDER BY p.nome";
  const { rows } = await pool.query(query, params);
  res.json(rows);
});

app.post("/api/produtos", authMiddleware, async (req, res) => {
  const { nome, descricao, preco, categoria_id, imagem } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO produtos (nome, descricao, preco, categoria_id, imagem)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nome, descricao, preco, categoria_id, imagem]
  );
  res.status(201).json(rows[0]);
});

app.put("/api/produtos/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, categoria_id, imagem } = req.body;
  const { rowCount } = await pool.query(
    `UPDATE produtos
     SET nome=$1, descricao=$2, preco=$3, categoria_id=$4, imagem=$5
     WHERE id=$6`,
    [nome, descricao, preco, categoria_id, imagem, id]
  );
  if (rowCount === 0) return res.status(404).json({ error: "Produto não encontrado" });
  res.json({ message: "Atualizado com sucesso" });
});

app.delete("/api/produtos/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { rowCount } = await pool.query("DELETE FROM produtos WHERE id = $1", [id]);
  if (rowCount === 0) return res.status(404).json({ error: "Produto não encontrado" });
  res.json({ message: "Deletado com sucesso" });
});

// INICIAR SERVIDOR
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
