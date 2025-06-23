import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginAdmin from "./pages/LoginAdmin";
import AdminPedidos from "./pages/AdminPedidos";
import { Protegido } from "./Protegido";

export default function App() {
  return (
    <Routes>
      <Route path="/login-admin" element={<LoginAdmin />} />
      <Route
        path="/admin"
        element={
          <Protegido>
            <AdminPedidos />
          </Protegido>
        }
      />
      <Route path="*" element={<LoginAdmin />} />
    </Routes>
  );
}
