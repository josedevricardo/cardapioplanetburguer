// ConfirmModal.jsx
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

export default function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white rounded-xl p-6 w-80 max-w-full shadow-lg flex flex-col items-center"
      >
        <h2 className="text-xl font-semibold mb-4">Confirmar Pedido?</h2>
        <p className="mb-6 text-center">
          Deseja realmente enviar o pedido agora? Depois não será possível alterar.
        </p>
        <div className="flex gap-4 w-full justify-center">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
          >
            <X size={18} />
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-5 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700 transition"
          >
            <Check size={18} />
            Confirmar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
