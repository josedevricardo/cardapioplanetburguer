import "./produto-cart.css";
import { CartContext } from "../../contexts/cart-context";
import { useContext } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

function ProdutoCart(props) {
  const { addToCart, RemoveItemCart } = useContext(CartContext);

  // Ao adicionar, mantém os adicionais passados no item
  function AddItem() {
    const item = {
      id: props.id,
      nome: props.nome,
      preco: props.preco,
      foto: props.foto,
      qtd: 1,
      adicionais: props.adicionais || [],  // mantém os adicionais aqui
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
      <img
        src={props.foto}
        alt={`Foto do produto ${props.nome}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/img/default.png"; // fallback se imagem falhar
        }}
      />

      <div>
        <p className="produto-cart-nome">{props.nome}</p>

        {/* Exibir adicionais, se houver */}
        {props.adicionais && props.adicionais.length > 0 && (
          <p className="produto-cart-adicionais">
            Adicionais: {props.adicionais.map((a) => a.nome).join(", ")}
          </p>
        )}

        <p className="produto-cart-valor">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(props.preco)}
        </p>

        <div className="footer-produto-cart">
          <div>
            <button onClick={RemoveItem} className="footer-produto-btn" aria-label="Remover item">
              -
            </button>
            <span className="footer-produto-qtd">{props.qtd}</span>
            <button onClick={AddItem} className="footer-produto-btn" aria-label="Adicionar item">
              +
            </button>
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

// Validação de propriedades esperadas, adicionando adicionais (array)
ProdutoCart.propTypes = {
  id: PropTypes.string.isRequired,
  nome: PropTypes.string.isRequired,
  preco: PropTypes.number.isRequired,
  foto: PropTypes.string.isRequired,
  qtd: PropTypes.number.isRequired,
  adicionais: PropTypes.array,  // array de objetos {id, nome}
};

export default ProdutoCart;
