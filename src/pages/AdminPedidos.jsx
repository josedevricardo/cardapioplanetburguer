import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./stiloPedido.css";
import logo from "../assets/mascote.png";

function formatarDataLocal(data) {
  const dataObj = new Date(data); // data já vem no formato ISO com offset, evita Invalid Date
  return dataObj.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

// tem de duração de pedidos no servidor antes de expirar tera uma messaggem avisando
const TEMPO_EXPIRACAO_MS = 22 * 60 * 60 * 1000;
const AVISO_ANTIGO_MS = 20 * 60 * 60 * 1000;

export default function AdminPedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [notificacao, setNotificacao] = useState(false);
  const [pedidoParaImpressao, setPedidoParaImpressao] = useState(null);
  const [imprimindo, setImprimindo] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const ultimoPedidoId = useRef(null);
  const impressoUltimoId = useRef(null);
  const audioRef = useRef(null);
  const entregueRef = useRef(null);
  const printAreaRef = useRef(null);
  const printTimeoutRef = useRef(null);

  const [pedidosEntregues, setPedidosEntregues] = useState(() => {
    const salvos = localStorage.getItem("pedidosEntregues");
    return new Set(salvos ? JSON.parse(salvos) : []);
  });

  useEffect(() => {
    if (pedidos.length > 0) {
      localStorage.setItem("backupPedidos", JSON.stringify(pedidos));
    }
  }, [pedidos]);

  const formatarTextoPedido = useCallback((pedido) => {
    const dataFormatada = formatarDataLocal(pedido.data);
    return `===========================\nPEDIDO #${pedido.id}\n===========================\nCliente: ${pedido.nome} - ${pedido.telefone}\nEndereço: Rua ${pedido.rua}, Nº ${pedido.numero}, Bairro ${pedido.bairro}\nPagamento: ${pedido.pagamento}\nInfo: ${pedido.informacoes_adicionais || "Nenhuma"}\n\nItens:\n${pedido.itens.map((i) => `- ${i.qtd}x ${i.produto}`).join("\n")}\n\nTotal: R$ ${pedido.total}\nData: ${dataFormatada}\nStatus: ${pedido.status || "pendente"}\n===========================`;
  }, []);

  const imprimirPedido = useCallback((pedido) => {
    setNotificacao(true);
    setTimeout(() => {
      setNotificacao(false);
      setPedidoParaImpressao(pedido);
    }, 1000);
  }, []);

  useLayoutEffect(() => {
    if (pedidoParaImpressao && printAreaRef.current) {
      printAreaRef.current.innerText = formatarTextoPedido(pedidoParaImpressao);
      clearTimeout(printTimeoutRef.current);
      setImprimindo(true);
      printTimeoutRef.current = setTimeout(() => {
        window.print();
        setPedidoParaImpressao(null);
        setImprimindo(false);
      }, 300);
    }
  }, [pedidoParaImpressao, formatarTextoPedido]);

  useEffect(() => {
    const buscarPedidos = () => {
      fetch("/.netlify/functions/listarPedidos")
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao buscar pedidos");
          return res.json();
        })
        .then((data) => {
          const agora = Date.now();
          const pedidosFiltradosTempo = data
            .filter((p) => agora - new Date(p.data).getTime() <= TEMPO_EXPIRACAO_MS)
            .map((p) => ({
              ...p,
              status: pedidosEntregues.has(p.id) ? "entregue" : "pendente",
            }));

          if (!carregando && pedidosFiltradosTempo.length > 0) {
            const pedidoNovo = pedidosFiltradosTempo[0];
            const novoUltimoId = pedidoNovo.id;

            if (
              ultimoPedidoId.current &&
              novoUltimoId > ultimoPedidoId.current &&
              impressoUltimoId.current !== novoUltimoId
            ) {
              const som = pedidoNovo.status === "entregue" ? entregueRef : audioRef;
              if (som.current) som.current.play().catch(() => {});
              imprimirPedido(pedidoNovo);
              impressoUltimoId.current = novoUltimoId;
            }

            ultimoPedidoId.current = novoUltimoId;
          } else if (pedidosFiltradosTempo.length > 0) {
            ultimoPedidoId.current = pedidosFiltradosTempo[0].id;
          }

          setPedidos(pedidosFiltradosTempo);
          setCarregando(false);
        })
        .catch((err) => {
          setErro(err.message);
          setCarregando(false);
        });
    };

    buscarPedidos();
    const intervalo = setInterval(buscarPedidos, 5000);
    return () => clearInterval(intervalo);
  }, [carregando, imprimirPedido, pedidosEntregues]);

  const marcarComoEntregue = async (id) => {
  try {
    const res = await fetch('/.netlify/functions/atualizarStatusPedido', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'entregue' }),
    });

    const resultado = await res.json();
    if (!res.ok) throw new Error(resultado.error || resultado.message || 'Erro desconhecido');

    // Atualiza o status no frontend/localStorage
    const atualizados = new Set(pedidosEntregues);
    atualizados.add(id);
    setPedidosEntregues(atualizados);
    localStorage.setItem('pedidosEntregues', JSON.stringify([...atualizados]));

    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'entregue' } : p))
    );
  } catch (error) {
    alert('Erro ao atualizar status: ' + error.message);
  }
};


  const salvarComoTxt = (pedido) => {
    const texto = formatarTextoPedido(pedido);
    const blob = new Blob([texto], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedido_${pedido.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pedidosFiltrados = pedidos.filter(
    (p) => statusFiltro === "todos" || p.status === statusFiltro
  );

  const totalPedidos = pedidosFiltrados.length;
  const totalValor = pedidosFiltrados.reduce((acc, p) => acc + Number(p.total), 0);

  const handleLogout = () => {
    localStorage.removeItem("adminLogado");
    navigate("/login-admin");
  };


  const exportarPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "ID",
      "Cliente",
      "Telefone",
      "Endereço",
      "Pagamento",
      "Informações",
      "Itens",
      "Total",
      "Data",
      "Status",
    ];
    const tableRows = pedidosFiltrados.map((p) => [
      p.id,
      p.nome,
      p.telefone,
      `${p.rua}, Nº ${p.numero}, ${p.bairro}`,
      p.pagamento,
      p.informacoes_adicionais || "",
      p.itens.map((i) => `${i.qtd}x ${i.produto}`).join(", "),
      p.total,
      formatarDataLocal(p.data),
      p.status,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.text("Relatório de Pedidos", 14, 15);

    const finalY = doc.lastAutoTable.finalY || 20;
    doc.setFontSize(14);
    doc.text(`Valor Total: R$ ${totalValor.toFixed(2)}`, 14, finalY + 10);

    doc.save("relatorio_pedidos.pdf");
  };

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>Erro: {erro}</p>;

  return (
    <div className="stiloPedido">
        <nav className="navbar2">
    <span className="tituloPainel">Painel Pedidos Delivery</span>
    <div className="navRight">
      <button className="logoutBtn2" onClick={handleLogout}>Sair</button>
      <img src={logo} alt="Logo" className="logoPequeno" />
    </div>
  </nav>
      
      <div className="container">
        <select
          className="selectFiltro"
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="pendente">Pendente</option>
          <option value="entregue">Entregue</option>
        </select>

        {notificacao && !imprimindo && <div className="notification-btn">📦 Novo pedido recebido! 🔔</div>}

        <div className="estatisticas">
          <strong>Total pedidos: </strong> {totalPedidos} <br />
          <strong>Valor total: </strong> R$ {totalValor.toFixed(2)}
        </div>

        <div className="botoesExportar">
          <button className="btn" onClick={exportarPDF}>Exportar PDF</button>
        </div>

        <div className="pedidosGrid">
          {pedidosFiltrados.map((pedido) => {
            const dataPedido = new Date(pedido.data);
            const antigo = Date.now() - dataPedido.getTime() > AVISO_ANTIGO_MS;
            return (
              <div key={pedido.id} className="pedidoCard">
                <p><strong>{pedido.nome}</strong> - {pedido.telefone}</p>
                <p>{pedido.rua}, Nº {pedido.numero}, {pedido.bairro}</p>
                <p>Pagamento: {pedido.pagamento}</p>
                <p>Info: {pedido.informacoes_adicionais || "Nenhuma"}</p>
                <ul>
                  {pedido.itens.map((item, i) => (
                    <li key={i}>{item.qtd}x {item.produto}</li>
                  ))}
                </ul>
                <p>Total: R$ {pedido.total}</p>
                <p>{formatarDataLocal(pedido.data)} {antigo && <span className="avisoAntigo">⚠️ Pedido antigo</span>}</p>
                <p className={`status-${pedido.status}`}>Status: {pedido.status}</p>
                <div className="actions">
                  <button className="btn" onClick={() => imprimirPedido(pedido)}>🖨️ Imprimir</button>
                  <button className="btn" onClick={() => salvarComoTxt(pedido)}>💾 .TXT</button>
                  {pedido.status === "pendente" && (
                    <button className="btnEntregue" onClick={() => marcarComoEntregue(pedido.id)}>✅ Entregue</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div ref={printAreaRef} id="print-area" className="printArea" />
      </div>
    </div>
  );
}
