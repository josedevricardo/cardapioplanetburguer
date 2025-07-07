import React, { useState, useContext, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseConfig"; 
import "./produto-slider.css";
import { CartContext } from "../../contexts/cart-context";


const ProdutoSlider = ({ busca }) => {
  const [categoriasFirebase, setCategoriasFirebase] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [quantidadeExibida, setQuantidadeExibida] = useState(10);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [mostrarMensagemPedido, setMostrarMensagemPedido] = useState(false);

  const { addToCart, cartItems } = useContext(CartContext);

  // 🔄 BUSCA OS DADOS DO FIREBASE (ADAPTADO PARA CATEGORIAS -> PRODUTOS)
 useEffect(() => {
  const categoriasRef = ref(db, "categorias");
  onValue(categoriasRef, (snapshot) => {
    const data = snapshot.val() || {};

    const categoriasFormatadas = Object.entries(data).map(([chave, categoria]) => ({
      nome: categoria.nome || chave,
      produtos: Object.entries(categoria.produtos || {})
        .map(([id, p]) => ({ id, ...p }))
        .filter((p) => p.ativo === undefined || p.ativo === true)
    }));

    // ✅ Ordem desejada das categorias na vitrine
    const ordemManual = ["Home", "Lanches", "Bebidas", "Sucos", "Omeletes", "Acresimos", "Açai"];

    const categoriasOrdenadas = ordemManual
      .map((nome) => categoriasFormatadas.find((cat) => cat.nome === nome))
      .filter(Boolean); // remove qualquer categoria não encontrada

    setCategoriasFirebase(categoriasOrdenadas);
  });
}, []);


  const categorias = categoriasFirebase;
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
      foto: produto.imagem,
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

      {/* Submenu colado ao botão */}
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
                  src={produto.imagem || "https://via.placeholder.com/150"}
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

      {quantidadeExibida < produtosFiltradosPorBusca.length &&
        produtosExibidos.length > 0 && (
          <div className="mostrar-mais-container">
            <button onClick={mostrarMais}>Mostrar mais</button>
          </div>
        )}

      {showMessage && (
        <div className="message-fixed">
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};

export default ProdutoSlider;
