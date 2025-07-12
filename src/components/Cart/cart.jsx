import { useEffect, useState, useContext, useRef } from "react";
import { Dock } from "react-dock";
import { motion } from "framer-motion";
import ProdutoCart from "../produto-cart/produto-cart.jsx";
import "./cart.css";
import { CartContext } from "../../contexts/cart-context.jsx";
import InputMask from "react-input-mask";
import back from "../../assets/back.png";

function Cart() {
  const [show, setShow] = useState(false);
  const [bairro, setBairro] = useState("");
  const [nome, setNome] = useState("");
  const [quemRecebe, setQuemRecebe] = useState("");
  const [telefone, setTelefone] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { cartItems, totalCart, clearCart } = useContext(CartContext);

  const pagamentoRef = useRef(null);
  const informacoesAdicionaisRef = useRef(null);

  useEffect(() => {
    window.addEventListener("openSidebar", () => {
      setShow(true);
    });
  }, []);

  const bairrosSemFrete = ["vitoria", "vitoria 2"];
  const bairroFormatado = bairro.trim().toLowerCase();

  let frete = 0;
  if (bairrosSemFrete.includes(bairroFormatado)) {
    frete = 0;
  } else if (bairroFormatado === "industrial") {
    frete = 2;
  } else if (
    bairroFormatado.includes("industrial") ||
    bairroFormatado.includes("cidade industrial")
  ) {
    frete = 3;
  } else {
    frete = 4;
  }

  const bairroExibicao = bairro.trim().toUpperCase();

  function validarCampos() {
    if (!nome || !quemRecebe || !telefone || !rua || !numero || !bairro) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }
    if (cartItems.length === 0) {
      setErrorMessage("Seu carrinho está vazio.");
      return false;
    }
    setErrorMessage("");
    return true;
  }

  function abrirModal() {
    if (validarCampos()) {
      setShow(false);
      setShowModal(true);
    }
  }

  async function enviarPedido() {
    setIsSending(true);
    setShowModal(false);
    setErrorMessage("");
    setSuccessMessage("");

    const numeroPedido = `#${Math.floor(10000 + Math.random() * 90000)}`;
    const pagamento = pagamentoRef.current.value || "Não informado";
    const informacoesAdicionais = informacoesAdicionaisRef.current.value || "Nenhuma";
    const totalComFrete = (parseFloat(totalCart) + frete).toFixed(2);

    const itensFormatados = cartItems.map(item => ({
      produto: item.nome,
      qtd: item.qtd,
      descricao: item.descricao || ""
    }));

    const pedidoParaSalvar = {
      nome,
      quemRecebe,
      telefone,
      rua,
      numero,
      bairro,
      pagamento,
      informacoes_adicionais: informacoesAdicionais,
      itens: itensFormatados,
      total: totalComFrete,
      numeroPedido,
    };

    try {
      const resposta = await fetch("/.netlify/functions/salvarPedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoParaSalvar),
      });

      const dadosResposta = await resposta.json();

      if (resposta.ok) {
        setSuccessMessage("✅ Pedido enviado e salvo com sucesso!");
        console.log(dadosResposta);

        setNome("");
        setQuemRecebe("");
        setTelefone("");
        setRua("");
        setNumero("");
        setBairro("");
        pagamentoRef.current.value = "";
        informacoesAdicionaisRef.current.value = "";
        clearCart();

        const listaProdutos = cartItems.map(item =>
          `- ${item.qtd}x ${item.nome} ${item.descricao ? `(Obs: ${item.descricao})` : ''}`
        ).join("\n");

        const mensagem = `Olá, gostaria de finalizar meu pedido.\n\n` +
          `📌 Número do Pedido: ${numeroPedido}\n` +
          `👤 Nome: ${nome}\n` +
          `🙋 Quem vai receber: ${quemRecebe}\n` +
          `📞 Telefone: ${telefone}\n` +
          `📍 Endereço: Rua ${rua}, Nº ${numero}, Bairro ${bairro}\n` +
          `💳 Forma de Pagamento: ${pagamento}\n\n` +
          `🛒 Meu pedido:\n${listaProdutos}\n\n` +
          `💰 Total com frete: R$ ${totalComFrete.replace(".", ",")}\n` +
          `📝 Informações adicionais: ${informacoesAdicionais}`;

        const numeroWhatsApp = "5538998017215";
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;

        setTimeout(() => {
          window.open(whatsappUrl, "_blank");
          setIsSending(false);
        }, 1200);

      } else {
        setErrorMessage("❌ Erro ao salvar pedido!");
        console.error(dadosResposta);
        setIsSending(false);
      }
    } catch (erro) {
      setErrorMessage("Erro na conexão com o servidor");
      console.error("Erro:", erro);
      setIsSending(false);
    }
  }

  return (
    <>
      <Dock position="right" isVisible={show} fluid={false} size={340} onVisibleChange={(v) => setShow(v)}>
        <motion.div
          className="cart-motion-wrapper"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="text-center">
            <img onClick={() => setShow(false)} src={back} className="cart-btn-close" alt="Fechar" />
            <h1>Meu Pedido</h1>
          </div>

          <div className="formulario-cliente">
            <label>Nome:</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite seu nome" />

            <label>Telefone:</label>
            <InputMask
              mask="(99) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(31) 91234-5678"
            />

            <label>Rua:</label>
            <input value={rua} onChange={(e) => setRua(e.target.value)} placeholder="Digite sua rua" />

            <label>Número:</label>
            <input value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Número da casa" />

            <label>Bairro:</label>
            <input value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Digite seu bairro" />

            <label>Forma de Pagamento:</label>
            <input ref={pagamentoRef} placeholder="Pix, Cartão ou Dinheiro" />

            <label>Informações Adicionais:</label>
            <input ref={informacoesAdicionaisRef} placeholder="Ex. sem cebola - Troco pra 100" />

            <label>Quem recebe:</label>
            <input value={quemRecebe} onChange={(e) => setQuemRecebe(e.target.value)} placeholder="Nome de quem receberá o pedido" />
          </div>

          <div className="lista-produtos">
            {cartItems.map((item) => (
              <ProdutoCart key={item.id} {...item} />
            ))}
          </div>

          <p className="frete-msg">
            {frete === 0
              ? `🚚 Frete grátis para ${bairroExibicao || "BAIRRO INFORMADO"}.`
              : `🚚 Frete aplicado ao bairro ${bairroExibicao || "BAIRRO INFORMADO"}.`}
          </p>

          <div className="footer-cart-valor">
            <span>Total com frete</span>
            <strong>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL"
              }).format(parseFloat(totalCart) + frete)}
            </strong>
          </div>

          {errorMessage && <div className="error-message">❌ {errorMessage}</div>}
          {successMessage && (
            <div className="success-message" style={{
              fontSize: "1.2rem", fontWeight: "700", margin: "1rem 0",
              color: "green", textAlign: "center"
            }}>
              {successMessage}
            </div>
          )}

          <button onClick={abrirModal} className="btn-checkout" disabled={isSending}>
            {isSending ? "Enviando..." : "Finalizar Pedido"}
          </button>
        </motion.div>
      </Dock>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Confirmar Pedido</h2>
            <p>Você deseja realmente finalizar o pedido?</p>
            <div className="modal-buttons">
              <button onClick={() => setShowModal(false)} className="cancel-btn">Cancelar</button>
              <button onClick={enviarPedido} className="confirm-btn" disabled={isSending}>
                {isSending ? (
                  <>
                    <svg className="spinner" viewBox="0 0 50 50">
                      <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                    </svg>
                    Enviando...
                  </>
                ) : (
                  "Confirmar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
