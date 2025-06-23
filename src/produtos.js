import { lanches } from "./artesanal";
import { bebidas } from "./bebidas";
import { sucos } from "./sucos";
import { omeletes } from "./omeletes";
import { acai } from "./acai";
import { acrescimo } from "./acrescimo";

function adicionarCategoria(lista, categoria) {
  return lista.map((item) => ({
    ...item,
    categoria,
  }));
}

export const produtos = [
  ...adicionarCategoria(lanches, "Lanches"),
  ...adicionarCategoria(bebidas, "Bebidas"),
  ...adicionarCategoria(sucos, "Sucos"),
  ...adicionarCategoria(omeletes, "Omeletes"),
  ...adicionarCategoria(acai, "Açaí"),
  ...adicionarCategoria(acrescimo, "Acréscimos"),
];
