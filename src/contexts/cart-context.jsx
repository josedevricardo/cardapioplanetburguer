import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [totalCart, setTotalCart] = useState(0);

  // Carrega do localStorage
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem("carrinho");
    const pedidosSalvos = localStorage.getItem("pedidos");

    if (carrinhoSalvo) {
      setCartItems(JSON.parse(carrinhoSalvo));
    }

    if (pedidosSalvos) {
      setPedidos(JSON.parse(pedidosSalvos));
    }
  }, []);

  // Atualiza total e salva carrinho
  useEffect(() => {
  localStorage.setItem("carrinho", JSON.stringify(cartItems));

  const total = cartItems.reduce((acc, item) => {
    let preco = item.preco;
    if (typeof preco === "string") {
      preco = parseFloat(preco.replace(",", "."));
    }
    const qtd = parseInt(item.qtd) || 0;
    return acc + (preco || 0) * qtd;
  }, 0);

  setTotalCart(total);
}, [cartItems]);


  // Atualiza pedidos
  useEffect(() => {
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
  }, [pedidos]);

  const addToCart = (item) => {
    let preco = item.preco;

    if (typeof preco === "string") {
      preco = parseFloat(preco.replace(",", "."));
    }

    setCartItems((prev) => {
      const existente = prev.find((p) => p.id === item.id);

      if (existente) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qtd: p.qtd + 1 } : p
        );
      }

      return [...prev, { ...item, preco: preco || 0, qtd: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qtd: item.qtd - 1 } : item
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
