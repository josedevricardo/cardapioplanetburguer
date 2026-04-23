import React, { useEffect, useState, useCallback } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue, update, push, remove } from "firebase/database";
import { Trash2, Search, ImageIcon, Plus, X, Eye, EyeOff, Edit, DollarSign, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/mascote.png";

const styles = `
  body, html { overflow-x: hidden; width: 100%; }
  .admin-container { padding: 15px; max-width: 1200px; margin: 0 auto; font-family: 'Inter', sans-serif; background-color: #f8fafc; min-height: 100vh; }
  
  /* Header Integrado */
  .header-admin { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; gap: 10px; }
  .logo-area { display: flex; align-items: center; gap: 12px; text-decoration: none; }
  .logo { width: 45px; height: 45px; object-fit: contain; }
  
  .titulo-wrapper { display: flex; flex-direction: column; }
  .logotext { font-size: 1.3rem; font-weight: 900; color: #1e293b; line-height: 1.1; }
  .logotext strong { color: #2563eb; }
  .subtitle-admin { text-shadow: none; color: #94a3b8; text-transform: uppercase; font-weight: 800; font-size: 9px; letter-spacing: 2px; margin-top: 2px; }

  .home-icon-link { text-decoration: none; font-size: 1.2rem; padding: 6px 10px; background: white; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .home-icon-link:hover { background: #f1f5f9; transform: translateY(-2px); }

  .btn-voltar { display: flex; align-items: center; gap: 5px; padding: 8px 15px; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; font-weight: 500; color: #64748b; cursor: pointer; }
  
  .controles-topo { display: grid; grid-template-columns: 1fr auto auto; gap: 10px; margin-bottom: 25px; }
  .busca-wrapper { position: relative; }
  .input-busca { width: 100%; padding: 10px 15px 10px 40px; border-radius: 10px; border: 1px solid #e2e8f0; outline: none; }
  .icon-busca { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
  
  .card-categoria { background: #fff; border-radius: 12px; padding: 15px; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
  .titulo-cat { font-size: 1.1rem; font-weight: 800; color: #1e293b; margin: 0; letter-spacing: 0.5px; }
  
  .grid-produtos { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; width: 100%; }
  .card-produto { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px; display: flex; flex-direction: column; gap: 6px; transition: all 0.2s; }
  .img-container { width: 100%; height: 90px; border-radius: 8px; overflow: hidden; background: #f8fafc; display: flex; align-items: center; justify-content: center; border: 1px solid #f1f5f9; }
  .img-admin { width: 100%; height: 100%; object-fit: cover; }
  
  .btn-primary { background: #2563eb; color: white; padding: 10px 18px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
  .btn-mini { padding: 5px; border-radius: 6px; cursor: pointer; border: none; display: flex; align-items: center; justify-content: center; }
  .btn-edit-color { background: #6366f1; color: white; }
  .btn-delete-color { background: #ef4444; color: white; }
  .btn-view-active { background: #10b981; color: white; }
  .btn-view-color { background: #94a3b8; color: white; }

  .mensagem-fixa { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 2000; background: #1e293b; color: white; padding: 12px 24px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2); font-weight: 500; font-size: 14px; }
  .footer-admin { text-align: center; padding: 20px; margin-top: 20px; border-top: 1px solid #e2e8f0; }
  .direitos { color: #94a3b8; text-decoration: none; font-size: 12px; font-weight: 600; }

  @media (max-width: 768px) {
    /* Removido o display:none para o subtitle aparecer no Android */
    .logotext { font-size: 1.1rem; }
    .subtitle-admin { display: block; font-size: 8px; } 
    .admin-container { padding: 10px; }
    .controles-topo { grid-template-columns: 1fr; }
    .grid-produtos { grid-template-columns: repeat(2, minmax(130px, 1fr)); gap: 8px; }
  }
`;

function ModalEditarProduto({ aberto, onClose, produto, cat, onSalvar }) {
  const [dados, setDados] = useState({ nome: "", descricao: "", preco: "", imagem: "" });
  useEffect(() => { if (produto) setDados(produto); }, [produto]);
  if (!aberto || !produto) return null;

  return (
    <div className="fixed inset-0 z-[2001] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <motion.div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-slate-800">Editar Produto</h3>
          <button onClick={onClose} className="p-1 text-slate-400"><X /></button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="img-container mx-auto" style={{height: '110px', width: '110px', border: '2px dashed #e2e8f0'}}>
             <img src={dados.imagem} className="img-admin" style={{objectFit: 'contain'}} alt="" />
          </div>
          <input className="w-full p-2 border rounded" value={dados.nome} onChange={e => setDados({...dados, nome: e.target.value})} placeholder="Nome" />
          <textarea className="w-full p-2 border rounded h-20" value={dados.descricao} onChange={e => setDados({...dados, descricao: e.target.value})} placeholder="Descrição..." />
          <div className="relative">
             <DollarSign size={16} className="absolute left-3 top-3 text-slate-400" />
             <input className="w-full pl-10 p-2 border rounded" type="number" step="0.01" value={dados.preco} onChange={e => setDados({...dados, preco: e.target.value})} />
          </div>
          <button className="btn-primary w-full justify-center py-3" onClick={() => onSalvar(cat, produto.id, dados)}>Atualizar Produto</button>
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
    <div className="fixed inset-0 z-[2001] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
      <motion.div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-xl text-slate-800">Novo Produto</h3>
          <button onClick={onClose} className="text-slate-400"><X /></button>
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
              <select className="flex-1 p-2 border rounded" value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
                <option value="">Selecione Categoria</option>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            ) : (
              <input className="flex-1 p-2 border rounded" placeholder="Nome da nova categoria" value={novaCatNome} onChange={(e) => setNovaCatNome(e.target.value)} required />
            )}
            <button type="button" className="btn-voltar" onClick={() => setMostraInputCat(!mostraInputCat)}>
              {mostraInputCat ? <X size={18}/> : <Plus size={18}/>}
            </button>
          </div>
          <input className="p-2 border rounded" placeholder="Nome do Produto" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <textarea className="p-2 border rounded h-20" placeholder="Descrição..." value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          <div className="relative">
            <DollarSign size={16} className="absolute left-3 top-3 text-slate-400" />
            <input className="w-full pl-10 p-2 border rounded" type="number" step="0.01" placeholder="0.00" value={preco} onChange={(e) => setPreco(e.target.value)} required />
          </div>
          <label className="btn-voltar justify-center border-dashed border-2 py-4 cursor-pointer">
             <ImageIcon size={20} className="text-blue-500" /> 
             <span className="ml-2 font-medium">{imagem ? "Imagem Pronta ✨" : "Anexar Foto"}</span>
             <input type="file" hidden accept="image/*" onChange={(e) => {
               const reader = new FileReader();
               reader.onload = () => setImagem(reader.result);
               reader.readAsDataURL(e.target.files[0]);
             }} />
          </label>
          <button type="submit" className="btn-primary w-full justify-center mt-2 py-3">Criar Produto</button>
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
    });
  };

  const handleAdd = (cat, obj) => {
    update(ref(db, `categorias/${cat}`), { nome: cat }).then(() => {
      push(ref(db, `categorias/${cat}/produtos`), obj).then(() => mostrarMsg("🎉 Produto adicionado!"));
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
        <div className="flex items-center gap-4">
          <Link to="/" className="logo-area">
            <img src={logo} alt="Logo" className="logo" />
            <div className="titulo-wrapper">
              <p className="subtitle-admin">Gerenciamento / Planet´s Burguer</p>
            </div>
          </Link>
          <Link to="/" className="home-icon-link" title="Voltar ao Cardápio">🏠</Link>
        </div>
        <button className="btn-voltar" onClick={() => navigate(-1)}><ArrowLeft size={18}/> Voltar</button>
      </header>

      <div className="controles-topo">
        <div className="busca-wrapper">
          <Search className="icon-busca" size={18} />
          <input className="input-busca" placeholder="Buscar produto..." onChange={(e) => setFiltro(e.target.value.toLowerCase())} />
        </div>
        <div className="flex gap-2">
          <select className="p-2 border rounded bg-white text-slate-700 font-medium" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="">Todas Categorias</option>
            {categoriasKeys.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn-primary shadow-md" onClick={() => setModalAberto(true)}><Plus size={18}/> Novo</button>
        </div>
      </div>

      <ModalAdicionarProduto categorias={categoriasKeys} aberto={modalAberto} onClose={() => setModalAberto(false)} onSalvar={handleAdd} />
      <ModalEditarProduto aberto={!!editandoProd} onClose={() => setEditandoProd(null)} produto={editandoProd?.prod} cat={editandoProd?.cat} onSalvar={salvarProd} />

      {categoriasKeys.filter(c => !filtroCategoria || c === filtroCategoria).map(cat => (
        <div key={cat} className="card-categoria">
          <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-3">
            <h3 className="titulo-cat text-blue-900 uppercase">{cat}</h3>
            <button className="flex items-center gap-1 text-red-500 hover:text-red-700 text-[10px] font-black" onClick={() => { if(window.confirm(`⚠️ Deseja apagar a categoria "${cat}" inteira?`)) remove(ref(db, `categorias/${cat}`)) }}>
              <Trash2 size={12} /> EXCLUIR CATEGORIA
            </button>
          </div>
          
          <div className="grid-produtos">
            {Object.entries(produtos[cat] || {}).filter(([_, p]) => !filtro || p.nome?.toLowerCase().includes(filtro)).map(([id, prod]) => (
              <div key={id} className="card-produto shadow-sm">
                <div className="img-container">
                  {prod.imagem ? <img src={prod.imagem} className="img-admin" alt="" /> : <ImageIcon className="text-slate-200" size={24}/>}
                </div>
                <div className="flex flex-col gap-0.5">
                   <p className="font-extrabold text-slate-800 truncate text-[12px]">{prod.nome}</p>
                   <p className="text-[9px] text-slate-400 truncate leading-tight">{prod.descricao || "Sem descrição"}</p>
                </div>
                <div className="flex justify-between items-center mt-auto bg-slate-50 p-1 rounded-lg">
                   <span className="text-blue-700 font-black text-[11px] ml-1">R$ {parseFloat(prod.preco || 0).toFixed(2)}</span>
                   <div className="flex gap-1">
                     <button className={`btn-mini ${prod.ativo ? 'btn-view-active' : 'btn-view-color'}`} onClick={() => update(ref(db, `categorias/${cat}/produtos/${id}`), {ativo: !prod.ativo})}>
                        {prod.ativo ? <Eye size={14}/> : <EyeOff size={14}/>}
                     </button>
                     <button className="btn-mini btn-edit-color" onClick={() => setEditandoProd({cat, prod: {id, ...prod}})}>
                        <Edit size={14}/>
                     </button>
                     <button className="btn-mini btn-delete-color" onClick={() => { if(window.confirm("🗑️ Apagar este produto?")) remove(ref(db, `categorias/${cat}/produtos/${id}`)) }}>
                        <Trash2 size={14}/>
                     </button>
                   </div>
                </div>
              </div>
            ))}
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