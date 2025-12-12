import React, { useEffect, useState, useCallback } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue, update, push, remove, set } from "firebase/database";
import { saveAs } from "file-saver";
import { PlusCircle, Trash2, Save, Upload, Search, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./adminProdutos.css";
import "./modalPedido.css";

// Modal React para adicionar produto
function ModalAdicionarProduto({ categorias, aberto, onClose, onSalvar }) {
  const [categoria, setCategoria] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState(0);
  const [imagem, setImagem] = useState("");
  const [ativo, setAtivo] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoria || !nome || !preco) return;
    onSalvar(categoria, {
      nome,
      descricao,
      preco: parseFloat(preco),
      estoque: parseInt(estoque),
      imagem,
      ativo
    });
    onClose();
  };

  return (
    <div className={`modal-produto-overlay  ${aberto ? "show" : ""}`}>
      <motion.div
        className="modalEditar"
        initial={{ opacity: 0, scale: 0.95, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 25 }}
        transition={{ duration: 0.25 }}
      >
        <h3 className="titulo-modal">➕ Adicionar Produto</h3>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>Categoria</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label>Nome</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} required />

          <label>Descrição</label>
          <input value={descricao} onChange={(e) => setDescricao(e.target.value)} />

          <label>Preço</label>
          <input type="number" value={preco} onChange={(e) => setPreco(e.target.value)} required />

          <label>Estoque</label>
          <input type="number" value={estoque} onChange={(e) => setEstoque(e.target.value)} />

          <label>URL da imagem</label>
          <input value={imagem} onChange={(e) => setImagem(e.target.value)} />

          <label className="checkbox-area">
            <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} /> Produto ativo
          </label>

          <div className="modal-actions">
            <button type="button" className="btnCancelar" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btnSalvar">Salvar</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}


export default function AdminProdutosCompleto() {
  const [produtos, setProdutos] = useState({});
  const [novaCategoria, setNovaCategoria] = useState("");
  const [filtro, setFiltro] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  const mostrarMensagem = useCallback((texto) => {
    const audio = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
    audio.play();
    setMensagem(texto);
    setTimeout(() => setMensagem(""), 3000);
  }, []);

  // Carregar produtos do Firebase
  useEffect(() => {
    const categoriasRef = ref(db, "categorias");
    const unsubscribe = onValue(categoriasRef, (snapshot) => {
      const data = snapshot.val() || {};
      const reorganizado = {};
      Object.entries(data).forEach(([cat, dados]) => {
        reorganizado[cat] = dados.produtos || {};
      });
      setProdutos(reorganizado);
    });

    return () => unsubscribe();
  }, []);

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
    if (!window.confirm("Deseja realmente remover este produto?")) return;
    remove(ref(db, `categorias/${cat}/produtos/${id}`))
      .then(() => mostrarMensagem("🗑️ Produto removido."))
      .catch(() => mostrarMensagem("❌ Erro ao remover produto."));
  };

  const adicionarCategoria = () => {
    if (!novaCategoria.trim()) return mostrarMensagem("❌ Nome inválido.");
    set(ref(db, `categorias/${novaCategoria}`), { nome: novaCategoria, produtos: {} })
      .then(() => mostrarMensagem("✅ Categoria adicionada."))
      .catch(() => mostrarMensagem("❌ Erro ao adicionar categoria."));
    setNovaCategoria("");
  };

  const removerCategoria = (cat) => {
    if (!window.confirm(`Excluir categoria "${cat}" com todos os produtos?`)) return;
    remove(ref(db, `categorias/${cat}`))
      .then(() => mostrarMensagem("🗑️ Categoria removida."))
      .catch(() => mostrarMensagem("❌ Erro ao remover categoria."));
  };

  const exportarJSON = () => {
    const blob = new Blob([JSON.stringify(produtos, null, 2)], { type: "application/json" });
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

  const adicionarProduto = (categoria, produto) => {
    const novoRef = push(ref(db, `categorias/${categoria}/produtos`));
    set(novoRef, produto)
      .then(() => mostrarMensagem("✅ Produto adicionado com sucesso!"))
      .catch(() => mostrarMensagem("❌ Erro ao adicionar produto."));
  };

  const categoriasKeys = Object.keys(produtos);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
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

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">🛠️ Admin de Produtos</h2>
        <button
          onClick={() => { localStorage.removeItem("adminLogado"); window.location.href = "/login-admin"; }}
          className="btn-sair"
        >
          <LogOut size={18} /> Sair
        </button>
      </div>

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
          {categoriasKeys.map((cat) => (<option key={cat}>{cat}</option>))}
        </select>
        <button className="btn-export" onClick={exportarJSON}><Upload size={16} /> JSON</button>
        <button className="btn-export" onClick={exportarCSV}><Upload size={16} /> CSV</button>
      </div>

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

      <button className="btn-add-produto" onClick={() => setModalAberto(true)}>
        ➕ Adicionar novo produto
      </button>

      {modalAberto && (
        <ModalAdicionarProduto
          categorias={categoriasKeys}
          onClose={() => setModalAberto(false)}
          onSalvar={adicionarProduto}
        />
      )}

      {categoriasKeys.map((cat) => (
        <div key={cat} className="card-categoria">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-yellow-700">{cat}</h3>
            <button className="btn-remove-categoria" onClick={() => removerCategoria(cat)}>
              <Trash2 size={16} /> Remover categoria
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(produtos[cat])
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
                  <input className="input" value={prod.nome || ""} onChange={(e) => handleInputChange(cat, id, "nome", e.target.value)} placeholder="Nome" />
                  <input className="input" value={prod.descricao || ""} onChange={(e) => handleInputChange(cat, id, "descricao", e.target.value)} placeholder="Descrição" />
                  <input className="input" type="number" value={prod.preco || ""} onChange={(e) => handleInputChange(cat, id, "preco", e.target.value)} placeholder="Preço" />
                  <input className="input" type="number" value={prod.estoque ?? ""} onChange={(e) => handleInputChange(cat, id, "estoque", e.target.value)} placeholder="Estoque" />
                  <input className="input" value={prod.imagem || ""} onChange={(e) => handleInputChange(cat, id, "imagem", e.target.value)} placeholder="URL da imagem" />
                  <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" checked={prod.ativo ?? true} onChange={(e) => handleInputChange(cat, id, "ativo", e.target.checked)} />
                    <span className="text-sm">Produto ativo</span>
                  </div>
                  {prod.imagem && <img src={prod.imagem} alt="" className="h-24 w-full object-contain mb-2 border rounded" />}
                  <div className="flex justify-between mt-2">
                    <button className="btn-yellow" onClick={() => salvarProduto(cat, id)}><Save size={16} /> Salvar</button>
                    <button className="btn-red" onClick={() => removerProduto(cat, id)}><Trash2 size={16} /> Remover</button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}