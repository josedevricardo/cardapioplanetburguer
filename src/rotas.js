import React from "react";
import { Routes, Route } from "react-router-dom";

// páginas
import Home from "./pages/Home/home.js";
import Lanches from "./pages/lanches/Lanches.jsx";
import Omeletes from "./pages/omeletes/Omeletes.jsx";
import Bebidas from "./pages/bebidas/Bebidas.jsx";
import Sucos from "./pages/sucos/Sucos.jsx";
import Acrescimo from "./pages/acrescimo/Acrescimo.jsx";
import Acai from "./pages/acai/Acai.jsx";

// admin
import AdminEstatisticas from "./pages/AdminEstatisticas.jsx";
import AdminPedidos from "./pages/AdminPedidos.jsx";
import LoginAdmin from "./pages/LoginAdmin.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import AdminProdutosCompleto from "./pages/AdminProdutosCompleto.jsx";

// componente de produtos
import ProdutoSlider from "./components/produto-slider/produto-slider";

function Rotas() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/lanches" element={<Lanches />} />
      <Route path="/bebidas" element={<Bebidas />} />
      <Route path="/sucos" element={<Sucos />} />
      <Route path="/omeletes" element={<Omeletes />} />
      <Route path="/acrescimo" element={<Acrescimo />} />
      <Route path="/acai" element={<Acai />} />
      <Route path="/categorias" element={<ProdutoSlider />} />
      <Route path="/categoria/:nome" element={<ProdutoSlider />} />

      {/* Login admin */}
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
          <h1 className="text-center p-10 text-2xl">
            🚫 Página não encontrada
          </h1>
        }
      />
    </Routes>
  );
}

export default Rotas;
