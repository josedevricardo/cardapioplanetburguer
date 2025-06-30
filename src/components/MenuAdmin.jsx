import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // ajuste se estiver em outro caminho
import "./menuadmin.css"; // importe seu CSS externo

export default function MenuAdmin() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("adminLogado");
    localStorage.removeItem("token");
    navigate("/login-admin");
  }

  return (
    <nav className="menu-admin-bar">
      <div
        className="menu-admin-logo"
        onClick={() => navigate("/admin")}
      >
        <img src={logo} alt="Logo" className="logo-pequeno" />
        <span className="menu-admin-title">Painel Delivery</span>
      </div>
      <button onClick={handleLogout} className="menu-admin-sair">
        Sair
      </button>
    </nav>
  );
}
