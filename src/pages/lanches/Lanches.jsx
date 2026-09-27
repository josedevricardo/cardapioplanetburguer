import React from "react";
import "./footer.css";
import Navbar from "../../components/navbar/navbar.jsx";
import LancheVitrine from "../../components/produto-vitrine/produto-vitrine-lanches.jsx";

function Lanches() {
  return (
    <>
      <Navbar showMenu={true} />

    

      <LancheVitrine/>

      <footer className="footer text-center">
        <p>
          @Todos Direitos - Delivery BURGUE+A 38-00000-0000
        </p>
      </footer>
    </>
  );
}

export default Lanches;
