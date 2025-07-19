import React, { useEffect, useState, useContext } from "react";
import "./produto2-vitrine.css";
import bag from "../../assets/bag-black.png";
import { CartContext } from "../../contexts/cart-context";
import { ProdutoContext } from "../../contexts/categoria-context";

function Produto2Vitrine(props) {
  const { categorias } = useContext(ProdutoContext); // Contexto de categorias, se necessário no futuro
  const { addToCart } = useContext(CartContext);

  const [showMessage, setShowMessage] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const AddItem = () => {
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
  };

  // Evita renderizar caso dados obrigatórios estejam ausentes
  if (!props || !props.nome || !props.preco) return null;

  return (
    <div className="produto-box text-center">
      <img src={props.foto} alt={props.nome} />
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
        <button type="button" onClick={AddItem} className="btn btn-cart">
          <img src={bag} className="icon" alt="sacola" />
          Comprar
        </button>
        {showMessage && (
          <div className="message-hover-slider">Adicionado à sacola</div>
        )}
      </div>

      {showBackToTop && (
        <button onClick={scrollToTop} className="btn-voltar-topo">
          ↑ Voltar ao topo
        </button>
      )}
    </div>
  );
}

export default Produto2Vitrine;
