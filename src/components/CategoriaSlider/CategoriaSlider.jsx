// src/components/CategoriaSlider/ProdutoSliderHorizontal.jsx
import React, { useEffect, useRef, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [showArrows, setShowArrows] = useState(false);
  const sliderRef = useRef(null);
  const isUserInteracting = useRef(false);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  // 🔹 Carrega produtos do Firebase
  useEffect(() => {
    const produtosRef = ref(db, "categorias/lanches/produtos");
    const unsubscribe = onValue(produtosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setProdutos(Object.values(data));
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Rolagem automática com pausa durante interação
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let scrollInterval;
    let pauseTimeout;

    const startAutoScroll = () => {
      clearInterval(scrollInterval);
      scrollInterval = setInterval(() => {
        if (!isUserInteracting.current) {
          const maxScroll = slider.scrollWidth - slider.clientWidth;
          if (slider.scrollLeft >= maxScroll - 2) {
            slider.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            slider.scrollBy({ left: 1, behavior: "smooth" });
          }
        }
      }, 20);
    };

    const pauseAutoScroll = () => {
      isUserInteracting.current = true;
      clearTimeout(pauseTimeout);
      pauseTimeout = setTimeout(() => {
        isUserInteracting.current = false;
      }, 2500);
    };

    slider.addEventListener("mousedown", pauseAutoScroll);
    slider.addEventListener("mouseup", pauseAutoScroll);
    slider.addEventListener("touchstart", pauseAutoScroll);
    slider.addEventListener("touchend", pauseAutoScroll);
    slider.addEventListener("wheel", pauseAutoScroll);

    startAutoScroll();

    return () => {
      clearInterval(scrollInterval);
      clearTimeout(pauseTimeout);
      slider.removeEventListener("mousedown", pauseAutoScroll);
      slider.removeEventListener("mouseup", pauseAutoScroll);
      slider.removeEventListener("touchstart", pauseAutoScroll);
      slider.removeEventListener("touchend", pauseAutoScroll);
      slider.removeEventListener("wheel", pauseAutoScroll);
    };
  }, []);

  // 🔹 Funções de rolagem manual pelas setas
  const scrollLeft = () => {
    const slider = sliderRef.current;
    if (slider) {
      slider.scrollBy({ left: -250, behavior: "smooth" });
      isUserInteracting.current = true;
      setTimeout(() => (isUserInteracting.current = false), 1500);
    }
  };

  const scrollRight = () => {
    const slider = sliderRef.current;
    if (slider) {
      slider.scrollBy({ left: 250, behavior: "smooth" });
      isUserInteracting.current = true;
      setTimeout(() => (isUserInteracting.current = false), 1500);
    }
  };

  // 🔹 Adiciona produto ao carrinho
  const handleAdd = (produto, index) => {
    const precoNumerico = parseFloat(produto.preco.toString().replace(",", "."));
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
    <div
      className="categoria-slider-container relative"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
      onTouchStart={() => setShowArrows(true)}
      onTouchEnd={() => setTimeout(() => setShowArrows(false), 2000)}
    >
      {/* ✅ Toast central com confete */}
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

      {/* 🔹 Setas laterais com estilo moderno */}
      <AnimatePresence>
        {showArrows && (
          <>
            <motion.button
              onClick={scrollLeft}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="arrow-btn arrow-left"
            >
              <ChevronLeft size={28} />
            </motion.button>

            <motion.button
              onClick={scrollRight}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="arrow-btn arrow-right"
            >
              <ChevronRight size={28} />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* 🔹 Slider principal */}
      <motion.div
        ref={sliderRef}
        className="categoria-slider overflow-x-auto flex gap-3 scroll-smooth no-scrollbar"
        whileTap={{ cursor: "grabbing" }}
      >
        {produtos.map((produto, index) => (
          <motion.div
            key={index}
            className="categoria-item bg-white shadow-md rounded-xl p-3 flex flex-col items-center justify-between min-w-[160px]"
            whileHover={{ scale: 1.05 }}
          >
            <div
              className="cursor-pointer"
              onClick={() => navigate("/lanches")}
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
