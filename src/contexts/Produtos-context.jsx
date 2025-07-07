import React, { createContext, useContext, useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebaseConfig";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const categoriasRef = ref(db, "categorias");
    onValue(categoriasRef, (snapshot) => {
      const data = snapshot.val() || {};

      const ordemCategorias = [
        "hamburgures",
        "lanches",
        "bebidas",
        "acai",
        "sucos",
        "acresimos",
        "artesanal",
      ];

      const categoriasFormatadas = ordemCategorias
        .filter((key) => data[key])
        .map((key) => ({
          nome: data[key].nome || key,
          produtos: Object.entries(data[key].produtos || {})
            .map(([id, p]) => ({ id, ...p }))
            .filter((p) => p.ativo === undefined || p.ativo === true),
        }));

      setCategorias(categoriasFormatadas);
    });
  }, []);

  // Produtos unificados em array único
  const produtosUnificados = categorias.flatMap((cat) =>
    cat.produtos.map((p) => ({ ...p, categoria: cat.nome }))
  );

  return (
    <ProductContext.Provider value={{ categorias, produtosUnificados }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
