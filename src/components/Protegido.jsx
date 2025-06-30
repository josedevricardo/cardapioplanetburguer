import React from "react";
import { Navigate } from "react-router-dom";

export function Protegido({ children }) {
  const logado = localStorage.getItem("adminLogado") === "true";
  const token = localStorage.getItem("token");

  return logado && token ? children : <Navigate to="/login-admin" />;
}
