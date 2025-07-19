import React, { useEffect, useState, useContext } from "react";
import "./acai-vitrine.css";
import bag from "../../assets/bag-black.png";
import { CartContext } from "../../contexts/cart-context";
import { ProdutoContext } from "../../contexts/categoria-context";

function AcaiVitrine({ id, nome, preco, foto, descricao }) {
  const { categorias } = useContext(ProdutoContext); // se necessário em outras partes
  const { addToCart } = useContext(CartContext);
  const [showMessage, setShowMessage] = useState(false);

  // Removeu listener de scroll inútil (manutenção futura)
  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(false), 2000);
    return () => clearTimeout(timer);
  }, [showMessage]);

  function handleAddItem() {
    const item = {
      id,
      nome,
      preco,
      foto,
      qtd: 1,
    };
    addToCart(item);
    setShowMessage(true);
  }

  return (
    <div className="produto-box text-center">
      <img
        src={foto}
        alt={`Foto de ${nome}`}
        loading="lazy"
        width={180}
        height={180}
      />
      <div>
        <h2>{nome}</h2>
        <p className="prod-vitrine-descricao-props">{descricao}</p>
        <p className="prod-vitrine-preco">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(preco)}
        </p>
      </div>

      <div>
        <button type="button" onClick={handleAddItem} className="btn btn-cart">
          <img src={bag} className="icon" alt="Ícone de sacola" />
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
