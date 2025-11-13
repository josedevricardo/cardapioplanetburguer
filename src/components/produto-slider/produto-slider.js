// src/components/produto-slider/produto-slider.js
import React, { useState, useEffect, useContext } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseConfig";
import { CartContext } from "../../contexts/cart-context";
import { motion, AnimatePresence } from "framer-motion";




const ProdutoSlider = ({ categoriaSelecionada, produtosFiltrados }) => {
  const { adicionarAoCarrinho } = useContext(CartContext);
  const [produtos, setProdutos] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [, setLoading] = useState(true); // ✅ Ajustado para não gerar warning

  useEffect(() => {
  const categoriasRef = ref(db, "categorias");
  onValue(categoriasRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const lista = Object.values(data).flatMap((cat) =>
        Object.values(cat.produtos || {}).map((p) => ({
          ...p,
          categoria: cat.nome,
        }))
      );
      setProdutos(lista);
      setLoading(false);
    }
  });
}, []);


  // Mostrar botão flutuante só após rolagem e quando página terminar de carregar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    const handleLoad = () => {
      setShowButton(false);
      window.addEventListener("scroll", handleScroll);
    };

    window.addEventListener("load", handleLoad);
    return () => {
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleAdd = (produto) => {
    adicionarAoCarrinho(produto);
    setMensagem(`${produto.nome} adicionado à sacola!`);
    setTimeout(() => setMensagem(""), 3000);
  };

  const listaFiltrada = categoriaSelecionada
    ? produtos.filter((p) => p.categoria === categoriaSelecionada)
    : produtosFiltrados?.length
    ? produtosFiltrados
    : produtos;

  return (
    <div className="produto-slider-container">
      <AnimatePresence>
        {mensagem && (
          <motion.div
            className="mensagem-adicionado"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {mensagem}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="produtos-grid">
        {listaFiltrada.map((produto) => (
          <motion.div
            key={produto.id}
            className="produto-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img src={produto.imagem} alt={produto.nome} className="produto-img" />
            <h3>{produto.nome}</h3>
            <p className="produto-desc">{produto.descricao}</p>
            <p className="produto-preco">R$ {produto.preco}</p>
            <button onClick={() => handleAdd(produto)} className="btn-add">
              Adicionar
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showButton && (
          <motion.button
            className="btn-flutuante"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            Categorias
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProdutoSlider;
