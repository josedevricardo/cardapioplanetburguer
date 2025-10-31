// src/components/CategoriaSlider/ProdutoSliderHorizontal.jsx
import React, { useEffect, useRef, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CategoriaSlider.css";
import { useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseConfig";
import { CartContext } from "../../contexts/cart-context";

const colors = ["#34D399", "#10B981", "#6EE7B7", "#FBBF24", "#F87171"];

const ProdutoSliderHorizontal = () => {
  const [produtos, setProdutos] = useState([]);
  const [clicked, setClicked] = useState(null);
  const [toast, setToast] = useState(null);
  const sliderRef = useRef(null);
  const isUserInteracting = useRef(false);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  // Carrega produtos do Firebase
  useEffect(() => {
    const produtosRef = ref(db, "categorias/lanches/produtos");
    onValue(produtosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setProdutos(Object.values(data));
    });
  }, []);

  // Rolagem automática
  useEffect(() => {
    const slider = sliderRef.current;
    let scrollInterval;

    if (slider) {
      const startAutoScroll = () => {
        if (scrollInterval) clearInterval(scrollInterval);
        scrollInterval = setInterval(() => {
          if (!isUserInteracting.current) {
            if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
              slider.scrollTo({ left: 0, behavior: "smooth" });
            } else {
              slider.scrollBy({ left: 1, behavior: "smooth" });
            }
          }
        }, 20);
      };

      startAutoScroll();

      const handleStart = () => (isUserInteracting.current = true);
      const handleEnd = () => {
        isUserInteracting.current = false;
        startAutoScroll();
      };

      slider.addEventListener("mousedown", handleStart);
      slider.addEventListener("mouseup", handleEnd);
      slider.addEventListener("touchstart", handleStart);
      slider.addEventListener("touchend", handleEnd);

      return () => {
        clearInterval(scrollInterval);
        slider.removeEventListener("mousedown", handleStart);
        slider.removeEventListener("mouseup", handleEnd);
        slider.removeEventListener("touchstart", handleStart);
        slider.removeEventListener("touchend", handleEnd);
      };
    }
  }, []);

  // ✅ Corrigido: converte preço para número antes de adicionar ao carrinho
  const handleAdd = (produto, index) => {
    const precoNumerico = parseFloat(
      produto.preco.toString().replace(",", ".")
    );

    addToCart({ ...produto, preco: precoNumerico });

    setClicked(index);
    setToast(`🍔 ${produto.nome} adicionado à sacola!`);

    setTimeout(() => {
      setClicked(null);
      setToast(null);
    }, 1500);
  };

  const toastVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -50, scale: 0.8 },
  };

  const particleVariants = {
    hidden: { opacity: 0, y: 0, scale: 0 },
    visible: (i) => ({
      opacity: 1,
      y: -20 - Math.random() * 20,
      x: (i - 4) * 12 + Math.random() * 10,
      scale: 1,
      rotate: Math.random() * 360,
      transition: { duration: 0.8, ease: "easeOut" },
    }),
    exit: { opacity: 0, scale: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="categoria-slider-container relative">
      {/* Toast central com confete */}
      <AnimatePresence>
        {toast && (
          <motion.div
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-50
                       text-center font-semibold text-sm"
          >
            {toast}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1">
              {[...Array(12)].map((_, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={particleVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="block w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={sliderRef}
        className="categoria-slider"
        drag="x"
        dragConstraints={{ left: -500, right: 0 }}
        whileTap={{ cursor: "grabbing" }}
      >
        {produtos.map((produto, index) => (
          <motion.div
            key={index}
            className="categoria-item bg-white shadow-md rounded-xl p-3 flex flex-col items-center justify-between"
            whileHover={{ scale: 1.05 }}
          >
            <div
              className="cursor-pointer"
              onClick={() => navigate("/produto2")}
            >
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="categoria-img rounded-lg"
              />
              <span className="block mt-2 font-semibold text-sm text-zinc-800">
                {produto.nome}
              </span>
            </div>

            <span className="text-red-600 font-bold mt-1">
              R$ {parseFloat(produto.preco).toFixed(2).replace(".", ",")}
            </span>

            {/* Botão moderno com CSS */}
            <button
              className="btn-adicionar"
              onClick={() => handleAdd(produto, index)}
            >
              <span className="emoji">🍔</span>
              {clicked === index ? "Adicionado!" : "Adicionar"}
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProdutoSliderHorizontal;
