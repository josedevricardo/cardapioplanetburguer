/* global qz */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { ref, onValue, update, set } from "firebase/database";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "firebase/auth";

// Importando seus estilos
import "./stiloPedido.css";
import "./AdminPedidosFooter.css";

const AVISO_ANTIGO_MS = 1000 * 60 * 60 * 24 * 30; 

function formatarDataLocal(data) {
  const d = new Date(data);
  return d.toLocaleString("pt-BR");
}

function tocarAlarmeSonoro() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    [0, 0.25].forEach((delay) => {
      setTimeout(() => {
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(1200, ctx.currentTime);

        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(2400, ctx.currentTime);

        gainNode.gain.setValueAtTime(1.0, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.35);
        osc2.stop(ctx.currentTime + 0.35);
      }, delay * 1000);
    });
  } catch (e) {
    console.error("Erro ao reproduzir som:", e);
  }
}

// Relatório Geral de Caixa
function gerarRelatorioCaixa(pedidos, filtro, total) {
  const janela = window.open("", "PRINT", "width=800,height=600");
  const itensHtml = pedidos.map(p => `
    <tr>
      <td style="border-bottom: 1px solid #ddd; padding: 8px;">${formatarDataLocal(p.data)}</td>
      <td style="border-bottom: 1px solid #ddd; padding: 8px;">${p.nome}</td>
      <td style="border-bottom: 1px solid #ddd; padding: 8px;">${p.pagamento}</td>
      <td style="border-bottom: 1px solid #ddd; padding: 8px;">R$ ${Number(p.total).toFixed(2)}</td>
    </tr>
  `).join("");

  janela.document.write(`
    <html>
      <head>
        <title>Fechamento de Caixa - Planet's Burguer</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          h1 { text-align: center; color: #c0392b; margin-bottom: 5px; }
          .sub { text-align: center; color: #7f8c8d; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #f4f4f4; text-align: left; padding: 10px; border-bottom: 2px solid #000; }
          .resumo { margin-top: 30px; font-size: 1.4rem; text-align: right; border-top: 2px solid #000; padding-top: 10px; color: #27ae60; }
        </style>
      </head>
      <body>
        <h1>Planet's Burguer - Relatório</h1>
        <div class="sub">Filtro aplicado: ${filtro.toUpperCase()} | Gerado em: ${new Date().toLocaleString("pt-BR")}</div>
        <table>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Cliente</th>
              <th>Pagamento</th>
              <th>Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            ${itensHtml}
          </tbody>
        </table>
        <div class="resumo">
          <strong>TOTAL ACUMULADO: R$ ${total.toFixed(2)}</strong>
        </div>
        <script>window.onload = () => { window.print(); window.close(); };</script>
      </body>
    </html>
  `);
  janela.document.close();
}

// 🚀 FUNÇÃO DE IMPRESSÃO TÉRMICA VIA QZ TRAY
async function imprimirPedido(pedido) {
  try {
    const qzLib = window.qz;
    if (!qzLib) {
      alert("QZ Tray não foi carregado corretamente.");
      return;
    }

    if (!qzLib.websocket.isActive()) {
      await qzLib.websocket.connect();
    }

    const config = qzLib.configs.create("default");

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Courier New', Courier, monospace; font-size: 12px; width: 80mm; padding: 5px; }
            .center { text-align: center; }
            .total { font-weight: bold; font-size: 14px; border-top: 1px dashed #000; margin-top: 10px; padding-top: 5px; }
            hr { border: 0; border-top: 1px solid #000; margin: 8px 0; }
          </style>
        </head>
        <body>
          <h2 class="center">PLANET'S BURGUER</h2>
          <p class="center">PEDIDO #${pedido.id.slice(-5).toUpperCase()}</p>
          <hr/>
          <p><strong>DATA:</strong> ${formatarDataLocal(pedido.data)}</p>
          <p><strong>CLIENTE:</strong> ${pedido.nome}</p>
          <p><strong>CONTATO:</strong> ${pedido.telefone}</p>
          <p><strong>ENDEREÇO:</strong> ${pedido.rua}, ${pedido.numero} - ${pedido.bairro}</p>
          <p><strong>PAGAMENTO:</strong> ${pedido.pagamento}</p>
          <hr/>
          <p><strong>ITENS:</strong></p>
          ${(pedido.itens || []).map(i => `<div>${i.qtd}x${i.produto}</div>`).join("")}
          <hr/>
          <p><strong>OBS:</strong> ${pedido.informacoes_adicionais || "Nenhuma"}</p>
          <p class="total center">VALOR TOTAL: R$ ${Number(pedido.total).toFixed(2)}</p>
        </body>
      </html>
    `;

    const data = [
      {
        type: 'pixel',
        format: 'html',
        flavor: 'plain',
        data: htmlContent
      }
    ];

    await qzLib.print(config, data);
    console.log("Cupom enviado diretamente para a impressora via QZ Tray!");

  } catch (err) {
    console.error("Erro ao imprimir via QZ Tray:", err);
    alert("Erro ao imprimir. Certifique-se de que o aplicativo QZ Tray está aberto no seu computador.");
  }
}

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [pedidoEmEdicao, setPedidoEmEdicao] = useState(null);
  const [statusFiltro, setStatusFiltro] = useState("pendente");
  const [notificacao, setNotificacao] = useState(false);
  const [somAtivo, setSomAtivo] = useState(false);
  const [valorOculto, setValorOculto] = useState(true);
  const navigate = useNavigate();

  // Configuração segura executada após o carregamento do componente
  useEffect(() => {
    if (window.qz) {
      window.qz.security.setCertificatePromise(function(resolve) {
        resolve();
      });
      window.qz.security.setSignaturePromise(function() {
        return function(resolve) {
          resolve();
        };
      });
    }
  }, []);

  const ativarSomAudio = () => {
    tocarAlarmeSonoro();
    setSomAtivo(true);
  };

  useEffect(() => {
    const pedidosRef = ref(db, "pedidos");
    const unsubscribe = onValue(pedidosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const agora = Date.now();
        const lista = Object.entries(data)
          .map(([id, p]) => ({ id, ...p, status: p.status || "pendente" }))
          .filter((p) => {
             const dataPedido = new Date(p.data).getTime();
             return !isNaN(dataPedido) && (agora - dataPedido < AVISO_ANTIGO_MS);
          })
          .sort((a, b) => new Date(b.data) - new Date(a.data));
        setPedidos(lista);
      } else {
        setPedidos([]);
      }
      setCarregando(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (pedidos.length > 0) {
      const ultimoPedido = pedidos[0];
      const chave = `alert-${ultimoPedido.id}`;
      if (!localStorage.getItem(chave)) {
        localStorage.setItem(chave, "true");
        setNotificacao(true);
        tocarAlarmeSonoro();

        if (ultimoPedido.status === "pendente") {
          setTimeout(() => {
            imprimirPedido(ultimoPedido);
          }, 500);
        }

        setTimeout(() => setNotificacao(false), 4000);
      }
    }
  }, [pedidos]);

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await update(ref(db, `pedidos/${id}`), { status: novoStatus });
    } catch (e) { alert("Erro ao atualizar!"); }
  };

  const salvarEdicao = async () => {
    if (!pedidoEmEdicao) return;
    try {
      const { id, ...dados } = pedidoEmEdicao;
      dados.total = parseFloat(dados.total);
      await set(ref(db, `pedidos/${id}`), dados);
      setPedidoEmEdicao(null);
    } catch (err) { alert("Erro ao salvar."); }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("adminLogado");
      navigate("/login-admin");
    });
  };

  const pedidosFiltrados = pedidos.filter(p => statusFiltro === "todos" || p.status === statusFiltro);
  const totalValor = pedidosFiltrados.reduce((acc, p) => acc + Number(p.total || 0), 0);

  if (carregando) return <div className="loading">Carregando Pedidos...</div>;

  return (
    <div className="stiloPedido">
      <nav className="navbar2" style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', boxSizing: 'border-box' }}>
        <div className="logoTitulo">
          <span className="tituloPainel">🍔 Delivery BURGUE+A</span>
        </div>
        <div className="navRight">
          <Link to="/admin-estatisticas" className="menu-btn" style={{ background: '#8e44ad' }}>
            📊 Estatísticas
          </Link>
          <Link to="/admin-produtos" className="menu-btn">🛒 Produtos</Link>
          <button className="logoutBtn2" onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '110px', paddingBottom: '40px' }}>
        
        {!somAtivo && (
          <div style={{ background: '#fff3cd', border: '1px solid #ffeeba', color: '#856404', padding: '12px 15px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '0.9rem' }}>
            <span style={{ flex: '1 1 200px', textAlign: 'left', fontWeight: '500' }}>🔔 Alerta sonoro desativado.</span>
            <button 
              onClick={ativarSomAudio}
              style={{ background: '#27ae60', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
            >
              🔊 Habilitar Som Agora
            </button>
          </div>
        )}

        <AnimatePresence>
          {notificacao && (
            <motion.div className="notificacao-topo" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}>
              🔔 Novo pedido recebido! Imprimindo cupom...
            </motion.div>
          )}
        </AnimatePresence>

        <div className="filtros-estatisticas">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)} className="selectFiltro">
              <option value="pendente">Pendentes</option>
              <option value="entregue">Entregues</option>
              <option value="todos">Todos (30 dias)</option>
            </select>
            
            <button 
              onClick={() => gerarRelatorioCaixa(pedidosFiltrados, statusFiltro, totalValor)}
              style={{ padding: '10px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              📄 Fechar Caixa
            </button>
          </div>

          <div className="total-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <span>Total em Tela: <strong>{valorOculto ? "R$ *****" : `R$ ${totalValor.toFixed(2)}`}</strong></span>
            <button 
              onClick={() => setValorOculto(!valorOculto)}
              title={valorOculto ? "Mostrar Valor" : "Ocultar Valor (Privacidade)"}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '0', display: 'flex', alignItems: 'center' }}
            >
              {valorOculto ? "👁️‍🗨️" : "👁️"}
            </button>
          </div>
        </div>

        <div className="pedidosGrid">
          {pedidosFiltrados.map((pedido) => (
            <div key={pedido.id} className={`pedidoCard ${pedido.status}`}>
              <div className="card-topo">
                <strong>{pedido.nome}</strong>
                <span className="data-hora">{formatarDataLocal(pedido.data)}</span>
              </div>
              <p className="txt-endereco">{pedido.rua}, {pedido.numero} - {pedido.bairro}</p>
              
              <div className="lista-itens">
                {pedido.itens?.map((item, index) => (
                  <div key={index} className="item-linha">{item.qtd}x {item.produto}</div>
                ))}
              </div>

              <div className="card-footer">
                <span className="valor-total">R$ {Number(pedido.total).toFixed(2)}</span>
                <div className="card-actions">
                  <button onClick={() => imprimirPedido(pedido)} title="Imprimir Recibo">🖨️</button>
                  <button onClick={() => setPedidoEmEdicao(pedido)} title="Editar Pedido">✏️</button>
                  {pedido.status === "pendente" && (
                    <button className="btn-finalizar" onClick={() => atualizarStatus(pedido.id, "entregue")}>✅ Entregue</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {pedidoEmEdicao && (
          <div className="modal-overlay">
            <div className="modalEditar">
              <h3>Editar Pedido</h3>
              <label>Cliente:</label>
              <input type="text" value={pedidoEmEdicao.nome} onChange={(e) => setPedidoEmEdicao({...pedidoEmEdicao, nome: e.target.value})} />
              <label>Total:</label>
              <input type="number" value={pedidoEmEdicao.total} onChange={(e) => setPedidoEmEdicao({...pedidoEmEdicao, total: e.target.value})} />
              <label>Status:</label>
              <select value={pedidoEmEdicao.status} onChange={(e) => setPedidoEmEdicao({...pedidoEmEdicao, status: e.target.value})}>
                <option value="pendente">Pendente</option>
                <option value="entregue">Entregue</option>
              </select>
              <div className="modal-btns">
                <button className="btn-save" onClick={salvarEdicao}>Salvar</button>
                <button className="btn-cancel" onClick={() => setPedidoEmEdicao(null)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <footer className="footer-admin">
        <a className="direitos" href="https://portfoliojosericardo.netlify.app/" target="_blank" rel="noopener noreferrer">
          @Desenvolvedor Ricardo
        </a>
      </footer>
    </div>
  );
}