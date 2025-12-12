import "./produto-slider.css";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "../../firebaseConfig";
import { CartContext } from "../../contexts/cart-context";
import { motion, AnimatePresence } from "framer-motion";

const ProdutoSlider = ({ busca = "" }) => {
  const { addToCart } = useContext(CartContext);

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState("todas");

  const [mensagem, setMensagem] = useState("");

  const [mostrarBotao, setMostrarBotao] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  const [ultimoClicado, setUltimoClicado] = useState(null);

  /* =============================
      BOTÃO FLUTUANTE SCROLL
  ============================= */
  useEffect(() => {
    const onScroll = () => {
      const scrollAtual = window.scrollY;

      if (scrollAtual > 80) {
        setMostrarBotao(true);
      } else {
        setMostrarBotao(false);
        setMenuAberto(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* =============================
      SOME EM 2s SE NÃO CLICAR
  ============================= */
  useEffect(() => {
    if (!mostrarBotao || menuAberto) return;

    const timeoutId = setTimeout(() => {
      setMostrarBotao(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [mostrarBotao, menuAberto]);

  /* =============================
      FIREBASE — CATEGORIAS + PRODUTOS
  ============================= */
  useEffect(() => {
    const categoriasRef = ref(db, "categorias");

    onValue(categoriasRef, (snap) => {
      if (!snap.exists()) return;

      const data = snap.val();
      const listaProdutos = [];
      const listaCategorias = [];

      Object.entries(data).forEach(([catNome, catDados]) => {
        listaCategorias.push(catNome);

        Object.entries(catDados.produtos || {}).forEach(([id, produto]) => {
          listaProdutos.push({
            id,
            categoria: catNome,
            ...produto,
          });
        });
      });

      setCategorias(listaCategorias);
      setProdutos(listaProdutos);
    });

    return () => off(categoriasRef);
  }, []);

  /* =============================
      ADICIONAR AO CARRINHO
  ============================= */
  const handleAdd = (produto) => {
    addToCart({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      foto: produto.foto || produto.imagem,
      qtd: 1,
    });

    setUltimoClicado(produto.id);

    setTimeout(() => setUltimoClicado(null), 1500);

    setMensagem(`${produto.nome} adicionado à sacola!`);
    setTimeout(() => setMensagem(""), 2500);
  };

  /* =============================
      FILTRO FINAL (categoria + busca)
  ============================= */
  const listaFiltrada = useMemo(() => {
    let lista = produtos;

    if (categoriaAtiva !== "todas") {
      lista = lista.filter((p) => p.categoria === categoriaAtiva);
    }

    if (busca) {
      const termo = busca.toLowerCase();
      lista = lista.filter((p) =>
        p.nome?.toLowerCase().includes(termo)
      );
    }

    return lista;
  }, [produtos, categoriaAtiva, busca]);

  /* =============================
      RENDER
  ============================= */
  return (
    <div className="produto-slider-container">

      {/* TOAST */}
      <AnimatePresence>
        {mensagem && (
          <motion.div
            className="mensagem-adicionado"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {mensagem}
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTÃO FLUTUANTE */}
      <button
        className={`botao-flutuante ${
          mostrarBotao && !menuAberto ? "mostrar" : ""
        }`}
        onClick={() => setMenuAberto(true)}
      >
        ☰ ✅ Ver Cardápio
      </button>

      {/* MENU FLUTUANTE */}
      <AnimatePresence>
        {menuAberto && (
          <motion.div
            className="floating-menu"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            {/* TODAS */}
            <button
              className={`floating-item ${
                categoriaAtiva === "todas" ? "ativo" : ""
              }`}
              onClick={() => {
                setCategoriaAtiva("todas");
                setMenuAberto(false);
              }}
            >
              Todas Categorias
            </button>

            {/* LISTA DE CATEGORIAS */}
            {categorias.map((cat) => (
              <button
                key={cat}
                className={`floating-item ${
                  categoriaAtiva === cat ? "ativo" : ""
                }`}
                onClick={() => {
                  setCategoriaAtiva(cat);
                  setMenuAberto(false);
                }}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID DE PRODUTOS */}
      <div className="produtos-grid">
        {listaFiltrada.length === 0 ? (
          <div className="sem-produtos">Nenhum produto encontrado.</div>
        ) : (
          listaFiltrada.map((produto) => (
            <motion.div
              key={produto.id}
              className="produto-card"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <img
                src={
                  produto.foto ||
                  produto.imagem ||
                  "https://via.placeholder.com/300x200"
                }
                alt={produto.nome}
                className="produto-img"
              />

              <h3>{produto.nome}</h3>
              <p className="produto-desc">{produto.descricao || ""}</p>

              <p className="produto-preco">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(produto.preco)}
              </p>

              <button
                className={`btn-add ${
                  ultimoClicado === produto.id ? "clicado" : ""
                }`}
                onClick={() => handleAdd(produto)}
              >
                {ultimoClicado === produto.id ? "✓✓ Adicionado" : "Adicionar"}
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProdutoSlider;
