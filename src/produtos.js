const { lanches } = require("./artesanal");
const { bebidas } = require("./bebidas");
const { sucos } = require("./sucos");
const { omeletes } = require("./omeletes");
const { acai } = require("./acai");
const { acrescimo } = require("./acrescimo");

function adicionarCategoria(lista, categoria) {
  return lista.map((item) => ({
    ...item,
    categoria,
  }));
}

const produtos = [
  ...adicionarCategoria(lanches, "Lanches"),
  ...adicionarCategoria(bebidas, "Bebidas"),
  ...adicionarCategoria(sucos, "Sucos"),
  ...adicionarCategoria(omeletes, "Omeletes"),
  ...adicionarCategoria(acai, "Açaí"),
  ...adicionarCategoria(acrescimo, "Acréscimos"),
];

module.exports = { produtos };
