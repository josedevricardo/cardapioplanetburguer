import React from "react";
import './footer.css';
import Navbar from "../../components/navbar/navbar.jsx";
import AcrescimoVitrine from "../../components/produto-vitrine/produto-vitrine-acresimo.jsx";


function Acrescimo() {
  return (
    <>
      <Navbar showMenu={true} />

      <div className="container">
        <div className="titulo text-center">
          <h1>Faça seu pedido ao gosto!</h1>
          <p className="subtitulo">
            Adicione seu pedido na sacola de compras e, ao finalizar,
            seu pedido será redirecionado para o WhatsApp. Só aguardar!
          </p>
        </div>
      </div>

     <AcrescimoVitrine/>

      <footer className="footer text-center">
        <p>
          © Todos os direitos reservados - Planet Burger | (38) 99801-7215<br />
          R. das Bromélias, 280 - Residencial Vitória 1
        </p>
      </footer>
    </>
  );
}

export default Acrescimo;
