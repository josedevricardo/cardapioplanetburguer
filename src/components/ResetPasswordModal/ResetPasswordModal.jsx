import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../firebaseConfig'; // ou o caminho correto

import "./resetModal.css"; // crie ou remova se não for usar

export default function ResetPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMensagem("🔒 Email de redefinição enviado!");
    } catch (error) {
      setMensagem("❌ Erro ao enviar email. Verifique o endereço.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Redefinir Senha</h3>
        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Enviar link</button>
          <button type="button" onClick={onClose} className="close-btn">
            Fechar
          </button>
        </form>
        {mensagem && <p>{mensagem}</p>}
      </div>
    </div>
  );
}
