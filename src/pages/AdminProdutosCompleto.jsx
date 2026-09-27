import React, { useEffect, useState, useCallback } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue, update, push, remove } from "firebase/database";
import { Trash2, Search, ImageIcon, Plus, X, Eye, EyeOff, Edit, DollarSign, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/mascote.png";

const styles = `
  body, html { overflow-x: hidden; width: 100%; margin: 0; padding: 0; }
  .admin-container { padding: 12px; max-width: 1200px; margin: 0 auto; font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #f8fafc; min-height: 100vh; box-sizing: border-box; }
  
  /* Header Integrado */
  .header-admin { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 10px; flex-wrap: wrap; }
  .logo-area { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .logo { width: 40px; height: 40px; object-fit: contain; }
  
  .titulo-wrapper { display: flex; flex-direction: column; }
  .logotext { font-size: 1.1rem; font-weight: 800; color: #0f172a; line-height: 1.1; }
  .logotext strong { color: #2563eb; }
  .subtitle-admin { color: #64748b; text-transform: uppercase; font-weight: 700; font-size: 9px; letter-spacing: 1.2px; margin-top: 2px; }

  .home-icon-link { text-decoration: none; font-size: 1.1rem; padding: 6px 10px; background: white; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
  .home-icon-link:hover { background: #f1f5f9; }

  .btn-voltar { display: flex; align-items: center; gap: 6px; padding: 7px 12px; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.2s; }
  .btn-voltar:hover { background: #f1f5f9; color: #0f172a; }
  
  /* Controles Superiores */
  .controles-topo { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
  @media (min-width: 640px) {
    .controles-topo { display: grid; grid-template-columns: 1fr auto; }
  }

  .busca-wrapper { position: relative; flex: 1; }
  .input-busca { width: 100%; padding: 9px 14px 9px 38px; border-radius: 10px; border: 1px solid #e2e8f0; outline: none; font-size: 13px; background: white; box-sizing: border-box; }
  .input-busca:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
  .icon-busca { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
  
  /* Categorias */
  .card-categoria { background: #fff; border-radius: 14px; padding: 14px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; width: 100%; box-sizing: border-box; }
  .header-cat { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; flex-wrap: wrap; gap: 8px; }
  .titulo-cat { font-size: 0.95rem; font-weight: 800; color: #1e293b; margin: 0; letter-spacing: 0.5px; word-break: break-word; }
  .btn-del-cat { display: flex; align-items: center; gap: 4px; color: #e11d48; background: #fff1f2; border: 1px solid #fecdd3; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; cursor: pointer; transition: background 0.2s; }
  .btn-del-cat:hover { background: #ffe4e6; }

  /* Grid e Cards de Produtos */
  .grid-produtos { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; width: 100%; }
  @media (min-width: 640px) {
    .grid-produtos { grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 12px; }
  }
  
  .card-produto { 
    background: #ffffff; 
    border: 1px solid #e2e8f0; 
    border-radius: 12px; 
    padding: 10px; 
    display: flex; 
    flex-direction: column; 
    justify-content: space-between;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    box-sizing: border-box;
    width: 100%;
  }
  .card-produto:hover { border-color: #cbd5e1; transform: translateY(-1px); }

  /* IMAGEM BEM PEQUENA E CENTRALIZADA (THUMBNAIL) */
  .img-container { 
    width: 50px; 
    height: 50px; 
    border-radius: 8px; 
    overflow: hidden; 
    background: #f8fafc; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    border: 1px solid #e2e8f0;
    flex-shrink: 0;
    margin-bottom: 8px;
  }
  .img-admin { width: 100%; height: 100%; object-fit: cover; }
  
  .btn-primary { background: #2563eb; color: white; padding: 9px 15px; border-radius: 8px; border: none; font-weight: 600; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.2s; }
  .btn-primary:hover { background: #1d4ed8; }

  /* Preço e Ações no Rodapé do Card */
  .card-rodape { margin-top: auto; display: flex; flex-direction: column; gap: 6px; background: #f8fafc; padding: 6px; border-radius: 8px; border: 1px solid #f1f5f9; }
  .preco-badge { color: #15803d; font-weight: 800; font-size: 11px; background: #dcfce7; padding: 2px 6px; border-radius: 5px; width: fit-content; }

  .botoes-card {
    display: flex;
    gap: 4px;
    width: 100%;
  }

  .btn-action-card { 
    flex: 1;
    height: 30px; 
    border-radius: 6px; 
    cursor: pointer; 
    border: none; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    transition: all 0.15s ease;
    min-width: 0;
  }
  .btn-action-card:active { transform: scale(0.92); }

  .btn-view-active { background: #10b981; color: #ffffff; }
  .btn-view-active:hover { background: #059669; }

  .btn-view-color { background: #94a3b8; color: #ffffff; }
  .btn-view-color:hover { background: #64748b; }

  .btn-edit-color { background: #6366f1; color: #ffffff; }
  .btn-edit-color:hover { background: #4f46e5; }

  .btn-delete-color { background: #ef4444; color: #ffffff; }
  .btn-delete-color:hover { background: #dc2626; }

  .mensagem-fixa { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 2000; background: #0f172a; color: white; padding: 10px 20px; border-radius: 10px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.25); font-weight: 600; font-size: 13px; }
  .footer-admin { text-align: center; padding: 20px 0 10px; margin-top: 20px; border-top: 1px solid #e2e8f0; }
  .direitos { color: #64748b; text-decoration: none; font-size: 12px; font-weight: 600; transition: color 0.2s; }
  .direitos:hover { color: #2563eb; }
`;

function ModalEditarProduto({ aberto, onClose, produto, cat, onSalvar }) {
  const [dados, setDados] = useState({ nome: "", descricao: "", preco: "", imagem: "" });
  useEffect(() => { if (produto) setDados(produto); }, [produto]);
  if (!aberto || !produto) return null;

  return (
    <div className="fixed inset-0 z-[2001] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <motion.div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-slate-800">Editar Produto</h3>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="img-container mx-auto" style={{height: '60px', width: '60px', border: '2px dashed #cbd5e1'}}>
             {dados.imagem ? <img src={dados.imagem} className="img-admin" style={{objectFit: 'contain'}} alt="" /> : <ImageIcon className="text-slate-300" size={24}/>}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Nome do produto</label>
            <input className="w-full p-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500" value={dados.nome} onChange={e => setDados({...dados, nome: e.target.value})} placeholder="Ex: X-Burger" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Descrição</label>
            <textarea className="w-full p-2.5 text-sm border border-slate-200 rounded-lg h-20 outline-none focus:border-blue-500" value={dados.descricao} onChange={e => setDados({...dados, descricao: e.target.value})} placeholder="Descrição..." />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Preço (R$)</label>
            <div className="relative">
               <DollarSign size={16} className="absolute left-3 top-3 text-slate-400" />
               <input className="w-full pl-9 p-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500" type="number" step="0.01" value={dados.preco} onChange={e => setDados({...dados, preco: e.target.value})} />
            </div>
          </div>
          <button type="button" className="btn-primary w-full justify-center py-3 mt-2 text-sm" onClick={() => onSalvar(cat, produto.id, dados)}>Atualizar Produto</button>
        </div>
      </motion.div>
    </div>
  );
}

function ModalAdicionarProduto({ categorias, aberto, onClose, onSalvar }) {
  const [categoria, setCategoria] = useState("");
  const [novaCatNome, setNovaCatNome] = useState("");
  const [mostraInputCat, setMostraInputCat] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState("");

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-[2001] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <motion.div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-slate-800">Novo Produto</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          const catFinal = mostraInputCat ? novaCatNome.trim() : categoria;
          if (!catFinal || !nome || !preco) return;
          onSalvar(catFinal, { nome, descricao, preco: parseFloat(preco), imagem, ativo: true });
          onClose();
        }} className="flex flex-col gap-3">
          <div className="flex gap-2">
            {!mostraInputCat ? (
              <select className="flex-1 p-2.5 text-sm border border-slate-200 rounded-lg bg-white" value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
                <option value="">Selecione Categoria</option>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            ) : (
              <input className="flex-1 p-2.5 text-sm border border-slate-200 rounded-lg outline-none" placeholder="Nome da nova categoria" value={novaCatNome} onChange={(e) => setNovaCatNome(e.target.value)} required />
            )}
            <button type="button" className="btn-voltar px-3" onClick={() => setMostraInputCat(!mostraInputCat)}>
              {mostraInputCat ? <X size={18}/> : <Plus size={18}/>}
            </button>
          </div>
          <input className="p-2.5 text-sm border border-slate-200 rounded-lg outline-none" placeholder="Nome do Produto" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <textarea className="p-2.5 text-sm border border-slate-200 rounded-lg h-20 outline-none" placeholder="Descrição do produto..." value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          <div className="relative">
            <DollarSign size={16} className="absolute left-3 top-3 text-slate-400" />
            <input className="w-full pl-9 p-2.5 text-sm border border-slate-200 rounded-lg outline-none" type="number" step="0.01" placeholder="0.00" value={preco} onChange={(e) => setPreco(e.target.value)} required />
          </div>
          <label className="btn-voltar justify-center border-dashed border-2 py-3.5 cursor-pointer bg-slate-50 border-slate-200 hover:bg-slate-100">
             <ImageIcon size={20} className="text-blue-600" /> 
             <span className="ml-2 text-xs font-semibold text-slate-700">{imagem ? "Imagem Selecionada ✨" : "Anexar Imagem"}</span>
             <input type="file" hidden accept="image/*" onChange={(e) => {
               const reader = new FileReader();
               reader.onload = () => setImagem(reader.result);
               if(e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
             }} />
          </label>
          <button type="submit" className="btn-primary w-full justify-center mt-2 py-3 text-sm">Criar Produto</button>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminProdutosCompleto() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState({});
  const [filtro, setFiltro] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoProd, setEditandoProd] = useState(null);

  const mostrarMsg = useCallback((t) => { setMensagem(t); setTimeout(() => setMensagem(""), 3000); }, []);

  useEffect(() => {
    const unsub = onValue(ref(db, "categorias"), (s) => {
      const data = s.val() || {};
      const reorg = {};
      Object.entries(data).forEach(([cat, d]) => { reorg[cat] = d.produtos || {}; });
      setProdutos(reorg);
    });
    return () => unsub();
  }, []);

  const salvarProd = (cat, id, dados) => {
    update(ref(db, `categorias/${cat}/produtos/${id}`), dados).then(() => {
      mostrarMsg("✨ Alterações salvas!");
      setEditandoProd(null);
    }).catch(err => {
      console.error(err);
      mostrarMsg("⚠️ Erro ao salvar. Verifique o login.");
    });
  };

  const handleAdd = (cat, obj) => {
    update(ref(db, `categorias/${cat}`), { nome: cat }).then(() => {
      push(ref(db, `categorias/${cat}/produtos`), obj).then(() => mostrarMsg("🎉 Produto adicionado!"));
    });
  };

  const alternarVisibilidade = (cat, id, statusAtual) => {
    const novoStatus = !statusAtual;

    update(ref(db, `categorias/${cat}/produtos/${id}`), { ativo: novoStatus })
      .then(() => {
        mostrarMsg(novoStatus ? "👁️ Produto Visível!" : "🙈 Produto Oculto!");
      })
      .catch((err) => {
        console.error("Erro Firebase:", err);
        mostrarMsg("⚠️ Erro de permissão ao alterar status!");
      });
  };

  const categoriasKeys = Object.keys(produtos);

  return (
    <div className="admin-container">
      <style>{styles}</style>
      
      <AnimatePresence>
        {mensagem && (
          <motion.div initial={{opacity:0, y:-30}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="mensagem-fixa">
            {mensagem}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="header-admin">
        <div className="flex items-center gap-3">
          <Link to="/" className="logo-area">
            <img src={logo} alt="Logo" className="logo" />
            <div className="titulo-wrapper">
              <p className="subtitle-admin">Gerenciamento / Planet´s Burguer</p>
            </div>
          </Link>
          <Link to="/" className="home-icon-link" title="Voltar ao Cardápio">🏠</Link>
        </div>
        <button type="button" className="btn-voltar" onClick={() => navigate(-1)}><ArrowLeft size={16}/> Voltar</button>
      </header>

      <div className="controles-topo">
        <div className="busca-wrapper">
          <Search className="icon-busca" size={18} />
          <input className="input-busca" placeholder="Buscar produto..." onChange={(e) => setFiltro(e.target.value.toLowerCase())} />
        </div>
        <div className="flex gap-2">
          <select className="p-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 font-semibold outline-none flex-1 sm:flex-none" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="">Todas Categorias</option>
            {categoriasKeys.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="button" className="btn-primary shadow-sm" onClick={() => setModalAberto(true)}><Plus size={18}/> Novo</button>
        </div>
      </div>

      <ModalAdicionarProduto categorias={categoriasKeys} aberto={modalAberto} onClose={() => setModalAberto(false)} onSalvar={handleAdd} />
      <ModalEditarProduto aberto={!!editandoProd} onClose={() => setEditandoProd(null)} produto={editandoProd?.prod} cat={editandoProd?.cat} onSalvar={salvarProd} />

      {categoriasKeys.filter(c => !filtroCategoria || c === filtroCategoria).map(cat => (
        <div key={cat} className="card-categoria">
          <div className="header-cat">
            <h3 className="titulo-cat text-blue-900 uppercase">{cat}</h3>
            <button 
              type="button" 
              className="btn-del-cat" 
              onClick={() => { if(window.confirm(`⚠️ Deseja apagar a categoria "${cat}" inteira?`)) remove(ref(db, `categorias/${cat}`)) }}
            >
              <Trash2 size={12} /> EXCLUIR CATEGORIA
            </button>
          </div>
          
          <div className="grid-produtos">
            {Object.entries(produtos[cat] || {}).filter(([_, p]) => !filtro || p.nome?.toLowerCase().includes(filtro)).map(([id, prod]) => {
              const isAtivo = prod.ativo !== false && prod.ativo !== "false";

              return (
                <div key={id} className="card-produto shadow-sm">
                  <div>
                    {/* Imagem agora é um thumbnail pequeno e quadrado dentro do card */}
                    <div className="img-container">
                      {prod.imagem ? (
                        <img src={prod.imagem} className="img-admin" alt={prod.nome} />
                      ) : (
                        <ImageIcon className="text-slate-300" size={18} />
                      )}
                    </div>

                    <div className="flex flex-col gap-0.5 my-1.5">
                      <p className="font-extrabold text-slate-800 truncate text-[12px]" title={prod.nome}>{prod.nome}</p>
                      <p className="text-[9px] text-slate-400 truncate leading-tight" title={prod.descricao}>{prod.descricao || "Sem descrição"}</p>
                    </div>
                  </div>

                  <div className="card-rodape">
                    <span className="preco-badge">R$ {parseFloat(prod.preco || 0).toFixed(2).replace('.', ',')}</span>
                    <div className="botoes-card">
                      <button 
                        type="button"
                        className={`btn-action-card ${isAtivo ? 'btn-view-active' : 'btn-view-color'}`} 
                        onClick={() => alternarVisibilidade(cat, id, isAtivo)}
                        title={isAtivo ? "Visível na vitrine" : "Oculto na vitrine"}
                      >
                        {isAtivo ? <Eye size={14}/> : <EyeOff size={14}/>}
                      </button>

                      <button 
                        type="button"
                        className="btn-action-card btn-edit-color" 
                        onClick={() => setEditandoProd({cat, prod: {id, ...prod}})}
                        title="Editar Produto"
                      >
                        <Edit size={14}/>
                      </button>

                      <button 
                        type="button"
                        className="btn-action-card btn-delete-color" 
                        onClick={() => { if(window.confirm("🗑️ Apagar este produto?")) remove(ref(db, `categorias/${cat}/produtos/${id}`)) }}
                        title="Apagar Produto"
                      >
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <footer className="footer-admin">
        <a className="direitos" href="https://portfoliojosericardo.netlify.app/" target="_blank" rel="noopener noreferrer">
          @Desenvolvedor Ricardo
        </a>
      </footer>
    </div>
  );
}