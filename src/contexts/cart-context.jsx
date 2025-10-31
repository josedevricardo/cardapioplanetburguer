// src/contexts/cart-context.jsx
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

// --- Função para limpar e converter preços ---
const sanitizePrice = (raw) => {
  if (raw === null || raw === undefined) return 0;
  if (typeof raw === "number") return raw;
  if (typeof raw === "string") {
    // remove R$, espaços e vírgulas
    const cleaned = raw.replace(/[^\d,.-]/g, "").replace(",", ".");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

// --- Função para limpar item do carrinho ---
const sanitizeCartItem = (item) => {
  if (!item) return null;
  const preco = sanitizePrice(item.preco ?? item.price ?? 0);
  const qtd = Number.isInteger(item.qtd) ? item.qtd : parseInt(item.qtd) || 1;
  const nome = item.nome || item.name || "";
  const id = item.id || nome; // fallback seguro
  return { ...item, id, nome, preco, qtd };
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [totalCart, setTotalCart] = useState(0);

  // Carrega do localStorage
  useEffect(() => {
    try {
      const carrinhoSalvo = localStorage.getItem("carrinho");
      const pedidosSalvos = localStorage.getItem("pedidos");

      if (carrinhoSalvo) {
        const parsed = JSON.parse(carrinhoSalvo);
        if (Array.isArray(parsed)) {
          setCartItems(parsed.map(sanitizeCartItem).filter(Boolean));
        }
      }

      if (pedidosSalvos) {
        const parsedP = JSON.parse(pedidosSalvos);
        if (Array.isArray(parsedP)) setPedidos(parsedP);
      }
    } catch (err) {
      console.error("Erro ao carregar carrinho/pedidos:", err);
      localStorage.removeItem("carrinho");
      localStorage.removeItem("pedidos");
    }
  }, []);

  // Atualiza total e salva carrinho
  useEffect(() => {
    const sanitized = cartItems.map(sanitizeCartItem);
    localStorage.setItem("carrinho", JSON.stringify(sanitized));

    // cálculo preciso do total
    const total = sanitized.reduce((acc, item) => {
      const preco = sanitizePrice(item.preco);
      const qtd = parseInt(item.qtd) || 0;
      return acc + preco * qtd;
    }, 0);

    setTotalCart(Number(total.toFixed(2)));
  }, [cartItems]);

  // Persistir pedidos
  useEffect(() => {
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  }, [pedidos]);

  // Adiciona item (usa nome ou id como chave)
  const addToCart = (item) => {
    const precoSan = sanitizePrice(item.preco ?? item.price ?? 0);
    const nome = item.nome || item.name || "";
    const id = item.id || nome;

    setCartItems((prev) => {
      const prevSan = prev.map(sanitizeCartItem);
      const existente = prevSan.find((p) => p.id === id);

      if (existente) {
        // Atualiza quantidade
        return prevSan.map((p) =>
          p.id === id ? { ...p, qtd: (parseInt(p.qtd) || 1) + 1 } : p
        );
      }

      // Novo item
      const novo = sanitizeCartItem({ ...item, id, nome, preco: precoSan, qtd: 1 });
      return [...prevSan, novo];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qtd: (parseInt(item.qtd) || 1) - 1 } : item
        )
        .map(sanitizeCartItem)
        .filter((item) => item && item.qtd > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setTotalCart(0);
    localStorage.removeItem("carrinho");
  };

  const adicionarPedido = (pedido) => {
    const numeroPedido = Date.now();
    const novoPedido = { ...pedido, numeroPedido };
    setPedidos((prev) => [...prev, novoPedido]);
    clearCart();
  };

  const removerPedido = (numeroPedido) => {
    setPedidos((prev) =>
      prev.filter((pedido) => pedido.numeroPedido !== numeroPedido)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        clearCart,
        totalCart,
        pedidos,
        adicionarPedido,
        removerPedido,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
