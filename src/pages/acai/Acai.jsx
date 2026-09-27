import React, { useState, useContext } from "react";
import './footer.css'; 
import Navbar from "../../components/navbar/navbar.jsx";
import AcaiVitrine from "../../components/produto-vitrine/produto-vitrine-acai.jsx";
import { CartContext } from "../../contexts/cart-context";

const adicionais = [
  "PAÇOCA", "LEITE EM PÓ", "GRANOLA", "MOUSSE MORANGO", "MOUSSE MARACUJÁ", 
  "CALDA DE CHOCOLATE", "CALDA DE KIWI", "CALDA MORANGO", "NUTELLA", "CHOCOBALL", 
  "BIS", "CONFETE M&M", "CANUDO RECHEADO", "BANANA", "LEITE CONDENSADO", "OVOMALTINE", 
  "MORANGO", "KIWI", "ABACAXI", "CREME NINHO", "CREME BEIJINHO", "GOTAS CHOCOLATE"
];

const iconesAdicionais = {
  "PAÇOCA": "🥜",
  "LEITE EM PÓ": "🥛",
  "GRANOLA": "🌾",
  "MOUSSE MORANGO": "🍓",
  "MOUSSE MARACUJÁ": "🥭",
  "CALDA DE CHOCOLATE": "🍫",
  "CALDA DE KIWI": "🥝",
  "CALDA MORANGO": "🍓",
  "NUTELLA": "🍫",
  "CHOCOBALL": "🍬",
  "BIS": "🍪",
  "CONFETE M&M": "🍬",
  "CANUDO RECHEADO": "🥐",
  "BANANA": "🍌",
  "LEITE CONDENSADO": "🥛",
  "OVOMALTINE": "🍫",
  "MORANGO": "🍓",
  "KIWI": "🥝",
  "ABACAXI": "🍍",
  "CREME NINHO": "🍼",
  "CREME BEIJINHO": "🥥",
  "GOTAS CHOCOLATE": "🍫"
};

function AcaiPage() {
  const { addToCart } = useContext(CartContext);

  const [selectedAdicionais, setSelectedAdicionais] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  const handleSelectAdicional = (adicional) => {
    setSelectedAdicionais((prev) => {
      if (prev.includes(adicional)) {
        return prev.filter(item => item !== adicional);
      }
      if (prev.length < 4) {
        return [...prev, adicional];
      }
      return prev;
    });
  };

  const handleAdicionarAoCarrinho = () => {
    if (selectedAdicionais.length === 0) {
      alert("Selecione ao menos um adicional antes de adicionar ao carrinho.");
      return;
    }

    // Coloca os nomes dos adicionais direto no nome do item e define o preço como 0.00
    const itemAcai = {
      id: `acai-${Date.now()}`,
      nome: `Açaí + Adicionais: ${selectedAdicionais.join(", ")}`,
      preco: 0.00,
      adicionais: selectedAdicionais,
      qtd: 1,
    };

    addToCart(itemAcai);

    setMessage(`🟣 "Açaí + Adicionais" adicionado à sacola!`);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);

    setSelectedAdicionais([]);
  };

  return (
    <>
      <Navbar showMenu={true} />

      <div className="container">
        <div className="titulo text-center">
          <h1>Açai + 4 Adicionais!</h1>

          {/* GRID DOS ADICIONAIS */}
          <div className="adicionais-grid">
            {adicionais.map((item, index) => (
              <button
                key={index}
                className={`adicional-btn ${selectedAdicionais.includes(item) ? "selected" : ""}`}
                onClick={() => handleSelectAdicional(item)}
                disabled={selectedAdicionais.length >= 4 && !selectedAdicionais.includes(item)}
                data-icon={iconesAdicionais[item] || "⭐"}
              >
                {item}
              </button>
            ))}
          </div>

          <p>Selecionados: {selectedAdicionais.join(", ")}</p>

          <button 
            className="botao-sacola"
            onClick={handleAdicionarAoCarrinho}
            disabled={selectedAdicionais.length === 0}
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>

      <AcaiVitrine />

      <footer className="footer text-center">
        @Todos Direitos <br /> Delivery BURGUE+A  | 38-00000-0000 <br />
      </footer>

      {/* Mensagem flutuante */}
      {showMessage && (
        <div className="message-fixed">
          <span role="img" aria-label="ícone">🟣</span>{" "}
          <span className="message-texto">{message.replace("🟣", "").trim()}</span>
        </div>
      )}
    </>
  );
}

export default AcaiPage;