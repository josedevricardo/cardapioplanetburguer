import React, { createContext, useContext, useState, useEffect } from "react";
import { produtos as produtosIniciais } from "../dados";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    try {
      const produtosSalvos = localStorage.getItem("produtos");
      const parsed = JSON.parse(produtosSalvos);

      if (Array.isArray(parsed) && parsed.length > 0) {
        setProdutos(parsed);
      } else {
        setProdutos(produtosIniciais);
      }
    } catch (error) {
      console.warn("Erro ao carregar produtos do localStorage:", error);
      setProdutos(produtosIniciais);
    }
  }, []);

  const atualizarProdutos = (novosProdutos) => {
    setProdutos(novosProdutos);
    localStorage.setItem("produtos", JSON.stringify(novosProdutos));
  };

  return (
    <ProductContext.Provider value={{ produtos, setProdutos, atualizarProdutos }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProdutos() {
  return useContext(ProductContext);
}
