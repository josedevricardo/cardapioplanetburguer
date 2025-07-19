import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebaseConfig'; 



import ResetPasswordModal from "../components/ResetPasswordModal/ResetPasswordModal";
import "./LoginAdmin.css";

export default function LoginAdmin() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, usuario.trim(), senha.trim());
      localStorage.setItem("adminLogado", "true");
      setSucesso(true);
      setErro("");
      setTimeout(() => navigate("/admin"), 1000);
    } catch (error) {
      setErro("Usuário ou senha incorretos.");
      setSucesso(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login Administrador</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoFocus
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          {erro && <p className="error-message">{erro}</p>}
          {sucesso && <p className="success-message">✅ Logado com sucesso!</p>}

          <div className="button-group">
            <button type="submit">Entrar</button>
            <button
              type="button"
              className="esqueceu-senha"
              onClick={() => setMostrarModal(true)}
            >
              Esqueceu a senha?
            </button>
          </div>
        </form>
      </div>

      {mostrarModal && (
        <ResetPasswordModal onClose={() => setMostrarModal(false)} />
      )}
    </div>
  );
}
