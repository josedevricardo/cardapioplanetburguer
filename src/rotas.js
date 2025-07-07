// src/Rotas.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";


import Home from "./pages/home/Home.jsx";
import Lanches from "./pages/lanches/Lanches.jsx";
import Produto2 from "./pages/produto2/Produto2.jsx";
import Omeletes from "./pages/omeletes/Omeletes.jsx";
import Bebidas from "./pages/bebidas/Bebidas.jsx";
import Sucos from "./pages/sucos/Sucos.jsx";
import Acrescimo from "./pages/acrescimo/Acrescimo.jsx";
import Acai from "./pages/acai/Acai.jsx";
import AdminEstatisticas from "./pages/AdminEstatisticas.jsx";
import Checkout from "./pages/checkout/Checkout.jsx";

import AdminPedidos from "./pages/AdminPedidos.jsx";
import LoginAdmin from "./pages/LoginAdmin.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import AdminProdutosCompleto from "./pages/AdminProdutosCompleto.jsx";

function Rotas() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/lanches" element={<Lanches />} />
      <Route path="/produto2" element={<Produto2 />} />
      <Route path="/omeletes" element={<Omeletes />} />
      <Route path="/bebidas" element={<Bebidas />} />
      <Route path="/sucos" element={<Sucos />} />
      <Route path="/acrescimo" element={<Acrescimo />} />
      <Route path="/acai" element={<Acai />} />
      <Route path="/login-admin" element={<LoginAdmin />} />

      {/* Rotas protegidas admin */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminPedidos />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin-estatisticas"
        element={
          <PrivateRoute>
            <AdminEstatisticas />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin-produtos"
        element={
          <PrivateRoute>
            <AdminProdutosCompleto />
          </PrivateRoute>
        }
      />

      {/* Página 404 */}
      <Route
        path="*"
        element={
          <h1 className="text-center p-10 text-2xl">🚫 Página não encontrada</h1>
        }
      />
    </Routes>
  );
}

export default Rotas;
