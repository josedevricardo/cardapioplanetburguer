import React from "react";
import { useNavigate } from "react-router-dom";

export default function MenuAdmin() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("adminLogado");
    localStorage.removeItem("token");
    navigate("/login-admin");
  }

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold cursor-pointer" onClick={() => navigate("/admin")}>
        Painel Admin
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
      >
        Sair
      </button>
    </nav>
  );
}
