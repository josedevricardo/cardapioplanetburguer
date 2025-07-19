import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import {
  LineChart,
  Line,
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

  function agruparPorHora(pedidos) {
    const hoje = new Date().toDateString();
    const agrupado = {};

    pedidos.forEach((p) => {
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

  const dadosHora = agruparPorHora(pedidos);

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

  return (
    <div className="navpai" style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <header className="navbar2" style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>📊 Estatísticas do Dia</h2>
        <div>
          <button onClick={() => navigate("/admin")} className="btn">
            ← Voltar
          </button>
          <button onClick={handleLogout} className="logoutBtn2" style={{ marginLeft: 10 }}>
            Sair
          </button>
        </div>
      </header>

      <main style={{ display: "flex", gap: 30, flexWrap: "wrap", justifyContent: "center" }}>
        <section style={{ flex: "1 1 320px", maxWidth: 600 }}>
          <h4>Pedidos por Hora</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosHora}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pedidos" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section style={{ flex: "1 1 320px", maxWidth: 600 }}>
          <h4>Valor Faturado por Hora (R$)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosHora}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </main>
    </div>
  );
}

export default AdminEstatisticas;
