import React, { useEffect, useState, useContext, useRef } from "react";
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
  const [isSending, setIsSending] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { cartItems, totalCart, clearCart } = useContext(CartContext);
  const pagamentoRef = useRef(null);
  const informacoesAdicionaisRef = useRef(null);

  useEffect(() => {
    const handleOpenSidebar = () => setShow(true);
    window.addEventListener("openSidebar", handleOpenSidebar);
    return () => window.removeEventListener("openSidebar", handleOpenSidebar);
  }, []);

  // --- LÓGICA DE FRETE PERSONALIZADA ---
  const bairrosSemFrete = ["vitoria", "vitória", "vitoria 1", "vitória 1", "vitoria 2", "vitória 2"];
  const bairroFormatado = bairro.trim().toLowerCase();
  const bairroExibicao = bairro.trim().toUpperCase();
  
  let frete = 5; // Valor padrão

  if (bairrosSemFrete.includes(bairroFormatado)) {
    frete = 0;
  } else if (bairroFormatado === "industrial") {
    frete = 2;
  } else if (bairroFormatado.includes("industrial") || bairroFormatado.includes("cidade industrial")) {
    frete = 3;
  }

  function validarCampos() {
    if (!nome.trim() || !quemRecebe.trim() || !telefone.trim() || !rua.trim() || !numero.trim() || !bairro.trim()) {
      setErrorMessage("⚠️ Preencha todos os campos obrigatórios.");
      return false;
    }
    return true;
  }

  function prepararConfirmacao() {
    if (validarCampos()) {
      setShow(false);
      setShowModal(true);
    }
  }

  async function enviarPedido() {
    setIsSending(true);
    const numeroPedido = `#${Math.floor(10000 + Math.random() * 90000)}`;
    const pagamento = pagamentoRef.current?.value || "Não informado";
    const informacoes = informacoesAdicionaisRef.current?.value || "Nenhuma";
    const totalComFrete = (parseFloat(totalCart) + frete).toFixed(2);

    const pedidoParaSalvar = {
      nome: nome.trim(),
      quemRecebe: quemRecebe.trim(),
      telefone: telefone.trim(),
      rua: rua.trim(),
      numero: numero.trim(),
      bairro: bairro.trim(),
      pagamento,
      informacoes_adicionais: informacoes,
      itens: cartItems.map(i => ({ 
        produto: i.nome, 
        nome: i.nome, 
        qtd: i.qtd, 
        preco: i.preco 
       })),
      total: parseFloat(totalComFrete),
      numeroPedido
    };

    try {
      const response = await fetch("/.netlify/functions/salvarPedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoParaSalvar),
      });

      if (!response.ok) throw new Error("Erro ao salvar");

      const listaWhats = cartItems.map(i => `- ${i.qtd}x ${i.nome}`).join("\n");
      const msg = `*Pedido: ${numeroPedido}*\n\n👤 *Cliente:* ${nome}\n📞 *Tel:* ${telefone}\n📍 *Endereço:* Rua ${rua}, ${numero}\n🏘️ *Bairro:* ${bairro}\n🙋 *Recebedor:* ${quemRecebe}\n💳 *Pagamento:* ${pagamento}\n📝 *Obs:* ${informacoes}\n\n🛒 *Itens:*\n${listaWhats}\n\n💰 *Total: R$ ${totalComFrete.replace(".", ",")}*`;
      
      window.open(`https://api.whatsapp.com/send?phone=5538998017215&text=${encodeURIComponent(msg)}`, "_blank");

      clearCart();
      setShowModal(false);
    } catch (e) {
      setErrorMessage("❌ Erro ao processar o pedido.");
      setShow(true);
      setShowModal(false);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <Dock position="right" isVisible={show} fluid={false} size={340} onVisibleChange={setShow} style={{ zIndex: 1000 }}>
        <motion.div className="cart-motion-wrapper" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexShrink: 0 }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#111827", margin: 0 }}>Meu Pedido</h1>
            <img onClick={() => setShow(false)} src={back} className="cart-btn-close" alt="Fechar" style={{ cursor: "pointer" }} />
          </div>

          {cartItems.length === 0 ? (
            <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "20px" }}>
              <span style={{ fontSize: "3rem" }}>🛒</span>
              <p style={{ color: "#666", marginTop: "10px", fontWeight: "500" }}>Seu carrinho está vazio.</p>
              <p style={{ fontSize: "0.85rem", color: "#999" }}>Adicione alguns itens para continuar!</p>
            </div>
          ) : (
            <>
              <div className="lista-produtos" style={{ flexGrow: 1, overflowY: "auto", minHeight: "150px", marginBottom: "15px" }}>
                {cartItems.map((item) => (
                  <ProdutoCart 
                    key={item.id}
                    id={item.id}
                    nome={item.nome}
                    preco={item.preco}
                    foto={item.foto}
                    qtd={item.qtd}
                    adicionais={item.adicionais}
                  />
                ))}
              </div>

              <div style={{ flexShrink: 0 }}>
                <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "10px 0" }} />

                <div className="formulario-cliente">
                  <label>Nome Completo</label>
                  <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: João Silva" />
                  
                  <label>WhatsApp</label>
                  <InputMask mask="(99) 99999-9999" value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(38) 99999-9999" />
                  
                  <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ flex: "2" }}>
                      <label>Rua</label>
                      <input value={rua} onChange={e => setRua(e.target.value)} placeholder="Nome da rua" />
                    </div>
                    <div style={{ flex: "1" }}>
                      <label>Nº</label>
                      <input value={numero} onChange={e => setNumero(e.target.value)} placeholder="123" />
                    </div>
                  </div>

                  <label>Bairro</label>
                  <input value={bairro} onChange={e => setBairro(e.target.value)} placeholder="Ex: Centro" />
                  
                  <label>Quem vai receber?</label>
                  <input value={quemRecebe} onChange={e => setQuemRecebe(e.target.value)} placeholder="Ex: Eu mesmo" />

                  <label>Forma de Pagamento</label>
                  <input ref={pagamentoRef} placeholder="Pix, Cartão ou Dinheiro" />
                  
                  <label>Observações</label>
                  <input ref={informacoesAdicionaisRef} placeholder="Ex: Sem cebola, troco para 50..." />
                </div>

                {/* MENSAGEM DE FRETE DINÂMICA */}
                <div className="frete-msg">
                  {frete === 0 
                    ? `🎉 Frete Grátis para ${bairroExibicao || "seu bairro"}!` 
                    : `🛵 Taxa para ${bairroExibicao || "seu bairro"}: R$ ${frete.toFixed(2).replace(".", ",")}`}
                </div>

                <div className="footer-cart-valor">
                  <span>Total Final</span>
                  <strong>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalCart + frete)}</strong>
                </div>

                <button onClick={prepararConfirmacao} className="btn-checkout" disabled={isSending}>
                  {isSending ? "ENVIANDO..." : "FINALIZAR PEDIDO"}
                </button>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
              </div>
            </>
          )}
        </motion.div>
      </Dock>

      {showModal && (
        <div className="modal-overlay" style={{ zIndex: 9999, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-box" style={{ background: 'white', padding: '25px', borderRadius: '12px', maxWidth: '300px', textAlign: 'center' }}>
            <h2>Confirmar Pedido?</h2>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => { setShowModal(false); setShow(true); }} className="cancel-btn" style={{ flex: 1, padding: '10px', cursor: 'pointer' }}>REVISAR</button>
              <button onClick={enviarPedido} className="confirm-btn" style={{ flex: 1, padding: '10px', background: '#22c55e', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>CONFIRMAR</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;