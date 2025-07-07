import React, { createContext, useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";

export const ProdutoContext = createContext();

export const ProdutoProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const categoriasRef = ref(db, "categorias");

    const unsubscribe = onValue(categoriasRef, (snapshot) => {
      const data = snapshot.val() || {};
      const categoriasFormatadas = Object.entries(data).map(([chave, categoria]) => ({
        nome: categoria.nome || chave,
        produtos: Object.entries(categoria.produtos || {})
          .map(([id, p]) => ({ id, ...p }))
          .filter((p) => p.ativo === undefined || p.ativo === true),
      }));

      setCategorias(categoriasFormatadas);
    });

    return () => unsubscribe();
  }, []);

  // Lista unificada
  const produtosUnificados = categorias.flatMap((cat) =>
    cat.produtos.map((p) => ({ ...p, categoria: cat.nome }))
  );

  return (
    <ProdutoContext.Provider value={{ categorias, produtosUnificados }}>
      {children}
    </ProdutoContext.Provider>
  );
};
