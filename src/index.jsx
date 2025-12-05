import React from "react";
import ReactDOM from "react-dom/client";
import "./style/global.css"; // ✅ garante modo claro fixo e Tailwind
import Rotas from "./rotas";

import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./contexts/cart-context.jsx";
import { ProductProvider } from "./contexts/product-context";
import { ProdutoProvider } from "./contexts/categoria-context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <ProductProvider>
          <ProdutoProvider>
            <Rotas />
          </ProdutoProvider>
        </ProductProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
