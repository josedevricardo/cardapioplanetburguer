import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../../assets/mascote.png";
import Navbar from "../../components/navbar/navbar.jsx";
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton.js";
import CategoriaSlider from "../../components/CategoriaSlider/CategoriaSlider.jsx";
import "./home.css";
import ProdutoSlider from "../../components/produto-slider/produto-slider.js"; 

function Home() {
  const [busca, setBusca] = useState("");

  // Recebe a busca enviada globalmente
  useEffect(() => {
    const handler = (e) => setBusca(e.detail);
    window.addEventListener("buscaAtualizada", handler);
    return () => window.removeEventListener("buscaAtualizada", handler);
  }, []);

  return (
    <>
      <Navbar />

      <main className="home-main bg-white" style={{ paddingTop: "60px" }}>
        <div className="max-w-6xl mx-auto">
          
          {/* HERO */}
          <div className="hero-centralizado">
            <div>
              <Link to="/">
                <img src={logo} alt="Planets Burguer Logo" className="logotipo2" />
              </Link>
            </div>

            <div className="logo-container">
              <span className="logo-text glow-text">
                Planet’s <strong>Burguer</strong>
              </span>
            </div>

            <div className="logo-container text-center">
              <span className="logo-text2">O sabor de outro planeta te espera!</span>

              <div className="avaliacao-container">
                <div className="estrelas">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>☆</span>
                  <span className="nota-texto">(4,5/5)</span>
                </div>

                <a
                  href="https://maps.app.goo.gl/rVyvhC7mdDsc35ak9?g_st=aw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="avaliar-link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12.293 9.293a1 1 0 011.414 0L17 12.586V5a1 1 0 112 0v10a1 1 0 01-1 1h-10a1 1 0 110-2h7.586l-3.293-3.293a1 1 0 010-1.414z" />
                  </svg>
                  Avalie no Google
                </a>
              </div>
            </div>
          </div>

          {/* CATEGORIAS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-center text-zinc-800 mb-3">
              Já Fez seu pedido hoje? 😄 🍔
            </h3>

            <CategoriaSlider />
          </motion.div>

          {/* PRODUTOS — sempre exibidos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <ProdutoSlider busca={busca} />
          </motion.div>
        </div>
      </main>

      <ScrollToTopButton />

      <footer className="footer text-center">
        <p>
          <a className="direitos" href="https://portfoliojosericardo.netlify.app/" target="_blank" rel="noopener noreferrer">
            @Desenvolvedor Ricardo
          </a>
          <strong> Planet´s Burguer</strong> R. das Bromélias, 280 Residencial Vitória
        </p>
      </footer>
    </>
  );
}

export default Home;
