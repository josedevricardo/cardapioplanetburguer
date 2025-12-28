import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./CategoriaSlider.css";
import { useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseConfig";
import { CartContext } from "../../contexts/cart-context";

const ProdutoSliderHorizontal = () => {
  const [produtos, setProdutos] = useState([]);
  const [clicked, setClicked] = useState(null);
  const [toast, setToast] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sliderRef = useRef(null);
  const isUserInteracting = useRef(false);

  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  /* ===============================
     🔹 FIREBASE (tempo real)
  =============================== */
  useEffect(() => {
    const categoriasRef = ref(db, "categorias");

    return onValue(categoriasRef, (snapshot) => {
      const data = snapshot.val() || {};

      const lista = Object.entries(data).flatMap(
        ([categoria, val]) =>
          Object.entries(val.produtos || {}).map(([id, prod]) => ({
            id,
            ...prod,
            categoria,
          }))
      );

      setProdutos(lista.filter((p) => p.ativo !== false));
    });
  }, []);

  /* ===============================
     🔹 CONTROLE FADE (INÍCIO / FIM)
  =============================== */
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const checkEdges = () => {
      const { scrollLeft, scrollWidth, clientWidth } = slider;

      setAtStart(scrollLeft <= 2);
      setAtEnd(scrollLeft + clientWidth >= scrollWidth - 2);
    };

    checkEdges();
    slider.addEventListener("scroll", checkEdges);

    return () => slider.removeEventListener("scroll", checkEdges);
  }, [produtos]);

  /* ===============================
     🔹 AUTO SCROLL
  =============================== */
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const interval = setInterval(() => {
      if (!isUserInteracting.current) {
        const max = slider.scrollWidth - slider.clientWidth;
        slider.scrollLeft >= max - 2
          ? slider.scrollTo({ left: 0 })
          : slider.scrollBy({ left: 1 });
      }
    }, 20);

    const pause = () => {
      isUserInteracting.current = true;
      setTimeout(() => {
        isUserInteracting.current = false;
      }, 2000);
    };

    slider.addEventListener("mousedown", pause);
    slider.addEventListener("wheel", pause);
    slider.addEventListener("touchstart", pause);

    return () => {
      clearInterval(interval);
      slider.removeEventListener("mousedown", pause);
      slider.removeEventListener("wheel", pause);
      slider.removeEventListener("touchstart", pause);
    };
  }, []);

  /* ===============================
     🔹 SCROLL MANUAL
  =============================== */
  const scrollLeft = () => {
    isUserInteracting.current = true;
    sliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    isUserInteracting.current = true;
    sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
  };

  /* ===============================
     🔐 ADD AO CARRINHO
  =============================== */
  const handleAdd = (produto, index) => {
    if (
      produto.preco === undefined ||
      produto.preco === null ||
      isNaN(Number(produto.preco))
    ) {
      setToast("Produto indisponível");
      return;
    }

    setLoadingId(produto.id);

    addToCart({
      ...produto,
      preco: Number(produto.preco),
    });

    setClicked(index);
    setToast(`🛒 ${produto.nome} adicionado!`);

    setTimeout(() => {
      setClicked(null);
      setToast(null);
      setLoadingId(null);
    }, 1400);
  };

  const normalizarRota = (nome = "") =>
    nome
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .toLowerCase();

  const produtosMemo = useMemo(() => produtos, [produtos]);

  return (
    <div className="categoria-slider-container relative">

      {/* FADE ESQUERDO */}
      {!atStart && (
        <div
          className="pointer-events-none hidden md:block
                     absolute left-0 top-0 h-full w-12 z-10"
          style={{
            background: "linear-gradient(to right, #fff, transparent)",
          }}
        />
      )}

      {/* FADE DIREITO */}
      {!atEnd && (
        <div
          className="pointer-events-none hidden md:block
                     absolute right-0 top-0 h-full w-12 z-10"
          style={{
            background: "linear-gradient(to left, #fff, transparent)",
          }}
        />
      )}

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       bg-green-500 text-white px-6 py-3 rounded-xl shadow-xl z-50
                       font-bold text-sm"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SETAS */}
      {!atStart && (
        <button onClick={scrollLeft} className="arrow-btn arrow-left">
          <ChevronLeft size={20} />
        </button>
      )}

      {!atEnd && (
        <button onClick={scrollRight} className="arrow-btn arrow-right">
          <ChevronRight size={20} />
        </button>
      )}

      {/* SLIDER */}
      <div ref={sliderRef} className="categoria-slider">
        {produtosMemo.map((produto, index) => {
          const precoValido =
            produto.preco !== undefined &&
            produto.preco !== null &&
            !isNaN(Number(produto.preco));

          return (
            <div key={produto.id} className="categoria-item">
              <div
                onClick={() =>
                  precoValido &&
                  navigate(`/${normalizarRota(produto.categoria)}`)
                }
                style={{ cursor: precoValido ? "pointer" : "not-allowed" }}
              >
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="categoria-img"
                />

                <div style={{ lineHeight: "1.1" }}>
                  <span>{produto.nome}</span>

                  {precoValido && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        marginTop: "4px",
                        color: "#10b981",
                      }}
                    >
                      R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
                    </div>
                  )}
                </div>
              </div>

              <button
                className="btn-adicionar"
                disabled={!precoValido || loadingId === produto.id}
                onClick={() => handleAdd(produto, index)}
              >
                🛒 {clicked === index ? "Adicionando..." : "Adicionar"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProdutoSliderHorizontal;
