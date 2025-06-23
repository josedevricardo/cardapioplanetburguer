import React from "react";
import './footer.css';
import Navbar from "../../components/navbar/navbar.jsx";
import OmeletesVitrine from "../../components/produto-vitrine/produto-vitrine-omeletes.jsx";

function Omeletes() {
  

  return (
    <>
      <Navbar showMenu={true} />


      <div className="container">
        <div className="titulo text-center">
          <h1>Omeletes Saborosos</h1>
          <p className="subtitulo">
            Adicione seu pedido na sacola de comprar e ao finalizar será
            redirecionado seu pedido para whatsapp e só aguardar...
          </p>
          
        </div>
      </div>

   <OmeletesVitrine/>

      <footer className="footer text-center">
        <p>@Todos Direitos - Planet Burger 38-99801-7215   R. das Bromélias, 280 - Residencial Vitória 1</p>
      </footer>
    </>
  );
}

export default Omeletes;
