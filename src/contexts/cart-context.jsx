import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

// --- Sanitizar preço ---
const sanitizePrice = (raw) => {
  if (raw === null || raw === undefined) return 0;
  if (typeof raw === "number") return raw;

  if (typeof raw === "string") {
    const cleaned = raw.replace(/[^\d,.-]/g, "").replace(",", ".");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }

  return 0;
};

// --- Sanitizar item ---
const sanitizeCartItem = (item) => {
  if (!item) return null;

  const preco = sanitizePrice(item.preco ?? item.price ?? 0);
  const qtd = Number.isInteger(item.qtd) ? item.qtd : parseInt(item.qtd) || 1;
  const nome = item.nome || item.name || "";
  const id = item.id || nome;
  const foto =
    item.foto ||
    item.imagem ||
    item.url ||
    item.image ||
    "/img/default.png";

  return { ...item, id, nome, preco, qtd, foto };
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [totalCart, setTotalCart] = useState(0);

  // Carregar localStorage
  useEffect(() => {
    try {
      const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
      const pedidosLS = JSON.parse(localStorage.getItem("pedidos") || "[]");

      setCartItems(carrinho.map(sanitizeCartItem).filter(Boolean));
      setPedidos(Array.isArray(pedidosLS) ? pedidosLS : []);
    } catch {
      localStorage.removeItem("carrinho");
      localStorage.removeItem("pedidos");
    }
  }, []);

  // Atualizar total
  useEffect(() => {
    const sanitized = cartItems.map(sanitizeCartItem);

    const total = sanitized.reduce((acc, item) => {
      return acc + sanitizePrice(item.preco) * (parseInt(item.qtd) || 0);
    }, 0);

    setTotalCart(Number(total.toFixed(2)));
    localStorage.setItem("carrinho", JSON.stringify(sanitized));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  }, [pedidos]);

  // Adicionar
  const addToCart = (item) => {
    const id = item.id || item.nome;

    setCartItems((prev) => {
      const existente = prev.find((p) => p.id === id);

      if (existente) {
        return prev.map((p) =>
          p.id === id ? { ...p, qtd: (parseInt(p.qtd) || 1) + 1 } : p
        );
      }

      return [...prev, sanitizeCartItem({ ...item, qtd: 1 })];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, qtd: (parseInt(item.qtd) || 1) - 1 }
            : item
        )
        .filter((item) => item.qtd > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setTotalCart(0);
    localStorage.removeItem("carrinho");
  };

  const adicionarPedido = (pedido) => {
    const numeroPedido = Date.now();
    const novo = { ...pedido, numeroPedido };

    setPedidos((prev) => [...prev, novo]);
    clearCart();
  };

  const removerPedido = (numeroPedido) => {
    setPedidos((prev) =>
      prev.filter((p) => p.numeroPedido !== numeroPedido)
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