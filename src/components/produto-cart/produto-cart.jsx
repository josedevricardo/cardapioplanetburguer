import "./produto-cart.css";
import { CartContext } from "../../contexts/cart-context";
import { useContext } from "react";
import { motion } from "framer-motion";

function ProdutoCart(props) {
  const { addToCart, RemoveItemCart } = useContext(CartContext);

  function AddItem() {
    const item = {
      id: props.id,
      nome: props.nome,
      preco: props.preco,
      foto: props.foto,
      qtd: 1,
    };
    addToCart(item);
  }

  function RemoveItem() {
    RemoveItemCart(props.id);
  }

  return (
    <motion.div
      className="produto-cart-box"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <img src={props.foto} alt="Foto" />

      <div>
        <p className="produto-cart-nome">{props.nome}</p>
        <p className="produto-cart-valor">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(props.preco)}
        </p>

        <div className="footer-produto-cart">
          <div>
            <button onClick={RemoveItem} className="footer-produto-btn">-</button>
            <span className="footer-produto-qtd">{props.qtd}</span>
            <button onClick={AddItem} className="footer-produto-btn">+</button>
          </div>
          <p className="footer-produto-preco text-right">
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

export default ProdutoCart;
