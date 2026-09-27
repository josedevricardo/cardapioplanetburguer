import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import "./AdminEstatisticas.css";

function AdminEstatisticas() {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const pedidosRef = ref(db, "pedidos");
    const unsubscribe = onValue(pedidosRef, (snapshot) => {
      const data = snapshot.val();
      const lista = data
        ? Object.entries(data).map(([id, p]) => ({ id, ...p }))
        : [];
      setPedidos(lista);
    });
    return () => unsubscribe();
  }, []);

  // 1. Agrupamento por Hora (Hoje)
  function agruparPorHora(pedidos) {
    const hoje = new Date().toDateString();
    const agrupado = {};

    pedidos.forEach((p) => {
      if (!p.data) return;
      const data = new Date(p.data);
      if (data.toDateString() !== hoje) return;

      const hora = data.getHours().toString().padStart(2, "0") + "h";
      if (!agrupado[hora]) {
        agrupado[hora] = { hora, pedidos: 0, total: 0 };
      }
      agrupado[hora].pedidos += 1;
      agrupado[hora].total += parseFloat(p.total || 0);
    });

    return Object.values(agrupado).sort((a, b) =>
      a.hora.localeCompare(b.hora)
    );
  }

  // 2. Agrupamento por Dia (Últimos dias)
  function agruparPorDia(pedidos) {
    const agrupado = {};

    pedidos.forEach((p) => {
      if (!p.data) return;
      const dataObj = new Date(p.data);
      if (isNaN(dataObj)) return;

      const dia = dataObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      if (!agrupado[dia]) {
        agrupado[dia] = { dia, pedidos: 0, total: 0 };
      }
      agrupado[dia].pedidos += 1;
      agrupado[dia].total += parseFloat(p.total || 0);
    });

    return Object.values(agrupado).slice(-15); // Exibe os últimos 15 dias para manter o gráfico limpo
  }

  // 3. Agrupamento Mensal
  function agruparPorMes(pedidos) {
    const agrupado = {};

    pedidos.forEach((p) => {
      if (!p.data) return;
      const dataObj = new Date(p.data);
      if (isNaN(dataObj)) return;

      const mesAno = dataObj.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
      if (!agrupado[mesAno]) {
        agrupado[mesAno] = { mes: mesAno, pedidos: 0, total: 0 };
      }
      agrupado[mesAno].pedidos += 1;
      agrupado[mesAno].total += parseFloat(p.total || 0);
    });

    return Object.values(agrupado);
  }

  const dadosHora = agruparPorHora(pedidos);
  const dadosDia = agruparPorDia(pedidos);
  const dadosMes = agruparPorMes(pedidos);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("adminLogado");
        localStorage.removeItem("token");
        navigate("/login-admin", { replace: true });
      })
      .catch((error) => {
        console.error("Erro ao fazer logout:", error);
        alert("Erro ao sair: " + error.message);
      });
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="navpai">
      <header className="navbar2">
        <h2>📊 Estatísticas e Faturamento</h2>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button onClick={handleDownloadPDF} className="btn2" style={{ backgroundColor: "#2563eb" }}>
            📥 Baixar PDF
          </button>
          <button onClick={() => navigate("/admin")} className="btn2">
            ← Voltar
          </button>
          <button onClick={handleLogout} className="logoutBtn2">
            Sair
          </button>
        </div>
      </header>

      <div className="estatisticas-container">
        <div className="estatisticas-header">
          <h2>Painel de Desempenho</h2>
          <p>Acompanhe os pedidos e o faturamento detalhado por hora, dia e mês.</p>
        </div>

        <main style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Gráfico 1: Por Hora (Hoje) */}
          <div className="chart-box">
            <h4 className="text-center" style={{ marginBottom: "16px", color: "#1e293b" }}>
              Desempenho por Hora (Hoje)
            </h4>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dadosHora}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hora" stroke="#64748b" fontSize={12} />
                <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
                <Tooltip formatter={(value, name) => [name === 'total' ? `R$ ${value.toFixed(2)}` : value, name === 'total' ? 'Faturamento' : 'Pedidos']} />
                <Legend />
                <Line type="monotone" dataKey="pedidos" name="Qtd Pedidos" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="total" name="Faturamento (R$)" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 2: Por Dia */}
          <div className="chart-box">
            <h4 className="text-center" style={{ marginBottom: "16px", color: "#1e293b" }}>
              Faturamento e Pedidos por Dia
            </h4>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dadosDia}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="dia" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip formatter={(value, name) => [name === 'total' ? `R$ ${value.toFixed(2)}` : value, name === 'total' ? 'Faturamento' : 'Pedidos']} />
                <Legend />
                <Bar dataKey="pedidos" name="Qtd Pedidos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" name="Faturamento (R$)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 3: Consolidado Mensal */}
          <div className="chart-box">
            <h4 className="text-center" style={{ marginBottom: "16px", color: "#1e293b" }}>
              Consolidado Mensal
            </h4>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dadosMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mes" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip formatter={(value, name) => [name === 'total' ? `R$ ${value.toFixed(2)}` : value, name === 'total' ? 'Faturamento' : 'Pedidos']} />
                <Legend />
                <Bar dataKey="pedidos" name="Qtd Pedidos" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" name="Faturamento (R$)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </main>
      </div>
    </div>
  );
}

export default AdminEstatisticas;