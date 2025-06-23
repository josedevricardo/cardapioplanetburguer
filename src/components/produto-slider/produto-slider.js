import React, { useState, useContext, useEffect } from "react";
import "./produto-slider.css";
import {
  produtos,
  lanches,
  omeletes,
  bebidas,
  sucos,
  acrescimo,
  acai,
} from "../../dados";
import { CartContext } from "../../contexts/cart-context";

const ProdutoSlider = ({ busca }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [quantidadeExibida, setQuantidadeExibida] = useState(10);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [mostrarMensagemPedido, setMostrarMensagemPedido] = useState(false);

  const { addToCart, cartItems } = useContext(CartContext);

  const categorias = [
    { nome: "+Pedidos", produtos: produtos },
    { nome: "Artesanal", produtos: lanches },
    { nome: "Omeletes", produtos: omeletes },
    { nome: "Bebidas", produtos: bebidas },
    { nome: "Sucos", produtos: sucos },
    { nome: "Acréscimos", produtos: acrescimo },
    { nome: "Açaí", produtos: acai },
  ];

  const produtosUnificados = categorias.flatMap((cat) =>
    cat.produtos.map((p) => ({ ...p, categoria: cat.nome }))
  );

  const categoriasNomes = ["Todas", ...categorias.map((c) => c.nome)];

  const buscaLower = (busca || "").toLowerCase();

  const produtosFiltradosPorCategoria =
    categoriaFiltro === "Todas"
      ? produtosUnificados
      : produtosUnificados.filter((p) => p.categoria === categoriaFiltro);

  const produtosFiltradosPorBusca = produtosFiltradosPorCategoria.filter(
    (p) =>
      p.nome.toLowerCase().includes(buscaLower) ||
      p.descricao.toLowerCase().includes(buscaLower)
  );

  const produtosExibidos = produtosFiltradosPorBusca.slice(0, quantidadeExibida);

  const formatarPreco = (preco) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(preco);

  const handleClick = (produto) => {
    const item = {
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      foto: produto.foto,
      qtd: 1,
    };
    addToCart(item);
    setMessage(`🍔 "${produto.nome}" adicionado à sacola!`);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const mostrarMais = () => setQuantidadeExibida((prev) => prev + 10);

  const destacarTexto = (texto) => {
    if (!buscaLower) return texto;
    const regex = new RegExp(`(${buscaLower})`, "gi");
    return texto.replace(regex, "<mark>$1</mark>");
  };

  // Mostrar mensagem "faça seu pedido" por 2s a cada 15s
  useEffect(() => {
    const interval = setInterval(() => {
      setMostrarMensagemPedido(true);
      setTimeout(() => setMostrarMensagemPedido(false), 2000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="produto-slider-container">
      {/* Filtro de categorias */}
      <div className="filtro-categorias">
        {categoriasNomes.map((cat) => (
          <button
            key={cat}
            className={cat === categoriaFiltro ? "ativo" : ""}
            onClick={() => {
              setCategoriaFiltro(cat);
              setQuantidadeExibida(10);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Título da categoria */}
      <h2 className="titulo-categoria">
        {categoriaFiltro === "Todas"
          ? "Todos os Produtos"
          : `Categoria: ${categoriaFiltro}`}
      </h2>

      {/* Botão flutuante mobile */}
      <button
        className="botao-flutuante"
        onClick={() => setShowFloatingMenu((prev) => !prev)}
      >
        ☰ Categorias
      </button>

      {/* Submenu colado no botão */}
      {showFloatingMenu && (
        <div className="floating-menu">
          {categoriasNomes.map((cat) => (
            <button
              key={cat}
              className={`floating-item ${cat === categoriaFiltro ? "ativo" : ""}`}
              onClick={() => {
                setCategoriaFiltro(cat);
                setQuantidadeExibida(10);
                setShowFloatingMenu(false);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Mensagem animada a cada 15s */}
      {mostrarMensagemPedido && !showFloatingMenu && (
        <div className="mensagem-pedido">🍔 Já fez seu pedido?</div>
      )}

      {/* Lista de produtos */}
      <div className="produto-slider">
        {produtosExibidos.length === 0 ? (
          <p>Nenhum produto encontrado.</p>
        ) : (
          produtosExibidos.map((produto) => {
            const itemNoCarrinho = cartItems.find((p) => p.id === produto.id);
            const qtd = itemNoCarrinho ? itemNoCarrinho.qtd : 0;

            return (
              <div key={produto.id} className="produto-item">
                <img
                  src={produto.foto || "https://via.placeholder.com/150"}
                  alt={produto.nome}
                  className="produto-imagem"
                />
                <h3
                  dangerouslySetInnerHTML={{
                    __html: destacarTexto(produto.nome),
                  }}
                />
                <p
                  className="text-descricao"
                  dangerouslySetInnerHTML={{
                    __html: destacarTexto(produto.descricao),
                  }}
                />
                <p className="prod-vitrine-preco">
                  {formatarPreco(produto.preco)}
                </p>
                <button
                  className="botao-adicionar"
                  onClick={() => handleClick(produto)}
                >
                  {qtd > 0 ? `Adicionar mais (${qtd}x)` : "Adicionar à Sacola"}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Mostrar mais */}
      {quantidadeExibida < produtosFiltradosPorBusca.length &&
        produtosExibidos.length > 0 && (
          <div className="mostrar-mais-container">
            <button onClick={mostrarMais}>Mostrar mais</button>
          </div>
        )}

      {/* Mensagem "adicionado à sacola" corrigida com span */}
      {showMessage && (
        <div className="message-fixed">
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};

export default ProdutoSlider;
