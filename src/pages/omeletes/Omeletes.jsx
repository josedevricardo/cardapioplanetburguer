import React from "react";
import './footer.css';
import Navbar from "../../components/navbar/navbar.jsx";
import OmeletesVitrine from "../../components/produto-vitrine/produto-vitrine-omeletes.jsx";

function Omeletes() {
  

  return (
    <>
      <Navbar showMenu={true} />


   <OmeletesVitrine/>

      <footer className="footer text-center">
        <p>@Todos Direitos - Delivery BURGUE+A 38-00000-0000</p>
      </footer>
    </>
  );
}

export default Omeletes;
