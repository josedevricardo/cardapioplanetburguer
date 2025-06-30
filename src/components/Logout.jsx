import React, { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function LogoutAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    signOut(auth).then(() => {
      localStorage.removeItem("adminLogado");
      navigate("/login-admin");
    });
  }, [navigate]);

  return <p>Saindo...</p>;
}
