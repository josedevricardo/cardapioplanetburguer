import React, { useEffect, useState, useCallback } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue, update, push, remove } from "firebase/database";
import { Trash2, Save, Search, ImageIcon, Plus, X, Eye, EyeOff, Edit, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./adminProdutos.css";

// --- COMPONENTE DO MODAL (ADICIONAR NOVO) ---
function ModalAdicionarProduto({ categorias, aberto, onClose, onSalvar }) {
  const [categoria, setCategoria] = useState("");
  const [novaCatNome, setNovaCatNome] = useState("");
  const [mostraInputCat, setMostraInputCat] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagem(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const catFinal = mostraInputCat ? novaCatNome.trim() : categoria;
    if (!catFinal || !nome || !preco) return;
    onSalvar(catFinal, { 
      nome, 
      descricao, 
      preco: parseFloat(preco), 
      imagem, 
      ativo: true 
    });
    
    setCategoria(""); setNovaCatNome(""); setNome(""); setDescricao(""); setPreco(""); setImagem("");
    onClose();
  };

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div className="modalEditar" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">➕ Novo Produto</h3>
          <button onClick={onClose}><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex gap-2">
              {!mostraInputCat ? (
                <select className="input" value={categoria} onChange={(e) => setCategoria(e.target.value)} required={!mostraInputCat}>
                  <option value="">Categoria...</option>
                  {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : (
                <input className="input" placeholder="Nova Categoria" value={novaCatNome} onChange={(e) => setNovaCatNome(e.target.value)} required />
              )}
              <button type="button" className="btn-add-categoria" onClick={() => setMostraInputCat(!mostraInputCat)}>
                {mostraInputCat ? <X size={16}/> : <Plus size={16}/>}
              </button>
            </div>
            <input className="input" placeholder="Nome do Produto" value={nome} onChange={(e) => setNome(e.target.value)} required />
            <textarea className="input-textarea" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
            <input className="input" type="number" step="0.01" placeholder="Preço" value={preco} onChange={(e) => setPreco(e.target.value)} required />
            <label className="btn-upload-mini" style={{border: '1px dashed #ccc', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'}}>
               <ImageIcon size={16} /> {imagem ? "Imagem OK ✅" : "Anexar Foto"}
               <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </label>
            <button type="submit" className="btn-add-produto" style={{width: '100%', justifyContent: 'center'}}>Cadastrar Produto</button>
        </form>
      </motion.div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function AdminProdutosCompleto() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState({});
  const [filtro, setFiltro] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  const mostrarMsg = useCallback((t) => { setMensagem(t); setTimeout(() => setMensagem(""), 2500); }, []);

  useEffect(() => {
    const unsub = onValue(ref(db, "categorias"), (s) => {
      const data = s.val() || {};
      const reorg = {};
      Object.entries(data).forEach(([cat, d]) => {
        reorg[cat] = d.produtos || {};
      });
      setProdutos(reorg);
    });
    return () => unsub();
  }, []);

  // Lógica para atualizar imagem de produto existente
  const handleUpdateImage = (cat, id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProdutos(prev => ({
          ...prev, 
          [cat]: { ...prev[cat], [id]: { ...prev[cat][id], imagem: reader.result } }
        }));
        mostrarMsg("🖼️ Imagem carregada! Clique em Salvar.");
      };
      reader.readAsDataURL(file);
    }
  };

  const salvarProd = (cat, id) => {
    update(ref(db, `categorias/${cat}/produtos/${id}`), produtos[cat][id])
      .then(() => mostrarMsg("✅ Alterações Salvas!"));
  };

  const handleAdd = (cat, obj) => {
    update(ref(db, `categorias/${cat}`), { nome: cat }).then(() => {
        push(ref(db, `categorias/${cat}/produtos`), obj).then(() => { 
            mostrarMsg("✅ Adicionado com Sucesso!"); 
            setModalAberto(false); 
        });
    });
  };

  const removerProd = (cat, id, nome) => {
    if (window.confirm(`Deseja excluir apenas o produto "${nome}"?`)) {
      // Remove APENAS o produto no caminho específico, sem afetar o nó pai da categoria
      remove(ref(db, `categorias/${cat}/produtos/${id}`))
        .then(() => mostrarMsg("🗑️ Produto Removido!"));
    }
  };

  const categoriasKeys = Object.keys(produtos);

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <AnimatePresence>
        {mensagem && <motion.div className="mensagem-fixa">{mensagem}</motion.div>}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🛠️ Admin Planet's</h2>
        <button className="btn-sair" onClick={() => navigate(-1)}>Voltar</button>
      </div>

      <div className="controles-topo">
        <div className="busca-wrapper">
          <input className="input-busca" placeholder="Buscar produto..." onChange={(e) => setFiltro(e.target.value.toLowerCase())} />
          <Search className="icon-busca" size={18} />
        </div>
        <select className="select-categoria" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
          <option value="">Todas Categorias</option>
          {categoriasKeys.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="btn-add-produto" onClick={() => setModalAberto(true)}><Plus size={18}/> Novo Produto</button>
      </div>

      <ModalAdicionarProduto categorias={categoriasKeys} aberto={modalAberto} onClose={() => setModalAberto(false)} onSalvar={handleAdd} />

      {categoriasKeys.filter(c => !filtroCategoria || c === filtroCategoria).map(cat => (
        <div key={cat} className="card-categoria">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 style={{margin: 0, color: '#b45309'}}>{cat}</h3>
            {/* Botão de Excluir Categoria (Separado) */}
            <button className="btn-remove-categoria" onClick={() => { if(window.confirm(`AVISO: Isso excluirá a categoria "${cat}" e TODOS os produtos dentro dela. Confirmar?`)) remove(ref(db, `categorias/${cat}`)) }}>
              <Trash2 size={16} /> <span className="texto-btn-pc">Excluir Categoria</span>
            </button>
          </div>
          
          <div className="grid">
            {Object.entries(produtos[cat] || {}).filter(([_, p]) => !filtro || p.nome?.toLowerCase().includes(filtro)).map(([id, prod]) => (
              <div key={id} className="card-produto">
                {prod.imagem && <img src={prod.imagem} className="img-admin" alt="" />}
                
                {/* Correção da Imagem: handleUpdateImage adicionado ao onChange */}
                <label className="btn-upload-mini">
                  {prod.imagem ? "Trocar Imagem" : "Anexar Imagem"}
                  <input type="file" hidden accept="image/*" onChange={(e) => handleUpdateImage(cat, id, e)} />
                </label>
                
                <input className="input" placeholder="Nome" value={prod.nome || ""} onChange={(e) => {
                  const val = e.target.value;
                  setProdutos(prev => ({...prev, [cat]: {...prev[cat], [id]: {...prev[cat][id], nome: val }}}));
                }} />

                <textarea className="input-textarea" placeholder="Descrição..." value={prod.descricao || ""} onChange={(e) => {
                  const val = e.target.value;
                  setProdutos(prev => ({...prev, [cat]: {...prev[cat], [id]: {...prev[cat][id], descricao: val }}}));
                }} />

                <div className="flex items-center gap-1 mb-2 bg-white border border-gray-200 p-1 rounded-md">
                   <DollarSign size={14} className="text-green-600" />
                   <input className="input" style={{margin:0, border:'none', fontWeight:'bold'}} type="number" step="0.01" value={prod.preco || ""} onChange={(e) => {
                      const val = e.target.value;
                      setProdutos(prev => ({...prev, [cat]: {...prev[cat], [id]: {...prev[cat][id], preco: val }}}));
                   }} />
                </div>

                <div className="flex justify-between items-center gap-2">
                   <button onClick={() => update(ref(db, `categorias/${cat}/produtos/${id}`), {ativo: !prod.ativo})}>
                     {prod.ativo ? <Eye size={18} color="#2563eb"/> : <EyeOff size={18} color="#9ca3af"/>}
                   </button>

                   <div className="flex gap-1 flex-1 justify-end">
                     <button className="btn-export" title="Editar" onClick={() => salvarProd(cat, id)}><Edit size={16}/></button>
                     <button className="btn-yellow" title="Salvar" onClick={() => salvarProd(cat, id)}><Save size={16}/></button>
                     <button className="btn-red" title="Excluir Produto" onClick={() => removerProd(cat, id, prod.nome)}><Trash2 size={16}/></button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}