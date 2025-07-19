import React, { useEffect, useState, useContext } from "react";
import "./lanche-vitrine.css";
import bag from "../../assets/bag-black.png";
import { CartContext } from "../../contexts/cart-context";
import { ProdutoContext } from "../../contexts/categoria-context";

function LancheVitrine(props) {
  const { categorias } = useContext(ProdutoContext); // dados do contexto Firebase
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

  function AddItem() {
    const item = {
      id: props.id,
      nome: props.nome,
      preco: props.preco,
      foto: props.foto,
      qtd: 1,
    };

    addToCart(item);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  }

  if (!props || !props.nome || !props.preco) return null;

  return (
    <div className="produto-box text-center">
      <img src={props.foto} alt={`Foto de ${props.nome}`} />
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
          onClick={AddItem}
          className="btn btn-cart"
        >
          <img src={bag} className="icon" alt="Ícone sacola" />
          Comprar
        </button>
        {showMessage && (
          <div className="message-hover-slider4">Adicionado à sacola</div>
        )}
      </div>

      {showBackToTop && (
        <button className="back-to-top" onClick={scrollToTop}>
          Voltar ao Topo
        </button>
      )}
    </div>
  );
}

export default LancheVitrine;
