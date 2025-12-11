import React, { useEffect, useState, useContext } from "react";
import "./produto2-vitrine.css";
import bag from "../../assets/bag-black.png";
import { CartContext } from "../../contexts/cart-context";
import "./produto-vitrine.css";
function Produto2Vitrine(props) {
  const { addToCart } = useContext(CartContext);

  const [showMessage, setShowMessage] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Produto inativo? Não renderiza.
  if (props?.ativo === false) return null;

  // Informação essencial ausente? Não renderiza.
  if (!props?.nome || props?.preco == null) return null;

  // Fallback caso a imagem não exista
  const fotoFinal =
    props.foto && props.foto.length > 5
      ? props.foto
      : "https://via.placeholder.com/300x200?text=Sem+Imagem";

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
      foto: fotoFinal,
      qtd: 1,
    };

    addToCart(item);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  return (
    <div className="produto-box text-center">
      <img src={fotoFinal} alt={props.nome} />

      <div>
        <h2>{props.nome}</h2>

        {props.descricao ? (
          <p className="prod-vitrine-descricao-props">{props.descricao}</p>
        ) : null}

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
