import React from "react";
import ReactDOM from "react-dom/client";
import "./style/global.css";
import Rotas from "./rotas";

import { CartProvider } from "./contexts/cart-context.jsx";
import { ProductProvider } from "./contexts/product-context";
import { BrowserRouter } from "react-router-dom";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <CartProvider>
      
        <ProductProvider>
         
          <Rotas />
          
        </ProductProvider>
      
    </CartProvider>
  </BrowserRouter>
);
