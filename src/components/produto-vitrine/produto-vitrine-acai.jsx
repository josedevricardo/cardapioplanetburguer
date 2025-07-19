import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./produto-vitrine2.css";

import { CartContext } from "../../contexts/cart-context";
import { ProdutoContext } from "../../contexts/categoria-context";

const ProdutoVitrine = ({ busca }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { categorias } = useContext(ProdutoContext);
  const { addToCart, cartItems } = useContext(CartContext);

  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [quantidadeExibida, setQuantidadeExibida] = useState(10);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  useEffect(() => {
    // Extrai caminho da URL para filtrar categoria
    const path = location.pathname.replace("/", "").toLowerCase();

    const categoriaEncontrada = categorias.find(
      (cat) => cat.nome.toLowerCase() === path
    );

    if (categoriaEncontrada) {
      setCategoriaFiltro(categoriaEncontrada.nome);
      setQuantidadeExibida(10);
    } else {
      setCategoriaFiltro("Todas");
    }
  }, [location.pathname, categorias]);

  // Unifica produtos de todas categorias em um array único
  const produtosUnificados = categorias.flatMap((cat) =>
    Object.entries(cat.produtos || {}).map(([id, p]) => ({
      id,
      ...p,
      categoria: cat.nome,
    }))
  );

  const categoriasNomes = ["Início", "Todas", ...categorias.map((c) => c.nome)];
  const buscaLower = (busca || "").toLowerCase();

  // Filtra produtos conforme categoria selecionada
  const produtosFiltradosPorCategoria =
    categoriaFiltro === "Todas"
      ? produtosUnificados
      : produtosUnificados.filter((p) => p.categoria === categoriaFiltro);

  // Filtra produtos conforme busca
  const produtosFiltradosPorBusca = produtosFiltradosPorCategoria.filter(
    (p) =>
      p.nome.toLowerCase().includes(buscaLower) ||
      p.descricao.toLowerCase().includes(buscaLower)
  );

  const produtosExibidos = produtosFiltradosPorBusca.slice(0, quantidadeExibida);

  // Formata preço em Real brasileiro
  const formatarPreco = (preco) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(preco);

  // Adiciona produto ao carrinho e exibe mensagem temporária
  const handleClick = (produto) => {
    const item = {
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      foto: produto.imagem || produto.foto,
      qtd: 1,
    };
    addToCart(item);
    setMessage(`🍔 "${produto.nome}" adicionado à sacola!`);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  // Aumenta quantidade exibida para mostrar mais produtos
  const mostrarMais = () => setQuantidadeExibida((prev) => prev + 10);

  // Destaca o texto da busca nos nomes e descrições
  const destacarTexto = (texto) => {
    if (!buscaLower) return texto;
    const regex = new RegExp(`(${buscaLower})`, "gi");
    return texto.replace(regex, "<mark>$1</mark>");
  };

  return (
    <div className="produto-slider-container">
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

      <h2 className="titulo-categoria">
        {categoriaFiltro === "Todas"
          ? "Todos os Produtos"
          : `Categoria: ${categoriaFiltro}`}
      </h2>

      <div className="floating-categorias-wrapper">
        <button
          className="botao-flutuante"
          onClick={() => setShowFloatingMenu((prev) => !prev)}
        >
          ☰ Categorias
        </button>

        {showFloatingMenu && (
          <div className="floating-menu">
            {categoriasNomes.map((cat) => (
              <button
                key={cat}
                className={`floating-item ${cat === categoriaFiltro ? "ativo" : ""}`}
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
                  src={produto.imagem || produto.foto || "https://via.placeholder.com/150"}
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
                <button className="botao-adicionar" onClick={() => handleClick(produto)}>
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

      {/* Mensagem flutuante */}
      {showMessage && (
        <div className="message-fixed">
          <span role="img" aria-label="ícone">🍔</span>{" "}
          <span className="message-texto">{message.replace("🍔", "").trim()}</span>
        </div>
      )}
    </div>
  );
};

export default ProdutoVitrine;
