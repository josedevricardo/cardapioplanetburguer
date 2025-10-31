// src/components/produto-slider/ProdutoSlider.jsx
import React, { useState, useEffect, useContext } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseConfig";
import { CartContext } from "../../contexts/cart-context";
import { AnimatePresence, motion } from "framer-motion";
import "./produto-slider.css";

const ProdutoSlider = ({ busca }) => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [quantidadeExibida, setQuantidadeExibida] = useState(10);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useContext(CartContext);

  // Carrega categorias e produtos do Firebase
  useEffect(() => {
    const categoriasRef = ref(db, "categorias");
    const unsubscribe = onValue(categoriasRef, (snapshot) => {
      const data = snapshot.val() || {};
      const categoriasFormatadas = Object.entries(data).map(([chave, cat]) => ({
        nome: cat.nome || chave,
        produtos: Object.entries(cat.produtos || {})
          .map(([id, p]) => ({ id, ...p }))
          .filter((p) => p.ativo === undefined || p.ativo === true),
      }));

      const ordemManual = ["Lanches", "Bebidas", "Sucos", "Omeletes", "Acresimos", "Açai"];
      const categoriasOrdenadas = ordemManual
        .map((nome) => categoriasFormatadas.find((cat) => cat.nome === nome))
        .filter(Boolean);

      setCategorias(categoriasOrdenadas);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Produtos unificados
  const produtosUnificados = categorias.flatMap((cat) =>
    cat.produtos.map((p) => ({ ...p, categoria: cat.nome }))
  );

  const categoriasNomes = ["Todas", ...categorias.map((c) => c.nome)];
  const buscaLower = (busca || "").toLowerCase();

  const produtosFiltrados = produtosUnificados
    .filter((p) => categoriaFiltro === "Todas" || p.categoria === categoriaFiltro)
    .filter(
      (p) =>
        (p.nome || "").toLowerCase().includes(buscaLower) ||
        (p.descricao || "").toLowerCase().includes(buscaLower) ||
        (p.categoria || "").toLowerCase().includes(buscaLower)
    );

  const produtosExibidos = produtosFiltrados.slice(0, quantidadeExibida);

  const formatarPreco = (preco) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(preco);

  const handleClick = (produto) => {
    const item = {
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      foto: produto.imagem,
      qtd: 1,
    };
    addToCart(item);
  };

  const mostrarMais = () => setQuantidadeExibida((prev) => prev + 10);

  return (
    <div className="produto-slider-container">
      {!loading && (
        <>
          {/* Menu flutuante de categorias */}
          <button
            className="botao-flutuante"
            onClick={() => setShowFloatingMenu((prev) => !prev)}
          >
            ☰ Categorias
          </button>

          <AnimatePresence>
            {showFloatingMenu && (
              <motion.div
                className="floating-menu"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                {categoriasNomes.map((cat) => (
                  <button
                    key={cat}
                    className={`floating-item ${cat === categoriaFiltro ? "ativo" : ""}`}
                    onClick={() => {
                      setCategoriaFiltro(cat);
                      setQuantidadeExibida(10);
                      setShowFloatingMenu(false);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <div className="produto-slider">
        {produtosExibidos.length === 0 ? (
          <p>Nenhum produto encontrado.</p>
        ) : (
          produtosExibidos.map((produto) => {
            const itemNoCarrinho = cartItems.find((p) => p.id === produto.id);
            const qtd = itemNoCarrinho ? itemNoCarrinho.qtd : 0;

            return (
              <div key={produto.id} className="produto-item">
                <img
                  src={produto.imagem || "https://via.placeholder.com/150"}
                  alt={produto.nome}
                  className="produto-imagem"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
                <h3>{produto.nome}</h3>
                <p className="text-descricao">{produto.descricao}</p>
                <p className="prod-vitrine-preco">{formatarPreco(produto.preco)}</p>
                <button className="botao-adicionar" onClick={() => handleClick(produto)}>
                  {qtd > 0 ? `Adicionar mais (${qtd}x)` : "Adicionar à Sacola"}
                </button>
              </div>
            );
          })
        )}
      </div>

      {quantidadeExibida < produtosFiltrados.length && produtosExibidos.length > 0 && (
        <div className="mostrar-mais-container">
          <button onClick={mostrarMais}>Mostrar mais</button>
        </div>
      )}
    </div>
  );
};

export default ProdutoSlider;
