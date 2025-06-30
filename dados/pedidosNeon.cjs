// dados/pedidosNeon.cjs

const pedidos = [
  {
    id: 1,
    cliente: "João",
    telefone: "11999999999",
    endereco: "Rua A, 123",
    pagamento: "Pix",
    itens: [
      { produto: "Hambúrguer", quantidade: 2, preco: 20 },
      { produto: "Refrigerante", quantidade: 1, preco: 5 }
    ],
    total: 45,
    data: "2025-06-29T15:00:00Z",
    status: "pendente"
  },
  {
    id: 2,
    cliente: "Maria",
    telefone: "11888888888",
    endereco: "Av. B, 456",
    pagamento: "Dinheiro",
    itens: [
      { produto: "Pizza", quantidade: 1, preco: 30 }
    ],
    total: 30,
    data: "2025-06-29T15:30:00Z",
    status: "entregue"
  }
  // ... mais pedidos
];

module.exports = { pedidos };
