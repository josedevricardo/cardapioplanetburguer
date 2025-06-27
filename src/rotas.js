import { Routes, Route } from "react-router-dom";

// Import das páginas públicas
import Home from './pages/home/Home.jsx';
import Checkout from './pages/checkout/Checkout.jsx';
import Lanches from './pages/lanches/Lanches.jsx';
import Produto2 from './pages/produto2/Produto2.jsx';
import Omeletes from './pages/omeletes/Omeletes.jsx';
import Bebidas from './pages/bebidas/Bebidas.jsx';
import Sucos from './pages/sucos/Sucos.jsx';
import Acrescimo from './pages/acrescimo/Acrescimo.jsx';
import Acai from './pages/acai/Acai.jsx';
import AdminPedidos from "./pages/AdminPedidos.jsx";
import LoginAdmin from "./pages/LoginAdmin.jsx";
import TesteQzTray from "./pages/TesteQzTray.jsx"; // ✅ Corrigido aqui
import { Protegido } from "./components/Protegido.jsx";

function Rotas() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/Checkout" element={<Checkout />} />
      <Route path="/Lanches" element={<Lanches />} />
      <Route path="/Produto2" element={<Produto2 />} />
      <Route path="/Omeletes" element={<Omeletes />} />
      <Route path="/Bebidas" element={<Bebidas />} />
      <Route path="/Sucos" element={<Sucos />} />
      <Route path="/Acrescimo" element={<Acrescimo />} />
      <Route path="/Acai" element={<Acai />} />
      <Route path="/login-admin" element={<LoginAdmin />} />
      <Route path="/teste-qz" element={<TesteQzTray />} /> {/* Corrigido aqui */}

      {/* Rota protegida */}
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
