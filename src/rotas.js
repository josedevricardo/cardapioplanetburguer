import { Routes, Route } from "react-router-dom";

// Import das páginas públicas
import Home from "./pages/home/Home.jsx";
import Checkout from "./pages/checkout/Checkout.jsx";
import Lanches from "./pages/lanches/Lanches.jsx";
import Produto2 from "./pages/produto2/Produto2.jsx";
import Omeletes from "./pages/omeletes/Omeletes.jsx";
import Bebidas from "./pages/bebidas/Bebidas.jsx";
import Sucos from "./pages/sucos/Sucos.jsx";
import Acrescimo from "./pages/acrescimo/Acrescimo.jsx";
import Acai from "./pages/acai/Acai.jsx";


import AdminPedidos from "./pages/AdminPedidos";

import LoginAdmin from "./pages/LoginAdmin";
import { Protegido } from "./components/Protegido";


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
          <Protegido>
            <AdminPedidos />
          </Protegido>
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
