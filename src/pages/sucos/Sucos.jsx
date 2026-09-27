import React from "react";
import './footer.css';
import Navbar from "../../components/navbar/navbar.jsx";
import SucosVitrineComponent from "../../components/produto-vitrine/produto-vitrine-sucos.jsx";

function PaginaSucos() {
  return (
    <>
      <Navbar showMenu={true} />

  
      <SucosVitrineComponent />

      <footer className="footer text-center">
        <p>
          @Todos Direitos - Delivery BURGUE+A 38-00000-0000 
        </p>
      </footer>
    </>
  );
}

export default PaginaSucos;
