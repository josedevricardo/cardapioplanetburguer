// src/components/ComponentePai.jsx
import React, { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import { AnimatePresence } from "framer-motion";

export default function ComponentePai() {
  const [showModal, setShowModal] = useState(false);

  const abrirModal = () => setShowModal(true);
  const fecharModal = () => setShowModal(false);

  const confirmarPedido = () => {
    // Lógica para confirmar o pedido aqui
    alert("Pedido confirmado!");
    fecharModal();
  };

  return (
    <>
      <button
        onClick={abrirModal}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Enviar Pedido
      </button>

      <AnimatePresence>
        {showModal && (
          <ConfirmModal onConfirm={confirmarPedido} onCancel={fecharModal} />
        )}
      </AnimatePresence>
    </>
  );
}
