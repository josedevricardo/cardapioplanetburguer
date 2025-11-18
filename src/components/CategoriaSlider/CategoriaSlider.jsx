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

  // 🔹 Fetch de produtos em todas categorias
  useEffect(() => {
    const categoriasRef = ref(db, "categorias");
    const unsubscribe = onValue(categoriasRef, (snapshot) => {
      const data = snapshot.val() || {};
      const todosProdutos = Object.entries(data).flatMap(([cat, val]) =>
        Object.values(val.produtos || {}).map((prod) => ({
          ...prod,
          categoria: cat,
        }))
      );
      // opcional: filtrar apenas produtos ativos
      setProdutos(todosProdutos.filter((p) => p.ativo !== false));
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Auto scroll do slider
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
const normalizarRota = (nome) => {
  if (!nome) return "";

  return nome
    .normalize("NFD")               // remove acentos
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/\s+/g, "-")           // espaços viram hífen
    .replace(/[^a-zA-Z0-9-]/g, "")  // remove qualquer caractere estranho
    .toLowerCase();
};

  return (
    <div
      className="categoria-slider-container relative bg-white text-gray-800"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
      onTouchStart={() => setShowArrows(true)}
      onTouchEnd={() => setTimeout(() => setShowArrows(false), 2000)}
    >
      {/* ✅ Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       bg-green-500 text-white px-6 py-3 rounded-xl shadow-xl z-50
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

      {/* 🔹 Setas laterais */}
      <AnimatePresence>
        {showArrows && (
          <>
            <motion.button
              onClick={scrollLeft}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="arrow-btn arrow-left bg-white shadow-lg text-gray-800 hover:bg-gray-100"
            >
              <ChevronLeft size={28} />
            </motion.button>

            <motion.button
              onClick={scrollRight}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="arrow-btn arrow-right bg-white shadow-lg text-gray-800 hover:bg-gray-100"
            >
              <ChevronRight size={28} />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* 🔹 Slider principal */}
      <motion.div
        ref={sliderRef}
        className="categoria-slider overflow-x-auto flex gap-3 scroll-smooth no-scrollbar bg-white"
        whileTap={{ cursor: "grabbing" }}
      >
        {produtos.map((produto, index) => (
          <motion.div
            key={index}
            className="categoria-item bg-white shadow-md rounded-xl p-3 flex flex-col items-center justify-between min-w-[160px] border border-gray-200"
            whileHover={{ scale: 1.05 }}
          >
            {/* onclick de direcionmanto de pagina no slider */}
            <div
              className="cursor-pointer"
             onClick={() => {
  const rota = normalizarRota(produto.categoria);

  const rotasValidas = [
    "lanches",
    "bebidas",
    "sucos",
    "omeletes",
    "acrescimo"
  ];

  if (rotasValidas.includes(rota)) {
    navigate(`/${rota}`);
  } else {
    console.warn("Categoria sem rota correspondente:", produto.categoria);
    navigate("/"); // segurança — evita página 404
  }
}}


            >
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="categoria-img rounded-lg"
              />
              <span className="block mt-2 font-semibold text-sm text-gray-800">
                {produto.nome}
              </span>
            </div>

            <span className="text-red-600 font-bold mt-1">
              R$ {parseFloat(produto.preco).toFixed(2).replace(".", ",")}
            </span>

            <button
              className="btn-adicionar bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg mt-2 transition"
              onClick={() => handleAdd(produto, index)}
            >
              <span className="emoji">🍔</span>{" "}
              {clicked === index ? "Adicionado!" : "Adicionar"}
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProdutoSliderHorizontal;
