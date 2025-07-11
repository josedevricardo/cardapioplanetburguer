import React, { useEffect, useState } from "react";
import "./acai-vitrine.css";
import bag from "../../assets/bag-black.png";
import { CartContext } from "../../contexts/cart-context";
import { useContext } from "react";
import { ProdutoContext } from "../../contexts/categoria-context";

function AcaiVitrine(props) {
  const { categorias } = useContext(ProdutoContext); // usa dados do contexto atualizado via Firebase
  const { addToCart } = useContext(CartContext);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Função vazia removida
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function AddItem() {
    const item = {
      id: props.id,
      nome: props.nome,
      preco: props.preco,
      foto: props.foto,
      qtd: 1,
    };
    addToCart(item);
    setShowMessage(true); // Exibir mensagem ao clicar no botão
  }

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
        <button type="button" onClick={AddItem} className="btn btn-cart">
          <img src={bag} className="icon" alt="bag" />
          Comprar
        </button>
        {showMessage && (
          <div className="message-hover-slider10">Adicionado à sacola</div>
        )}
      </div>
    </div>
  );
}

export default AcaiVitrine;
