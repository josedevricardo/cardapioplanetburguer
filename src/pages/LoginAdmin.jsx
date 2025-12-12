import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import ResetPasswordModal from "../components/ResetPasswordModal/ResetPasswordModal";
import "./LoginAdmin.css";
import logo from "../assets/mascote.png";

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
      setTimeout(() => navigate("/admin"), 800);
    } catch (error) {
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
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
    <div id="login-admin" className="login-container">

      {/* LOGO */}
      <img src={logo} alt="Logo" className="login-logo" />

      {/* CARD */}
      <div className="login-box">
        <h2>Acesso ao Painel</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          {erro && <p className="msg-erro">{erro}</p>}
          {sucesso && <p className="msg-sucesso">Login realizado!</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <button
            type="button"
            className="btn-esqueci"
            onClick={() => setMostrarModal(true)}
          >
            Esqueci minha senha
          </button>
        </form>
      </div>

      <footer className="dev-footer">
        Desenvolvido por{" "}
        <a
          href="https://portfoliojosericardo.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          @Ricardo
        </a>
      </footer>

      {mostrarModal && (
        <ResetPasswordModal onClose={() => setMostrarModal(false)} />
      )}
    </div>
  );
}
