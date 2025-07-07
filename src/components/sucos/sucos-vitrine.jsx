// src/components/SucosVitrine.jsx
import React, { useEffect, useState, useContext } from "react";
import "./sucos-vitrine.css";
import bag from "../../assets/bag-black.png";
import { CartContext } from "../../contexts/cart-context"; // corrigido
import { ProdutoContext } from "../../contexts/categoria-context";

function SucosVitrine(props) {
  const { categorias } = useContext(ProdutoContext); // dados do contexto
  const { addToCart } = useContext(CartContext);

  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.pageYOffset > 100) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function addItem() {
    const item = {
      id: props.id,
      nome: props.nome,
      preco: props.preco,
      foto: props.foto,
      qtd: 1,
    };

    addToCart(item);
    setShowMessage(true);

    // Oculta a mensagem após 2 segundos
    setTimeout(() => setShowMessage(false), 2000);
  }

  // Verificação opcional para segurança
  if (!props || !props.nome || !props.preco) return null;

  return (
    <div className="produto-box text-center">
      <img src={props.foto} alt="foto" />
      <div>
        <h2>{props.nome}</h2>
        <p className="prod-vitrine-descricao-props">{props.descricao}</p>
        <p className="prod-vitrine-preco">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(props.preco)}
        </p>
      </div>

      <div>
        <button
          type="button"
          onClick={addItem}
          className="btn btn-cart"
        >
          <img src={bag} className="icon" alt="bag" />
          Comprar
        </button>

        {showMessage && (
          <div className="message-hover-slider6">Adicionado à sacola</div>
        )}
      </div>
    </div>
  );
}

export default SucosVitrine;
