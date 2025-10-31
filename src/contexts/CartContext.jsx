// src/contexts/cart-context.jsx
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  // Carregar carrinho e pedidos do localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const savedPedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    setCart(savedCart);
    setPedidos(savedPedidos);
  }, []);

  // Salvar carrinho sempre que muda
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Adicionar item — garantindo preço numérico
  const addToCart = (item) => {
    const precoNumerico = parseFloat(item.preco.toString().replace(",", "."));

    const exists = cart.find((p) => p.id === item.id);
    if (exists) {
      setCart(
        cart.map((p) =>
          p.id === item.id
            ? { ...p, qtd: p.qtd + 1 }
            : p
        )
      );
    } else {
      setCart([...cart, { ...item, preco: precoNumerico, qtd: 1 }]);
    }
  };

  // Remover item
  const removeFromCart = (id) => {
    const updated = cart.filter((p) => p.id !== id);
    setCart(updated);
  };

  // Limpar carrinho
  const clearCart = () => {
    setCart([]);
  };

  // ✅ Total corrigido (conversão garantida)
  const total = cart.reduce((acc, item) => {
    const preco = parseFloat(item.preco.toString().replace(",", "."));
    return acc + preco * (item.qtd || 1);
  }, 0);

  // Enviar pedido
  const enviarPedido = (dadosCliente) => {
    const textoItens = cart
      .map((item) => `${item.qtd}x ${item.nome}`)
      .join(", ");

    const mensagem = `🚀 *Novo Pedido* \n
🧑 Cliente: ${dadosCliente.nome}
📍 Endereço: ${dadosCliente.endereco}
📝 Itens: ${textoItens}
💰 Total: R$ ${total.toFixed(2).replace(".", ",")}
✅ Pedido realizado via site.`;

    // WhatsApp
    const link = `https://api.whatsapp.com/send?phone=5531984676843&text=${encodeURIComponent(
      mensagem
    )}`;
    window.open(link);

    // Painel (localStorage)
    const novoPedido = {
      id: Date.now(),
      nome: dadosCliente.nome,
      endereco: dadosCliente.endereco,
      itens: textoItens,
      total: total.toFixed(2),
      status: "Pendente",
    };

    const atualizados = [...pedidos, novoPedido];
    setPedidos(atualizados);
    localStorage.setItem("pedidos", JSON.stringify(atualizados));

    clearCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        total,
        enviarPedido,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
