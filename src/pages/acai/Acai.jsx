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
      alert("Selecione ao menos um adicional antes de enviar para o WhatsApp.");
      return;
    }
    const numeroWhatsApp = "38998017215";
    const mensagem = `Olá, gostaria de um Açaí com os seguintes adicionais: ${selectedAdicionais.join(", ")}`;
    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
    window.location.href = url;
  };

  return (
    <>
      <Navbar showMenu={true} />

      <div className="container">
        <div className="titulo text-center">
          <h1>Açai + 4 Adicionais!</h1>

          <div className="botao-sacola" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "10px",
            justifyContent: "center",
            padding: "20px"
          }}>
            {adicionais.map((item, index) => (
              <button 
                key={index} 
                className={`adicional-btn ${selectedAdicionais.includes(item) ? 'selected' : ''}`} 
                onClick={() => handleSelectAdicional(item)}
                disabled={selectedAdicionais.length >= 4 && !selectedAdicionais.includes(item)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  textAlign: "center",
                  
                }}
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

      {/* ✅ Exibir vitrine apenas uma vez */}
      <AcaiVitrine />

      <footer className="footer text-center">
        <p>@Todos Direitos - Planet Burger 38-99801-7215   R. das Bromélias, 280 - Residencial Vitória 1</p>
      </footer>
    </>
  );
}

export default AcaiPage;
