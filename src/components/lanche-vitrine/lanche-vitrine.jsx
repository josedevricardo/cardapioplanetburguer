import React, { useEffect, useState } from "react";
import "./lanche-vitrine.css";
import bag from "../../assets/bag-black.png";
import { CartContext } from "../../contexts/cart-context";
import { useContext } from "react";
import { ProdutoContext } from "../../contexts/categoria-context";


function LancheVitrine(props) {
  const { categorias } = useContext(ProdutoContext); // usa dados do contexto atualizado via Firebase
  const { addToCart } = useContext(CartContext);
  
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showMessage, setShowMessage] = useState(false); // Estado para controlar a exibição da mensagem

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
    setShowMessage(true); // Exibir mensagem ao clicar no botão
  }

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
          onClick={AddItem}
          className="btn btn-cart"

        >
          <img src={bag} className="icon" alt="bag" />
          Comprar
        </button>
        {showMessage && <div className="message-hover-slider4 ">Adicionado à sacola</div>} {/* Exibir a mensagem quando showMessage for true */}
      </div>
    </div>
  );


export default LancheVitrine;
