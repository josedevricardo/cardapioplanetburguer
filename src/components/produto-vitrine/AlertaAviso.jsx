// src/components/AlertaAviso.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import "./alerta-aviso.css"; // importa o CSS externo

const AlertaAviso = ({
  tipo = "aviso",
  mensagem = "Atenção!",
  autoFechar = false,
  duracao = 5000,
}) => {
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    if (autoFechar) {
      const timer = setTimeout(() => setVisivel(false), duracao);
      return () => clearTimeout(timer);
    }
  }, [autoFechar, duracao]);

  return (
    <AnimatePresence>
      {visivel && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="alerta-aviso"
        >
          <AlertTriangle className="icone-alerta" />
          <span className="texto-alerta">{mensagem}</span>
          <button onClick={() => setVisivel(false)} className="fechar-alerta">
            <X className="icone-fechar" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertaAviso;
