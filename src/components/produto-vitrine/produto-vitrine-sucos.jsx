import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./produto-vitrine2.css";

import { CartContext } from "../../contexts/cart-context";
import { ProdutoContext } from "../../contexts/categoria-context";

const ProdutoVitrine = ({ busca }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [quantidadeExibida, setQuantidadeExibida] = useState(10);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [mostrarMensagemPedido, setMostrarMensagemPedido] = useState(false);

  const { addToCart, cartItems } = useContext(CartContext);
  const { categorias } = useContext(ProdutoContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Exibir mensagem "Vitaminas Baneston" a cada 15s
  useEffect(() => {
    const intervalo = setInterval(() => {
      setMostrarMensagemPedido(true);
      setTimeout(() => setMostrarMensagemPedido(false), 5000);
    }, 15000);
    return () => clearInterval(intervalo);
  }, []);

  const normalizar = (texto) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-");

  useEffect(() => {
    const path = normalizar(location.pathname.replace("/", ""));
    const categoriaEncontrada = categorias.find(
      (cat) => normalizar(cat.nome) === path
    );

    if (categoriaEncontrada) {
      setCategoriaFiltro(categoriaEncontrada.nome);
      setQuantidadeExibida(10);
    } else {
      setCategoriaFiltro("Todas");
    }
  }, [location.pathname, categorias]);

  const produtosUnificados = categorias.flatMap((cat) =>
    Object.entries(cat.produtos || {}).map(([id, p]) => ({
      id,
      ...p,
      categoria: cat.nome,
    }))
  );

  const categoriasNomes = ["Início", "Todas", ...categorias.map((c) => c.nome)];
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
      foto: produto.imagem || produto.foto,
      qtd: 1,
    };
    addToCart(item);

    if (
      produto.nome.toLowerCase().includes("basneton") ||
      produto.nome.toLowerCase().includes("baneston")
    ) {
      // Nenhuma mensagem para esses produtos
    } else {
      setMessage(`"${produto.nome}" adicionado à sacola!`);
    }

    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const mostrarMais = () => setQuantidadeExibida((prev) => prev + 10);

  const destacarTexto = (texto) => {
    if (!buscaLower) return texto;
    const regex = new RegExp(`(${buscaLower})`, "gi");
    return texto.replace(regex, "<mark>$1</mark>");
  };

  return (
    <div className="produto-slider-container">
      {/* Mensagem animada a cada 15s */}
      {mostrarMensagemPedido && !showFloatingMenu && (
        <div className="mensagem-pedido">
          ⚠️ Atenção: Vitaminas Baneston só são entregues junto com outros pedidos.
        </div>
      )}

      {/* Filtro de categorias */}
      <div className="filtro-categorias">
        {categoriasNomes.map((cat) => (
          <button
            key={cat}
            className={cat === categoriaFiltro ? "ativo" : ""}
            onClick={() => {
              if (cat === "Início") {
                navigate("/");
              } else {
                setCategoriaFiltro(cat);
                setQuantidadeExibida(10);
              }
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

      {/* Aviso fixo do Baneston */}
      <div className="aviso-baneston">
        ⚠️ <strong>Vitaminas Baneston</strong> só são entregues junto com outros pedidos.
      </div>

      {/* Menu flutuante (mobile) */}
      <div className="floating-categorias-wrapper">
        <button
          className="botao-flutuante"
          aria-expanded={showFloatingMenu}
          onClick={() => setShowFloatingMenu((prev) => !prev)}
        >
          ☰ Categorias
        </button>

        {showFloatingMenu && (
          <div className="floating-menu">
            {categoriasNomes.map((cat) => (
              <button
                key={cat}
                className={`floating-item ${
                  cat === categoriaFiltro ? "ativo" : ""
                }`}
                onClick={() => {
                  if (cat === "Início") {
                    navigate("/");
                  } else {
                    setCategoriaFiltro(cat);
                    setQuantidadeExibida(10);
                    setShowFloatingMenu(false);
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

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
                  src={
                    produto.imagem || produto.foto || "https://via.placeholder.com/150"
                  }
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
                <p className="prod-vitrine-preco">{formatarPreco(produto.preco)}</p>
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

      {/* Botão mostrar mais */}
      {quantidadeExibida < produtosFiltradosPorBusca.length &&
        produtosExibidos.length > 0 && (
          <div className="mostrar-mais-container">
            <button onClick={mostrarMais}>Mostrar mais</button>
          </div>
        )}

      {/* Mensagem ajustada */}
      {showMessage && (
        <div className="message-fixed">
          <span role="img" aria-label="ícone">
            🍔
          </span>
          <span className="message-texto">{message.trim()}</span>
        </div>
      )}
    </div>
  );
};

export default ProdutoVitrine;
