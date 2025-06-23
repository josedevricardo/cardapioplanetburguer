import React from "react";
import { Navigate } from "react-router-dom";

export function Protegido({ children }) {
  const logado = localStorage.getItem("adminLogado") === "true";
  return logado ? children : <Navigate to="/login-admin" />;
}
