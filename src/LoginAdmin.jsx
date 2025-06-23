import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const usuarioCorreto = "admin";
const senhaCorreta = "1234";

export default function LoginAdmin() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (usuario === usuarioCorreto && senha === senhaCorreta) {
      localStorage.setItem("adminLogado", "true");
      navigate("/admin");
    } else {
      setErro("Usuário ou senha incorretos");
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 320, margin: "auto", fontFamily: "Arial" }}>
      <h2>Login Admin</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <button type="submit" style={{ padding: "8px 12px" }}>
          Entrar
        </button>
      </form>
    </div>
  );
}
