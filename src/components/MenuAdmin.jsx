import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./menuadmin.css";

export default function MenuAdmin() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("adminLogado");
    localStorage.removeItem("token");
    navigate("/login-admin");
  }

  return (
    <nav className="menu-admin-bar" role="navigation" aria-label="Menu Administrativo">
      <div
        className="menu-admin-logo"
        onClick={() => navigate("/admin")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            navigate("/admin");
          }
        }}
        aria-label="Ir para a página inicial do painel"
      >
        <img src={logo} alt="Logo" className="logo-pequeno" />
        <span className="menu-admin-title">Painel Delivery</span>
      </div>
      <button
        onClick={handleLogout}
        className="menu-admin-sair"
        aria-label="Sair do painel administrativo"
      >
        Sair
      </button>
    </nav>
  );
}
