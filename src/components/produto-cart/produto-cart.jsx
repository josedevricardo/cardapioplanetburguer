// src/components/produto-cart/produto-cart.jsx
import "./produto-cart.css";
import { CartContext } from "../../contexts/cart-context";
import { useContext } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

function ProdutoCart(props) {
  const { addToCart, removeFromCart } = useContext(CartContext);

  function AddItem() {
    addToCart({
      id: props.id,
      nome: props.nome,
      preco: props.preco,
      foto: props.foto,
      qtd: 1,
      adicionais: props.adicionais || [],
    });
  }

  function RemoveItem() {
    removeFromCart(props.id);
  }

  return (
    <motion.div
      className="produto-cart-box"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <img
        src={props.foto}
        alt={props.nome}
        className="img-produto"
        onError={(e) => {
          e.target.src = "/img/default.png";
        }}
      />

      <div className="detalhes-produto">
        <p className="produto-cart-nome">{props.nome}</p>

        {props.adicionais?.length > 0 && (
          <p className="produto-cart-adicionais">
            {props.adicionais.map((a) => a.nome).join(", ")}
          </p>
        )}

        <p className="produto-cart-valor-unitario">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(props.preco)}
        </p>

        <div className="footer-produto-cart">
          <div className="controles-quantidade">
            <button className="btn-menos" onClick={RemoveItem}>−</button>
            <span className="qtd-display">{props.qtd}</span>
            <button className="btn-mais" onClick={AddItem}>+</button>
          </div>

          <p className="subtotal-item">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(props.preco * props.qtd)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

ProdutoCart.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  nome: PropTypes.string.isRequired,
  preco: PropTypes.number.isRequired,
  foto: PropTypes.string,
  qtd: PropTypes.number,
  adicionais: PropTypes.array,
};

export default ProdutoCart;