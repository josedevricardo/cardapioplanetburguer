import React, { useState } from "react";
import './footer.css'; 
import Navbar from "../../components/navbar/navbar.jsx";
import AcaiVitrine from "../../components/produto-vitrine/produto-vitrine-acai.jsx";

const adicionais = [
  "PAÇOCA", "LEITE EM PÓ", "GRANOLA", "MOUSSE MORANGO", "MOUSSE MARACUJÁ", 
  "CALDA DE CHOCOLATE", "CALDA DE KIWI", "CALDA MORANGO", "NUTELLA", "CHOCOBALL", 
  "BIS", "CONFETE M&M", "CANUDO RECHEADO", "BANANA", "LEITE CONDENSADO", "OVOMALTINE", 
  "MORANGO", "KIWI", "ABACAXI", "CREME NINHO", "CREME BEIJINHO", "GOTAS CHOCOLATE"
];

// Ícones automáticos
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
  const [selectedAdicionais, setSelectedAdicionais] = useState([]);

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

  const handleEnviarWhatsApp = () => {
    if (selectedAdicionais.length === 0) {
      alert("Selecione ao menos um adicional antes de enviar.");
      return;
    }

    const numeroWhatsApp = "38998017215";
    const mensagem = `Olá! Vou querer Açaí com: ${selectedAdicionais.join(", ")}`;
    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
    window.location.href = url;
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
            onClick={handleEnviarWhatsApp}
            disabled={selectedAdicionais.length === 0}
          >
            Enviar para WhatsApp
          </button>
        </div>
      </div>

      <AcaiVitrine />

      <footer className="footer text-center">
        <p>@Todos Direitos - Planet Burger 38-99801-7215 - R. das Bromélias, 280</p>
      </footer>
    </>
  );
}

export default AcaiPage;
