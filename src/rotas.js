import React from "react";
import { Routes, Route } from "react-router-dom";

// páginas da loja (PÚBLICAS - Qualquer cliente pode ver)
import Home from "./pages/home/Home.jsx";
import Lanches from "./pages/lanches/Lanches.jsx";
import Omeletes from "./pages/omeletes/Omeletes.jsx";
import Bebidas from "./pages/bebidas/Bebidas.jsx";
import Sucos from "./pages/sucos/Sucos.jsx";
import Acrescimo from "./pages/acrescimo/Acrescimo.jsx";
import Acai from "./pages/acai/Acai.jsx";
import ProdutoSlider from "./components/produto-slider/produto-slider";

// admin (RESTRITAS - Apenas com login e senha do Firebase)
import LoginAdmin from "./pages/LoginAdmin.jsx";
import AdminEstatisticas from "./pages/AdminEstatisticas.jsx";
import AdminPedidos from "./pages/AdminPedidos.jsx";
import AdminProdutosCompleto from "./pages/AdminProdutosCompleto.jsx";
import PrivateRoute from "./PrivateRoute.jsx";

function Rotas() {
  return (
    <Routes>
      {/* --- ÁREA PÚBLICA (Clientes do Lojista acessam livremente) --- */}
      <Route path="/" element={<Home />} />
      <Route path="/lanches" element={<Lanches />} />
      <Route path="/bebidas" element={<Bebidas />} />
      <Route path="/sucos" element={<Sucos />} />
      <Route path="/omeletes" element={<Omeletes />} />
      <Route path="/acrescimo" element={<Acrescimo />} />
      <Route path="/acai" element={<Acai />} />
      <Route path="/categorias" element={<ProdutoSlider />} />
      <Route path="/categoria/:nome" element={<ProdutoSlider />} />

      {/* --- ÁREA DE LOGIN DO LOJISTA --- */}
      <Route path="/login-admin" element={<LoginAdmin />} />

      {/* --- ÁREA RESTRITA / SEGURANÇA MÁXIMA (Painel Admin) --- */}
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