import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { db } from "../firebaseConfig";
import { ref, onValue, update, set } from "firebase/database";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./stiloPedido.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import "./AdminPedidosFooter.css";

const AVISO_ANTIGO_MS = 1000 * 60 * 60 * 10; // 10 horas

function formatarDataLocal(data) {
  const d = new Date(data);
  return d.toLocaleString("pt-BR");
}

function formatarTextoPedido(pedido) {
  return `
Pedido ${pedido.numeroPedido || pedido.id}
Cliente: ${pedido.nome}
Telefone: ${pedido.telefone}
Endereço: ${pedido.rua}, Nº ${pedido.numero}, ${pedido.bairro}
Pagamento: ${pedido.pagamento}
Informações: ${pedido.informacoes_adicionais || "Nenhuma"}

Itens:
${(pedido.itens || []).map(i => `${i.qtd}x ${i.produto}`).join("\n")}

Total: R$ ${pedido.total}
Data: ${formatarDataLocal(pedido.data)}
Status: ${pedido.status}
`;
}

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [pedidoEmEdicao, setPedidoEmEdicao] = useState(null);
  const [loadingEditar, setLoadingEditar] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [notificacao, setNotificacao] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const pedidosRef = ref(db, "pedidos");
    const unsubscribe = onValue(
      pedidosRef,
      (snapshot) => {
        const data = snapshot.val();
        const lista = data
          ? Object.entries(data).map(([id, p]) => ({ id, ...p }))
          : [];
        setPedidos(lista);
        setCarregando(false);
        console.log("Pedidos recebidos:", lista);
      },
      (error) => {
        setErro(error.message);
        setCarregando(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Impressão automática do último pedido ao chegar
  useEffect(() => {
    if (pedidos.length === 0) return;

    const ultimo = pedidos[pedidos.length - 1];
    if (!localStorage.getItem(`impresso-${ultimo.id}`)) {
      localStorage.setItem(`impresso-${ultimo.id}`, "true");
      setNotificacao(true);
      imprimirPedido(ultimo);
      setTimeout(() => setNotificacao(false), 4000);
    }
  }, [pedidos]);

  function imprimirPedido(pedido) {
    const janela = window.open("", "PRINT", "width=600,height=600");
    if (!janela) return alert("Bloqueador de pop-up ativado!");

    janela.document.write(`
      <html>
        <head>
          <title>Imprimir Pedido</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            p { font-size: 14px; margin: 5px 0; }
            ul { margin-top: 10px; }
          </style>
        </head>
        <body>
          <h1>Pedido #${pedido.numeroPedido || pedido.id}</h1>
          <p><strong>Cliente:</strong> ${pedido.nome}</p>
          <p><strong>Telefone:</strong> ${pedido.telefone}</p>
          <p><strong>Endereço:</strong> ${pedido.rua}, Nº ${pedido.numero}, ${pedido.bairro}</p>
          <p><strong>Pagamento:</strong> ${pedido.pagamento}</p>
          <p><strong>Informações adicionais:</strong> ${pedido.informacoes_adicionais || "Nenhuma"}</p>
          <h3>Itens:</h3>
          <ul>
            ${(pedido.itens || [])
              .map((item) => `<li>${item.qtd}x ${item.produto}</li>`)
              .join("")}
          </ul>
          <p><strong>Total:</strong> R$ ${pedido.total}</p>
          <p><strong>Data:</strong> ${new Date(pedido.data).toLocaleString("pt-BR")}</p>
        </body>
      </html>
    `);

    janela.document.close();
    janela.focus();
    janela.print();
    //janela.close();
  }

  const marcarComoEntregue = async (id) => {
    try {
      await update(ref(db, `pedidos/${id}`), { status: "entregue" });
      setPedidos((old) =>
        old.map((p) => (p.id === id ? { ...p, status: "entregue" } : p))
      );
    } catch (error) {
      alert("Erro ao atualizar status: " + error.message);
    }
  };

  const abrirEdicao = (pedido) => {
    setPedidoEmEdicao({
      ...pedido,
      itens: (pedido.itens || []).map((i) => ({ ...i })),
      total: Number(pedido.total),
    });
  };

  const fecharEdicao = () => {
    setPedidoEmEdicao(null);
    setLoadingEditar(false);
  };

  const alterarCampo = (campo, valor) => {
    setPedidoEmEdicao((old) => ({ ...old, [campo]: valor }));
  };

  const alterarItem = (index, campo, valor) => {
    setPedidoEmEdicao((old) => {
      const itens = [...old.itens];
      itens[index] = { ...itens[index], [campo]: valor };
      return { ...old, itens };
    });
  };

  const adicionarItem = () => {
    setPedidoEmEdicao((old) => ({
      ...old,
      itens: [...(old.itens || []), { produto: "", qtd: 1 }],
    }));
  };

  const removerItem = (index) => {
    setPedidoEmEdicao((old) => {
      const itens = old.itens.filter((_, i) => i !== index);
      return { ...old, itens };
    });
  };

  const salvarEdicao = async () => {
    if (!pedidoEmEdicao) return;
    setLoadingEditar(true);
    try {
      const { id, ...dados } = pedidoEmEdicao;
      await set(ref(db, `pedidos/${id}`), dados);
      setPedidos((old) =>
        old.map((p) => (p.id === id ? pedidoEmEdicao : p))
      );
      setNotificacao(true);
      setTimeout(() => setNotificacao(false), 3000);
      fecharEdicao();
    } catch (err) {
      alert("Erro ao salvar pedido: " + err.message);
      setLoadingEditar(false);
    }
  };

  const salvarComoTxt = (pedido) => {
    const texto = formatarTextoPedido(pedido);
    const blob = new Blob([texto], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedido_${pedido.numeroPedido || pedido.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pedidosFiltrados = pedidos.filter(
    (p) => statusFiltro === "todos" || p.status === statusFiltro
  );

  const totalPedidos = pedidosFiltrados.length;
  const totalValor = pedidosFiltrados.reduce(
    (acc, p) => acc + Number(p.total || 0),
    0
  );

  const hojeStr = new Date().toDateString();
  const pedidosHoje = pedidos.filter(
    (p) => new Date(p.data).toDateString() === hojeStr
  );
  const totalHoje = pedidosHoje.reduce((acc, p) => acc + Number(p.total || 0), 0);

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
      p.numeroPedido || p.id,
      p.nome,
      p.telefone,
      `${p.rua}, Nº ${p.numero}, ${p.bairro}`,
      p.pagamento,
      p.informacoes_adicionais || "",
      (p.itens || []).map((i) => `${i.qtd}x ${i.produto}`).join(", "),
      p.total,
      formatarDataLocal(p.data),
      p.status,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.text("Relatório de Pedidos", 14, 15);

    const finalY = doc.lastAutoTable.finalY || 20;
    doc.setFontSize(14);
    doc.text(`Valor Total: R$ ${totalValor.toFixed(2)}`, 14, finalY + 10);

    doc.save("relatorio_pedidos.pdf");
  };

  const exportarXLSX = () => {
    const dadosExcel = pedidosFiltrados.map((p) => ({
      ID: p.numeroPedido || p.id,
      Cliente: p.nome,
      Telefone: p.telefone,
      Endereço: `${p.rua}, Nº ${p.numero}, ${p.bairro}`,
      Pagamento: p.pagamento,
      Informações: p.informacoes_adicionais || "",
      Itens: (p.itens || []).map((i) => `${i.qtd}x ${i.produto}`).join(", "),
      Total: p.total,
      Data: formatarDataLocal(p.data),
      Status: p.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pedidos");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "relatorio_pedidos.xlsx");
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("adminLogado");
        navigate("/admin-estatisticas", { replace: true });
      })
      .catch((error) => {
        console.error("Erro ao fazer logout:", error);
        alert("Erro ao sair: " + error.message);
      });
  };

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>Erro: {erro}</p>;

  return (
    <div className="stiloPedido">
    <nav className="navbar2">
      <div className="logoTitulo">
        <div className="logo-pequeno" />
        <span className="tituloPainel">Painel Pedidos Delivery</span>
      </div>

      <div className="navRight">
        <div className="navbar-buttons">
          <Link to="/admin-estatisticas" className="menu-btn">
            📊 Estatísticas
          </Link>
          <Link to="/admin-produtos" className="menu-btn">
            🛒 Produtos
          </Link>
        </div>
        <button className="logoutBtn2" onClick={handleLogout}>
          Sair
        </button>
        
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

        {notificacao && (
          <div className="notification-btn">📦 Novo pedido recebido! 🔔</div>
        )}

        <div className="estatisticas">
          <strong>Total pedidos: </strong> {totalPedidos} <br />
          <strong>Valor total: </strong> R$ {totalValor.toFixed(2)} <br />
          <strong>Pedidos hoje: </strong> {pedidosHoje.length} <br />
          <strong>Valor hoje: </strong> R$ {totalHoje.toFixed(2)}
        </div>

        <div className="botoesExportar">
          <button className="btn" onClick={exportarPDF}>
            Exportar PDF
          </button>
          <button className="btn" onClick={exportarXLSX}>
            Exportar XLSX
          </button>
        </div>

        <div className="pedidosGrid">
          {pedidosFiltrados.map((pedido) => {
            const dataPedido = new Date(pedido.data);
            const antigo = Date.now() - dataPedido.getTime() > AVISO_ANTIGO_MS;
            return (
              <div key={pedido.id} className="pedidoCard">
                <p>
                  <strong>{pedido.nome}</strong> - {pedido.telefone}
                </p>
                <p>
                  {pedido.rua}, Nº {pedido.numero}, {pedido.bairro}
                </p>
                <p>Pagamento: {pedido.pagamento}</p>
                <p>
                  Informações adicionais:{" "}
                  {pedido.informacoes_adicionais || "Nenhuma"}
                </p>
                <ul>
                  {(pedido.itens || []).map((item, i) => (
                    <li key={i}>
                      {item.qtd}x {item.produto}
                    </li>
                  ))}
                </ul>
                <p>Total: R$ {pedido.total}</p>
                <p>
                  {formatarDataLocal(pedido.data)}{" "}
                  {antigo && (
                    <span className="avisoAntigo">⚠️ Pedido antigo</span>
                  )}
                </p>
                <p>
                  <strong>Número do pedido:</strong>{" "}
                  {pedido.numeroPedido || pedido.id}
                </p>
                <p className={`status-${pedido.status}`}>Status: {pedido.status}</p>
                <div className="actions">
                  <button
                    className="btn"
                    onClick={() => salvarComoTxt(pedido)}
                  >
                    💾 .TXT
                  </button>
                  <button
                    className="btnEditar"
                    onClick={() => abrirEdicao(pedido)}
                  >
                    ✏️ Editar
                  </button>
                  {pedido.status === "pendente" && (
                    <button
                      className="btnEntregue"
                      onClick={() => marcarComoEntregue(pedido.id)}
                    >
                      ✅ Entregue
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {pedidoEmEdicao && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="modalEditar"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3>
                  Editar Pedido #{pedidoEmEdicao.numeroPedido || pedidoEmEdicao.id}
                </h3>

                <div className="modal-content">
                  <label>Nome:</label>
                  <input
                    type="text"
                    value={pedidoEmEdicao.nome}
                    onChange={(e) => alterarCampo("nome", e.target.value)}
                  />

                  <label>Telefone:</label>
                  <input
                    type="text"
                    value={pedidoEmEdicao.telefone}
                    onChange={(e) => alterarCampo("telefone", e.target.value)}
                  />

                  <label>Rua:</label>
                  <input
                    type="text"
                    value={pedidoEmEdicao.rua}
                    onChange={(e) => alterarCampo("rua", e.target.value)}
                  />

                  <label>Número:</label>
                  <input
                    type="text"
                    value={pedidoEmEdicao.numero}
                    onChange={(e) => alterarCampo("numero", e.target.value)}
                  />

                  <label>Bairro:</label>
                  <input
                    type="text"
                    value={pedidoEmEdicao.bairro}
                    onChange={(e) => alterarCampo("bairro", e.target.value)}
                  />

                  <label>Pagamento:</label>
                  <input
                    type="text"
                    value={pedidoEmEdicao.pagamento}
                    onChange={(e) => alterarCampo("pagamento", e.target.value)}
                  />

                  <label>Informações adicionais:</label>
                  <input
                    type="text"
                    value={pedidoEmEdicao.informacoes_adicionais}
                    onChange={(e) =>
                      alterarCampo("informacoes_adicionais", e.target.value)
                    }
                  />

                  <h4>Itens</h4>
                  {(pedidoEmEdicao.itens || []).map((item, i) => (
                    <div key={i} className="itemEditar">
                      <input
                        type="text"
                        value={item.produto}
                        onChange={(e) => alterarItem(i, "produto", e.target.value)}
                        placeholder="Produto"
                      />
                      <input
                        type="number"
                        min={1}
                        value={item.qtd}
                        onChange={(e) => alterarItem(i, "qtd", e.target.value)}
                        placeholder="Qtd"
                      />
                      <button
                        className="btnRemover"
                        onClick={() => removerItem(i)}
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                  <button className="btnAdicionar" onClick={adicionarItem}>
                    + Adicionar Item
                  </button>

                  <label>Total:</label>
                  <input
                    type="number"
                    value={pedidoEmEdicao.total}
                    onChange={(e) =>
                      alterarCampo("total", parseFloat(e.target.value) || 0)
                    }
                  />

                  <div className="modal-actions">
                    <button className="btnCancelar" onClick={fecharEdicao}>
                      Cancelar
                    </button>
                    <button
                      className="btnSalvar"
                      onClick={salvarEdicao}
                      disabled={loadingEditar}
                    >
                      {loadingEditar ? "Salvando..." : "Salvar"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rodapé */}
      <footer className="footer text-center">
        <p>
          <a
            className="direitos"
            href="https://portfoliojosericardo.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            @Desenvolvidor Ricardo
          </a>{" "}
          <strong>Planet´s Burguer</strong> R. das Bromélias, 280 Residencial Vitória
        </p>
      </footer>
    </div>
  );
}
