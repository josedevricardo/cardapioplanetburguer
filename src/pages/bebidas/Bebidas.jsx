import React from "react";
import './footer.css';
import Navbar from "../../components/navbar/navbar.jsx";
import BebidasVitrine from "../../components/produto-vitrine/produto-vitrine-bebidas.jsx";


function Bebidas() {
  
  return (
    <>
      <Navbar showMenu={true} />


    <BebidasVitrine/>

      <footer className="footer text-center">
        <p>@Todos Direitos - Planet Burger 38-99801-7215   R. das Bromélias, 280 - Residencial Vitória 1</p>
      </footer>
    </>
  );
}

export default Bebidas;
