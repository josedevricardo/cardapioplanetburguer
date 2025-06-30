import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const usuarioCorreto = "admin";
const senhaCorreta = "1234";

export default function LoginAdmin() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (erro) {
      const timer = setTimeout(() => setErro(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [erro]);

  function handleSubmit(e) {
    e.preventDefault();

    // Sanitização básica
    const user = usuario.trim();
    const pass = senha.trim();

    if (user === usuarioCorreto && pass === senhaCorreta) {
  localStorage.setItem("adminLogado", "true");
  // NOVO: salva o mesmo token que o backend espera
  localStorage.setItem("token", "DATABASE_URL='postgresql://neondb_owner:npg_Tbtrzg97okps@ep-odd-scene-a8k1gwn8-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require'");

  setSucesso(true);
  setTimeout(() => navigate("/admin"), 1000);
}

  }

  return (
    <div
      style2={{
        padding: "2rem",
        maxWidth: 360,
        margin: "auto",
        fontFamily: "Arial",
        textAlign: "center",
        border: "1px solid #ddd",
        marginTop: "10vh",
        borderRadius: 10,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}
    >
      <h2>Login Administrador</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: 10,
            fontSize: 16
          }}
          autoFocus
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: 10,
            fontSize: 16
          }}
        />
        {erro && <p style={{ color: "red", marginBottom: 10 }}>{erro}</p>}
        {sucesso && <p style={{ color: "green", marginBottom: 10 }}>✅ Logado!</p>}
        <button
          type="submit"
          style={{
            padding: "10px 16px",
            backgroundColor: "#333",
            color: "#fff",
            fontSize: 16,
            border: "none",
            borderRadius: 5,
            cursor: "pointer"
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
