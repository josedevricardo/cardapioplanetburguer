import React, { useEffect, useState } from "react";

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetch("/.netlify/functions/listarPedidos")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar pedidos");
        return res.json();
      })
      .then((data) => {
        setPedidos(data);
        setCarregando(false);
      })
      .catch((err) => {
        setErro(err.message);
        setCarregando(false);
      });
  }, []);

  if (carregando) return <p>Carregando pedidos...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;
  if (pedidos.length === 0) return <p>Nenhum pedido encontrado.</p>;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Painel de Pedidos</h1>
        <button
          onClick={() => {
            localStorage.removeItem("adminLogado");
            window.location.href = "/login-admin";
          }}
          style={{
            background: "#f44336",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          🔓 Sair
        </button>
      </div>

      <hr style={{ margin: "1rem 0" }} />

      {pedidos.map((pedido) => (
        <div
          key={pedido.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
            boxShadow: "0 0 5px rgba(0,0,0,0.1)",
          }}
        >
          <p><strong>Nome:</strong> {pedido.nome}</p>
          <p><strong>Telefone:</strong> {pedido.telefone}</p>
          <p><strong>Endereço:</strong> Rua {pedido.rua}, Nº {pedido.numero}, Bairro {pedido.bairro}</p>
          <p><strong>Pagamento:</strong> {pedido.pagamento}</p>
          <p><strong>Informações adicionais:</strong> {pedido.informacoes}</p>
          <p><strong>Itens:</strong></p>
          <ul>
            {pedido.itens.map((item, i) => (
              <li key={i}>{item.qtd}x {item.produto}</li>
            ))}
          </ul>
          <p><strong>Total:</strong> R$ {pedido.total}</p>
          <p>
            <small>
              <em>
                Pedido feito em:{" "}
                {new Date(pedido.data).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </em>
            </small>
          </p>
        </div>
      ))}
    </div>
  );
}
