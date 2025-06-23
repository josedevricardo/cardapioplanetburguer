import React from "react";
import "./footer.css";
import Navbar from "../../components/navbar/navbar.jsx";
import Produto2Vitrine from "../../components/produto-vitrine/produto-vitrine-lanches.jsx";


function Produto2() {

  return (
    <>
      <Navbar showMenu={true} />

      <div className="container">
        <div className="titulo text-center">
          <h1>Lanches Mais Indicados</h1>
          <p className="subtitulo">
            Adicione seu pedido na sacola de comprar e ao finalizar será
            redirecionado seu pedido para whatsapp e só aguardar...
          </p>
        </div>
      </div>

   <Produto2Vitrine/>
      <footer className="footer text-center">
        <p>
          @Todos Direitos - Planet Burger 38-99801-7215 R. das Bromélias, 280 -
          Residencial Vitória 1
        </p>
      </footer>
    </>
  );
}

export default Produto2;
