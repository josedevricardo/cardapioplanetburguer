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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, usuario.trim(), senha.trim());
      localStorage.setItem("adminLogado", "true");
      setSucesso(true);
      setErro("");
      setTimeout(() => navigate("/admin"), 1000);
    } catch (error) {
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setErro("Usuário ou senha incorretos.");
      } else if (error.code === "auth/too-many-requests") {
        setErro("Muitas tentativas. Tente mais tarde.");
      } else if (error.code === "auth/network-request-failed") {
        setErro("Erro de conexão. Verifique sua internet.");
      } else {
        setErro("Erro ao efetuar login. Tente novamente.");
      }
      setSucesso(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-bg"> {/* FUNDO ANIMADO */}
      <div className="login-card"> {/* CAIXA ESTILIZADA */}
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

          {erro && <p className="error-message" role="alert">{erro}</p>}
          {sucesso && <p className="success-message" role="alert">✅ Logado com sucesso!</p>}

          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
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
