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
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");

  const [quantidadeExibida, setQuantidadeExibida] = useState(10);
  const [mensagem, setMensagem] = useState("");

  const [mostrarBotao, setMostrarBotao] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  /* =============================
     SCROLL — BOTÃO (60% + rolar pra baixo)
  ============================= */

useEffect(() => {
  const onScroll = () => {
    const scrollAtual = window.scrollY;

    // aparece assim que sair do topo
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
    setMostrarBotao(false); // some após 2s sem interação
  }, 2000);

  return () => clearTimeout(timeoutId);
}, [mostrarBotao, menuAberto]);

  /* =============================
     FIREBASE — PRODUTOS + CATEGORIAS
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

    setMensagem(`${produto.nome} adicionado à sacola!`);
    setTimeout(() => setMensagem(""), 2500);
  };

  /* =============================
     FILTRO
  ============================= */
  const listaFiltrada = useMemo(() => {
    let lista = produtos;

    if (categoriaFiltro !== "Todas") {
      lista = lista.filter((p) => p.categoria === categoriaFiltro);
    }

    if (busca) {
      const termo = busca.toLowerCase();
      lista = lista.filter((p) =>
        p.nome?.toLowerCase().includes(termo)
      );
    }

    return lista;
  }, [produtos, categoriaFiltro, busca]);

  const exibidos = listaFiltrada.slice(0, quantidadeExibida);

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
            <button
              className={`floating-item ${
                categoriaFiltro === "Todas" ? "ativo" : ""
              }`}
              onClick={() => {
                setCategoriaFiltro("Todas");
                setMenuAberto(false);
                setQuantidadeExibida(10);
              }}
            >
              Todas
            </button>

            {categorias.map((cat) => (
              <button
                key={cat}
                className={`floating-item ${
                  categoriaFiltro === cat ? "ativo" : ""
                }`}
                onClick={() => {
                  setCategoriaFiltro(cat);
                  setMenuAberto(false);
                  setQuantidadeExibida(10);
                }}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* GRID */}
      <div className="produtos-grid">
        {exibidos.length === 0 ? (
          <div className="sem-produtos">Nenhum produto encontrado.</div>
        ) : (
          exibidos.map((produto) => (
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
                className="btn-add"
                onClick={() => handleAdd(produto)}
              >
                Adicionar
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* MOSTRAR MAIS */}
      {quantidadeExibida < listaFiltrada.length && (
        <div className="mostrar-mais-container">
          <button onClick={() => setQuantidadeExibida((v) => v + 10)}>
            Mostrar mais +
          </button>
        </div>
      )}
    </div>
  );
};

export default ProdutoSlider;
