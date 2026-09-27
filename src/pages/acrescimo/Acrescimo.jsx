import React from "react";
import './footer.css';
import Navbar from "../../components/navbar/navbar.jsx";
import AcrescimoVitrine from "../../components/produto-vitrine/produto-vitrine-acresimo.jsx";


function Acrescimo() {
  return (
    <>
      <Navbar showMenu={true} />

  
     <AcrescimoVitrine/>

      <footer className="footer text-center">
        <p>
          @Todos Direitos <br /> Delivery BURGUE+A  | 38-00000-0000 <br />
          
        </p>
      </footer>
    </>
  );
}

export default Acrescimo;
