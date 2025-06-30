import React from "react";
import { useNavigate } from "react-router-dom";

export function Logout() {
  const navigate = useNavigate();

  React.useEffect(() => {
    localStorage.removeItem("adminLogado");
    localStorage.removeItem("token");
    navigate("/login-admin");
  }, [navigate]);

  return null;
}
