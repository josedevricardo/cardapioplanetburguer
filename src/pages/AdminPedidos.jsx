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
  try {
    if (!data) return "Data inválida";
    const d = new Date(data);
    return isNaN(d.getTime()) ? "Data inválida" : d.toLocaleString("pt-BR");
  } catch {
    return "Data inválida";
  }
}

// 🔍 Função para garantir que o número do pedido seja o mesmo do WhatsApp
function obterNumeroPedido(pedido) {
  if (!pedido) return '00000';
  return pedido.numeroPedido || pedido.codigo || (pedido.id ? pedido.id.slice(-5).toUpperCase() : '00000');
}

function tocarAlarmeSonoro() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    [0, 0.25].forEach((delay) => {
      setTimeout(() => {
        try {
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
        } catch (innerErr) {
          console.error("Erro interno no som:", innerErr);
        }
      }, delay * 1000);
    });
  } catch (e) {
    console.error("Erro ao reproduzir som:", e);
  }
}

// 🚀 FUNÇÃO DE IMPRESSÃO OTIMIZADA (SEM ABOUT:BLANK - VIA BLOB URL)
function imprimirPedido(pedido) {
  try {
    if (!pedido) return;
    
    const numeroCurto = obterNumeroPedido(pedido);

    // 🛠️ Função para remover acentos e evitar que a impressora térmica corte palavras
    const removerAcentos = (str) => {
      if (!str) return '';
      return String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const nomeCliente = removerAcentos(pedido.nome || 'Nao informado');
    const ruaCliente = removerAcentos(pedido.rua || '');
    const numeroCliente = removerAcentos(pedido.numero || '');
    const bairroCliente = removerAcentos(pedido.bairro || '');
    const pagamentoCliente = removerAcentos(pedido.pagamento || 'Nao informado');
    const obsCliente = removerAcentos(pedido.informacoes_adicionais || '');

    const itensHtmlList = (pedido.itens || []).map(i => {
      const quantidade = i.qtd || 1;
      const nomeProduto = removerAcentos(i.produto || 'Item');
      return `
        <tr>
          <td style="width: 15%; text-align: left; padding: 1px 0; font-weight: bold; vertical-align: top;">${quantidade}x</td>
          <td style="width: 85%; text-align: left; padding: 1px 0; vertical-align: top; word-break: break-word; overflow-wrap: break-word;">${nomeProduto}</td>
        </tr>
      `;
    }).join("");

    const conteudoHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Pedido #${numeroCurto}</title>
          <style>
            @page { 
              size: 58mm 500mm; 
              margin: 0mm; 
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact;
            }
            body { 
              font-family: 'Courier New', Courier, monospace; 
              font-size: 9px; 
              line-height: 1.1;
              width: 54mm; 
              max-width: 54mm;
              margin: 0 auto; 
              padding: 2mm 1mm; 
              color: #000;
              background: #fff;
              word-break: break-word;
              overflow-wrap: break-word;
            }
            .titulo { font-size: 11px; font-weight: bold; text-align: center; margin-bottom: 2px; width: 100%; }
            .subtitulo { font-size: 10px; font-weight: bold; text-align: center; margin-bottom: 3px; width: 100%; }
            hr { border: 0; border-top: 1px dashed #000; margin: 2px 0; width: 100%; }
            table { width: 100%; border-collapse: collapse; }
            td { font-size: 9px; vertical-align: top; }
            .linha {
              margin-bottom: 2px;
              width: 100%;
              word-break: break-word;
              overflow-wrap: break-word;
            }
            .bold { font-weight: bold; }
            .obs-box {
              margin: 2px 0;
              word-break: break-word;
              overflow-wrap: break-word;
            }
            .total-box { 
              margin-top: 4px;
              margin-bottom: 0px;
              font-weight: bold; 
              font-size: 10.5px; 
              border-top: 1px dashed #000; 
              border-bottom: 1px dashed #000;
              padding: 3px 0; 
              text-align: center;
              width: 100%;
              page-break-inside: avoid;
              break-inside: avoid;
              page-break-before: avoid;
            }
          </style>
        </head>
        <body>
          <div class="titulo">Burgue+a Delivery</div>
          <div class="subtitulo">Pedido #${numeroCurto}</div>
          <hr/>
          <div class="linha"><b>Data:</b> ${formatarDataLocal(pedido.data)}</div>
          <div class="linha"><b>Cliente:</b> ${nomeCliente}</div>
          <div class="linha"><b>Contato:</b> ${pedido.telefone || 'Nao informado'}</div>
          <div class="linha"><b>Endereco:</b> ${ruaCliente}, ${numeroCliente} - ${bairroCliente}</div>
          <div class="linha"><b>Pagamento:</b> ${pagamentoCliente}</div>
          <hr/>
          <div class="linha bold">Itens:</div>
          <table>
            ${itensHtmlList}
          </table>
          ${obsCliente ? `<hr/><div class="obs-box"><b>Obs:</b> ${obsCliente}</div>` : ''}
          <hr/>
          <div class="total-box">
            TOTAL: R$ ${Number(pedido.total || 0).toFixed(2)}
          </div>

          <script>
            window.onload = () => {
              setTimeout(() => {
                window.focus();
                window.print();
                setTimeout(() => window.close(), 500);
              }, 300);
            };
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([conteudoHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const janela = window.open(url, "_blank", "width=400,height=600");
    
    if (!janela) {
      alert("Permita pop-ups no navegador para realizar a impressão automática.");
      return;
    }

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);

  } catch (err) {
    console.error("Erro ao imprimir:", err);
  }
}

// Relatório Geral de Caixa (Também otimizado sem about:blank)
function gerarRelatorioCaixa(pedidos, filtro, total) {
  try {
    const itensHtml = (pedidos || []).map(p => `
      <tr>
        <td style="border-bottom: 1px solid #ddd; padding: 8px;">${formatarDataLocal(p.data)}</td>
        <td style="border-bottom: 1px solid #ddd; padding: 8px;">#${obterNumeroPedido(p)} - ${p.nome || 'Cliente'}</td>
        <td style="border-bottom: 1px solid #ddd; padding: 8px;">${p.pagamento || '-'}</td>
        <td style="border-bottom: 1px solid #ddd; padding: 8px;">R$ ${Number(p.total || 0).toFixed(2)}</td>
      </tr>
    `).join("");

    const conteudoHtml = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Fechamento de Caixa - Burgue+a Delivery</title>
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
          <h1>Burgue+a Delivery - Relatório de Caixa</h1>
          <div class="sub">Filtro aplicado: ${(filtro || 'todos').toUpperCase()} | Gerado em: ${new Date().toLocaleString("pt-BR")}</div>
          <table>
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Pedido / Cliente</th>
                <th>Pagamento</th>
                <th>Valor (R$)</th>
              </tr>
            </thead>
            <tbody>
              ${itensHtml}
            </tbody>
          </table>
          <div class="resumo">
            <strong>TOTAL ACUMULADO: R$ ${Number(total || 0).toFixed(2)}</strong>
          </div>
          <script>window.onload = () => { window.print(); window.close(); };</script>
        </body>
      </html>
    `;

    const blob = new Blob([conteudoHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const janela = window.open(url, "_blank", "width=800,height=600");

    if (!janela) {
      alert("Permita pop-ups no navegador para gerar o relatório.");
      return;
    }

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);
  } catch (err) {
    console.error("Erro ao gerar relatório:", err);
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

  const ativarSomAudio = () => {
    tocarAlarmeSonoro();
    setSomAtivo(true);
  };

  useEffect(() => {
    try {
      const pedidosRef = ref(db, "pedidos");
      const unsubscribe = onValue(pedidosRef, (snapshot) => {
        try {
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
        } catch (innerErr) {
          console.error("Erro ao processar dados dos pedidos:", innerErr);
          setPedidos([]);
        } finally {
          setCarregando(false);
        }
      }, (error) => {
        console.error("Erro no Firebase:", error);
        setCarregando(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.error("Erro ao conectar ao Firebase:", e);
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    try {
      if (pedidos && pedidos.length > 0) {
        const ultimoPedido = pedidos[0];
        if (ultimoPedido && ultimoPedido.id) {
          const chave = `alert-${ultimoPedido.id}`;
          if (!localStorage.getItem(chave)) {
            localStorage.setItem(chave, "true");
            setNotificacao(true);
            tocarAlarmeSonoro();

            if (ultimoPedido.status === "pendente") {
              setTimeout(() => {
                imprimirPedido(ultimoPedido);
              }, 1000);
            }

            setTimeout(() => setNotificacao(false), 4000);
          }
        }
      }
    } catch (e) {
      console.error("Erro na notificação do último pedido:", e);
    }
  }, [pedidos]);

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await update(ref(db, `pedidos/${id}`), { status: novoStatus });
    } catch (e) { alert("Erro ao atualizar status!"); }
  };

  const salvarEdicao = async () => {
    if (!pedidoEmEdicao) return;
    try {
      const { id, ...dados } = pedidoEmEdicao;
      dados.total = parseFloat(dados.total) || 0;
      await set(ref(db, `pedidos/${id}`), dados);
      setPedidoEmEdicao(null);
    } catch (err) { alert("Erro ao salvar edição."); }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("adminLogado");
      navigate("/login-admin");
    }).catch(() => {
      navigate("/login-admin");
    });
  };

  const pedidosFiltrados = (pedidos || []).filter(p => statusFiltro === "todos" || p.status === statusFiltro);
  const totalValor = pedidosFiltrados.reduce((acc, p) => acc + Number(p.total || 0), 0);

  if (carregando) return <div className="loading">Carregando Pedidos...</div>;

  return (
    <div className="stiloPedido">
      <nav className="navbar2" style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', boxSizing: 'border-box' }}>
        <div className="logoTitulo">
          <span className="tituloPainel">🍔 Burgue+a Delivery</span>
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
        
        {/* Banner para download do configurador automático do Kiosk */}
        <div style={{ background: '#e8f4fd', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #bbe1fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>🖨 Configurar Impressão 100% Automática</h4>
            <p style={{ fontSize: '0.85rem', color: '#555', margin: 0 }}>
              Baixe o configurador para criar o atalho do Chrome com impressão automática no PC do caixa.
            </p>
          </div>
          <a 
            href="/configurar-chrome.bat" 
            download="configurar-chrome.bat"
            style={{ 
              background: '#27ae60', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '5px', 
              textDecoration: 'none', 
              fontWeight: 'bold', 
              fontSize: '0.85rem',
              whiteSpace: 'nowrap'
            }}
          >
            ⚙️ Baixar Configurador Automático
          </a>
        </div>

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
              🔔 Novo pedido recebido! Imprimindo cupom automaticamente...
            </motion.div>
          )}
        </AnimatePresence>

        <div className="filtros-estatisticas">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
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
              {valorOculto ? "👁️‍🗨" : "👁️"}
            </button>
          </div>
        </div>

        <div className="pedidosGrid">
          {pedidosFiltrados.map((pedido) => {
            const numeroPedidoCurto = obterNumeroPedido(pedido);
            return (
              <div key={pedido.id} className={`pedidoCard ${pedido.status}`}>
                <div className="card-topo" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ background: '#2c3e50', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                      #{numeroPedidoCurto}
                    </span>
                    <span className="data-hora">{formatarDataLocal(pedido.data)}</span>
                  </div>
                  <strong style={{ fontSize: '1.1rem', color: '#333', marginTop: '2px' }}>{pedido.nome || 'Cliente'}</strong>
                </div>

                <p className="txt-endereco">{pedido.rua || ''}, {pedido.numero || ''} - {pedido.bairro || ''}</p>
                
                <div className="lista-itens">
                  {(pedido.itens || []).map((item, index) => (
                    <div key={index} className="item-linha">{item.qtd || 1}x {item.produto || 'Item'}</div>
                  ))}
                </div>

                <div className="card-footer">
                  <span className="valor-total">R$ {Number(pedido.total || 0).toFixed(2)}</span>
                  <div className="card-actions">
                    <button onClick={() => imprimirPedido(pedido)} title="Imprimir Recibo">🖨️</button>
                    <button onClick={() => setPedidoEmEdicao(pedido)} title="Editar Pedido">✏️</button>
                    {pedido.status === "pendente" && (
                      <button className="btn-finalizar" onClick={() => atualizarStatus(pedido.id, "entregue")}>✅ Entregue</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Edição de Pedido */}
      <AnimatePresence>
        {pedidoEmEdicao && (
          <div className="modal-overlay">
            <div className="modalEditar">
              <h3>Editar Pedido #{obterNumeroPedido(pedidoEmEdicao)}</h3>
              <label>Cliente:</label>
              <input type="text" value={pedidoEmEdicao.nome || ""} onChange={(e) => setPedidoEmEdicao({...pedidoEmEdicao, nome: e.target.value})} />
              <label>Total:</label>
              <input type="number" value={pedidoEmEdicao.total || 0} onChange={(e) => setPedidoEmEdicao({...pedidoEmEdicao, total: e.target.value})} />
              <label>Status:</label>
              <select value={pedidoEmEdicao.status || "pendente"} onChange={(e) => setPedidoEmEdicao({...pedidoEmEdicao, status: e.target.value})}>
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