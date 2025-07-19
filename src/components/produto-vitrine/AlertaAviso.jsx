// src/components/AlertaAviso.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  X,
} from "lucide-react";
import "./alerta-aviso.css";

const AlertaAviso = ({
  tipo = "aviso", // aviso, sucesso, erro, info
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

  const IconeTipo = {
    aviso: AlertTriangle,
    sucesso: CheckCircle,
    erro: XCircle,
    info: Info,
  }[tipo] || AlertTriangle;

  return (
    <AnimatePresence>
      {visivel && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`alerta-aviso ${tipo}`}
        >
          <IconeTipo className="icone-alerta" />
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
