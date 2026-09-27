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
        @Todos Direitos <br /> Delivery BURGUE+A  | 38-00000-0000 <br />
      </footer>
    </>
  );
}

export default Bebidas;
