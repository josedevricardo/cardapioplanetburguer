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

  const inicioFuncionamento = hora > 0 || (hora === 0 && minuto >= 31);
  const fimFuncionamento = hora < 23 || (hora === 23 && minuto <= 59);
  const pedidosDisponiveis = inicioFuncionamento && fimFuncionamento;

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
        style={{ paddingTop: "80px" }}
      >
        <div
          className="w-full flex flex-col items-center justify-center px-4"
          style={{ paddingTop: "30px" }}
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold text-center text-green-600 dark:text-green-400 tracking-widest glow-text break-words max-w-full"
            style={{ display: "block" }}
          >
            Planet&apos;s Burguer
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center text-zinc-600 dark:text-zinc-300 text-sm md:text-lg mt-2"
            style={{ display: "block" }}
          >
            O sabor de outro planeta te espera!
          </motion.p>
        </div>

        {/* SearchBar centralizado e menor */}
        <div className="flex justify-center mt-6 px-4">
          <div className="w-full max-w-md">
            <SearchBar busca={busca} setBusca={setBusca} />
          </div>
        </div>

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
              Pedidos disponíveis das 00:31 às 23:59.
            </h2>
            <p className="text-sm mt-2">
              Voltamos em breve! Agora são {formatarHora(horaAtual)}.
            </p>
          </motion.div>
        )}
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
          <strong> Planet´s Burguer</strong> R. das Bromélias, 280 Residencial Vitória
        </p>
      </footer>

      <style>{`
        .glow-text {
          text-shadow:
            0 0 8px rgba(46, 204, 113, 0.7),
            0 0 15px rgba(46, 204, 113, 0.5),
            0 0 20px rgba(46, 204, 113, 0.4);
        }
        .dark .glow-text {
          text-shadow:
            0 0 10px rgba(102, 255, 179, 0.9),
            0 0 20px rgba(102, 255, 179, 0.7),
            0 0 30px rgba(102, 255, 179, 0.5);
        }
      `}</style>
    </>
  );
}

export default Home;
