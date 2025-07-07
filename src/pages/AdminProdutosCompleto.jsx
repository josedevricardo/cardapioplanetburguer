import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue, update, push, remove, set } from "firebase/database";
import { saveAs } from "file-saver";
import {
  PlusCircle,
  Trash2,
  Save,
  Upload,
  Search,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./adminProdutos.css";

function AdminProdutosCompleto() {
  const [produtos, setProdutos] = useState({});
  const [novaCategoria, setNovaCategoria] = useState("");
  const [filtro, setFiltro] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const categoriasRef = ref(db, "categorias");
    onValue(categoriasRef, (snapshot) => {
      const data = snapshot.val() || {};
      const reorganizado = {};
      Object.entries(data).forEach(([cat, dados]) => {
        reorganizado[cat] = dados.produtos || {};
      });
      setProdutos(reorganizado);
    });

    window.addEventListener("message", (event) => {
      const { categoria, produto } = event.data;
      if (!categoria || !produto) return;
      const novoRef = push(ref(db, `categorias/${categoria}/produtos`));
      set(novoRef, produto);
      mostrarMensagem("✅ Produto adicionado com sucesso!");
    });
  }, []);

  const mostrarMensagem = (texto) => {
    const audio = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
    audio.play();
    setMensagem(texto);
    setTimeout(() => setMensagem(""), 3000);
  };

  const handleInputChange = (cat, id, campo, valor) => {
    setProdutos((prev) => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        [id]: {
          ...prev[cat][id],
          [campo]: valor,
        },
      },
    }));
  };

  const salvarProduto = (cat, id) => {
    const produtoAtualizado = produtos[cat][id];
    update(ref(db, `categorias/${cat}/produtos/${id}`), produtoAtualizado)
      .then(() => mostrarMensagem("✅ Produto atualizado com sucesso!"))
      .catch(() => mostrarMensagem("❌ Erro ao salvar."));
  };

  const removerProduto = (cat, id) => {
    if (window.confirm("Deseja realmente remover este produto?")) {
      remove(ref(db, `categorias/${cat}/produtos/${id}`));
      mostrarMensagem("🗑️ Produto removido.");
    }
  };

  const adicionarCategoria = () => {
    if (!novaCategoria.trim()) return mostrarMensagem("❌ Nome inválido.");
    set(ref(db, `categorias/${novaCategoria}`), {
      nome: novaCategoria,
      produtos: {},
    });
    setNovaCategoria("");
    mostrarMensagem("✅ Categoria adicionada.");
  };

  const removerCategoria = (cat) => {
    if (window.confirm(`Excluir categoria "${cat}" com todos os produtos?`)) {
      remove(ref(db, `categorias/${cat}`));
      mostrarMensagem("🗑️ Categoria removida.");
    }
  };

  const exportarJSON = () => {
    const blob = new Blob([JSON.stringify(produtos, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, "produtos-backup.json");
    mostrarMensagem("📦 Exportado como JSON.");
  };

  const exportarCSV = () => {
    let csv = "categoria,nome,descricao,preco,estoque,ativo,imagem\n";
    Object.entries(produtos).forEach(([cat, lista]) => {
      if (filtroCategoria && cat !== filtroCategoria) return;
      Object.values(lista).forEach((prod) => {
        csv += `"${cat}","${prod.nome}","${prod.descricao}","${prod.preco}","${prod.estoque}","${prod.ativo}","${prod.imagem}"\n`;
      });
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "produtos.csv");
    mostrarMensagem("📄 Exportado como CSV.");
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Mensagem animada */}
      <AnimatePresence>
        {mensagem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#16a34a",
              color: "#fff",
              padding: "1rem 2rem",
              borderRadius: "1rem",
              fontSize: "18px",
              fontWeight: "bold",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" viewBox="0 0 24 24" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {mensagem}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topo */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">🛠️ Admin de Produtos</h2>
        <button
          onClick={() => {
            localStorage.removeItem("adminLogado");
            window.location.href = "/login-admin";
          }}
          className="btn-sair"
        >
          <LogOut size={18} /> Sair
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-2 mb-4 items-center">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            className="input-busca"
            placeholder="Buscar produto..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value.toLowerCase())}
          />
          <Search className="icon-busca" size={18} />
        </div>

        <select
          className="select-categoria"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="">Todas categorias</option>
          {Object.keys(produtos).map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <button className="btn-export" onClick={exportarJSON}>
          <Upload size={16} /> JSON
        </button>
        <button className="btn-export" onClick={exportarCSV}>
          <Upload size={16} /> CSV
        </button>
      </div>

      {/* Nova categoria */}
      <div className="flex gap-2 mb-6">
        <input
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          placeholder="Nova categoria"
          className="input-categoria"
        />
        <button onClick={adicionarCategoria} className="btn-add-categoria">
          <PlusCircle size={18} /> Categoria
        </button>
      </div>

      {/* Botão adicionar produto (abre popup) */}
      <button
        className="btn-add-produto"
        onClick={() => {
          const popup = window.open(
            "",
            "AdicionarProduto",
            "width=500,height=700,left=200,top=100"
          );

          popup.document.write(`
            <html>
              <head>
                <title>Adicionar Produto</title>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    background-color: #f3f4f6;
                    color: #111827;
                  }
                  input, select {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 14px;
                  }
                  button {
                    padding: 10px 15px;
                    background-color: #16a34a;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                  }
                  button:hover {
                    background-color: #15803d;
                  }
                </style>
              </head>
              <body>
                <h2>➕ Adicionar Produto</h2>
                <form id="formProduto">
                  <label>Categoria:</label>
                  <select id="categoria" required>
                    <option value="">Carregando categorias...</option>
                  </select>
                  <label>Nome:</label>
                  <input type="text" id="nome" required />
                  <label>Descrição:</label>
                  <input type="text" id="descricao" />
                  <label>Preço:</label>
                  <input type="number" id="preco" required />
                  <label>Estoque:</label>
                  <input type="number" id="estoque" value="0" required />
                  <label>Imagem (URL):</label>
                  <input type="text" id="imagem" />
                  <label><input type="checkbox" id="ativo" checked /> Produto ativo</label>
                  <button type="submit">Salvar Produto</button>
                </form>

                <script>
                  window.addEventListener("message", function (event) {
                    const categorias = event.data.categorias;
                    if (!categorias || !Array.isArray(categorias)) return;
                    const select = document.getElementById("categoria");
                    select.innerHTML = "<option value=''>Selecione uma categoria</option>";
                    categorias.forEach(cat => {
                      const option = document.createElement("option");
                      option.value = cat;
                      option.textContent = cat;
                      select.appendChild(option);
                    });
                  });

                  document.getElementById("formProduto").addEventListener("submit", function (e) {
                    e.preventDefault();

                    const produto = {
                      nome: document.getElementById("nome").value,
                      descricao: document.getElementById("descricao").value,
                      preco: parseFloat(document.getElementById("preco").value),
                      estoque: parseInt(document.getElementById("estoque").value),
                      imagem: document.getElementById("imagem").value,
                      ativo: document.getElementById("ativo").checked
                    };

                    const categoria = document.getElementById("categoria").value;
                    window.opener.postMessage({ categoria, produto }, "*");

                    // Criar mensagem de sucesso no popup
                    const msg = document.createElement("div");
                    msg.style.position = "fixed";
                    msg.style.top = "50%";
                    msg.style.left = "50%";
                    msg.style.transform = "translate(-50%, -50%)";
                    msg.style.background = "#22c55e";
                    msg.style.color = "#fff";
                    msg.style.padding = "20px 30px";
                    msg.style.borderRadius = "12px";
                    msg.style.fontSize = "18px";
                    msg.style.fontWeight = "bold";
                    msg.style.boxShadow = "0 10px 20px rgba(0,0,0,0.2)";
                    msg.style.zIndex = 9999;
                    msg.style.textAlign = "center";
                    msg.textContent = "Produto enviado com sucesso!";
                    document.body.appendChild(msg);

                    setTimeout(() => {
                      window.close();
                    }, 2000);
                  });
                </script>
              </body>
            </html>
          `);

          setTimeout(() => {
            popup.postMessage({ categorias: Object.keys(produtos) }, "*");
          }, 400);
        }}
      >
        ➕ Adicionar novo produto
      </button>

      {/* Produtos por categoria */}
      {Object.entries(produtos).map(([cat, lista]) => (
        <div key={cat} className="card-categoria">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-yellow-700">{cat}</h3>
            <button
              className="btn-remove-categoria"
              onClick={() => removerCategoria(cat)}
            >
              <Trash2 size={16} /> Remover categoria
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(lista)
              .filter(([_, prod]) => {
                const termo = filtro.toLowerCase().trim();
                if (!termo) return true;
                return (
                  prod.nome?.toLowerCase().includes(termo) ||
                  prod.descricao?.toLowerCase().includes(termo) ||
                  prod.preco?.toString().includes(termo) ||
                  prod.estoque?.toString().includes(termo)
                );
              })
              .map(([id, prod]) => (
                <div key={id} className="card-produto">
                  <input
                    className="input"
                    value={prod.nome || ""}
                    onChange={(e) =>
                      handleInputChange(cat, id, "nome", e.target.value)
                    }
                    placeholder="Nome"
                  />
                  <input
                    className="input"
                    value={prod.descricao || ""}
                    onChange={(e) =>
                      handleInputChange(cat, id, "descricao", e.target.value)
                    }
                    placeholder="Descrição"
                  />
                  <input
                    className="input"
                    type="number"
                    value={prod.preco || ""}
                    onChange={(e) =>
                      handleInputChange(cat, id, "preco", e.target.value)
                    }
                    placeholder="Preço"
                  />
                  <input
                    className="input"
                    type="number"
                    value={prod.estoque ?? ""}
                    onChange={(e) =>
                      handleInputChange(cat, id, "estoque", e.target.value)
                    }
                    placeholder="Estoque"
                  />
                  <input
                    className="input"
                    value={prod.imagem || ""}
                    onChange={(e) =>
                      handleInputChange(cat, id, "imagem", e.target.value)
                    }
                    placeholder="URL da imagem"
                  />

                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={prod.ativo ?? true}
                      onChange={(e) =>
                        handleInputChange(cat, id, "ativo", e.target.checked)
                      }
                    />
                    <span className="text-sm">Produto ativo</span>
                  </div>

                  {prod.imagem && (
                    <img
                      src={prod.imagem}
                      alt=""
                      className="h-24 w-full object-contain mb-2 border rounded"
                    />
                  )}

                  <div className="flex justify-between mt-2">
                    <button
                      className="btn-yellow"
                      onClick={() => salvarProduto(cat, id)}
                    >
                      <Save size={16} /> Salvar
                    </button>
                    <button
                      className="btn-red"
                      onClick={() => removerProduto(cat, id)}
                    >
                      <Trash2 size={16} /> Remover
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminProdutosCompleto;
