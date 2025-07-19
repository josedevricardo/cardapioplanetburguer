import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/navbar/navbar";
import ProdutoSlider from "../../components/produto-slider/produto-slider";
import SearchBar from "../../components/SearchBar/SearchBar";
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";

import "../home/home.css";

function Home() {
  const [busca, setBusca] = useState("");
  const [horaAtual, setHoraAtual] = useState(new Date());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHoraAtual(new Date());
    }, 60000);
    return () => clearInterval(intervalo);
  }, []);

  const hora = horaAtual.getHours();
  const minuto = horaAtual.getMinutes();

  const horarioAtualEmMinutos = hora * 60 + minuto;
  const inicioEmMinutos = 18 * 60;
  const fimEmMinutos = 23 * 60 + 59;

  const pedidosDisponiveis =
    horarioAtualEmMinutos >= inicioEmMinutos &&
    horarioAtualEmMinutos <= fimEmMinutos;

  const formatarHora = (date) => {
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  return (
    <>
      <Navbar />

      <main
        className="min-h-screen px-4 md:px-10 pb-20 bg-white dark:bg-zinc-900"
        style={{ paddingTop: "60px" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="hero-centralizado">
            <div className="logo-container">
              <span className="logo-text">
                Planet’s <strong>Burguer</strong>
              </span>
            </div>

            <div className="logo-container text-center">
              <span className="logo-text2">
                O sabor de outro planeta te espera!
              </span>

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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M12.293 9.293a1 1 0 011.414 0L17 12.586V5a1 1 0 112 0v10a1 1 0 01-1 1h-10a1 1 0 110-2h7.586l-3.293-3.293a1 1 0 010-1.414z" />
                  </svg>
                  Avalie no Google
                </a>
              </div>
            </div>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:block mt-10">
            <div className="buscar-desktop-container">
              <SearchBar busca={busca} setBusca={setBusca} />
            </div>
          </div>

          {/* PRODUTOS */}
          {pedidosDisponiveis ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <ProdutoSlider busca={busca} />
            </motion.div>
          ) : (
            <motion.div
              className="text-center text-zinc-700 dark:text-zinc-300 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="footer text-center">
                Pedidos disponíveis das 18:00 às 23:59.
              </h2>
              <p className="text-sm mt-2">
                Voltamos em breve! Agora são ⏰ {formatarHora(horaAtual)}.
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <ScrollToTopButton />

      <footer className="footer text-center">
        <p>
          <a
            className="direitos"
            href="https://portfoliojosericardo.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            @Desenvolvidor Ricardo
          </a>
          <strong> Planet´s Burguer</strong> R. das Bromélias, 280 Residencial
          Vitória
        </p>
      </footer>
    </>
  );
}

export default Home;
