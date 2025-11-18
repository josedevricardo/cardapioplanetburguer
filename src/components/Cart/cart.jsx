// src/components/Cart/cart.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { Dock } from "react-dock";
import { motion } from "framer-motion";
import ProdutoCart from "../produto-cart/produto-cart.jsx";
import "./cart.css";
import { CartContext } from "../../contexts/cart-context.jsx";
import InputMask from "react-input-mask";
import back from "../../assets/back.png";
import pixqrcode from "../../assets/QRCode_planet.jpg";
import QRCode from "qrcode";

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
  const [ultimoCupomHTML, setUltimoCupomHTML] = useState(null);
  const [pixQRCodePedido, setPixQRCodePedido] = useState(null);

  const { cartItems, totalCart, clearCart } = useContext(CartContext);
  const pagamentoRef = useRef(null);
  const informacoesAdicionaisRef = useRef(null);

  useEffect(() => {
    const handleOpenSidebar = () => setShow(true);
    window.addEventListener("openSidebar", handleOpenSidebar);
    return () => window.removeEventListener("openSidebar", handleOpenSidebar);
  }, []);

  const bairrosSemFrete = [
    "vitoria","vitória","vitoria 1","vitória 1","vitoria 2","vitória 2",
    "Vitoria 1","Vitória","Vitoria 2","Vitória 1","Vitória 2","vitoria2",
    "vitória2","vitória1","Vitoria2","Vitória1","Vitória2","vitoria1","Vitoria1"
  ];
  const bairroFormatado = bairro.trim().toLowerCase();
  let frete = 5;
  if (bairrosSemFrete.includes(bairroFormatado)) frete = 0;
  else if (bairroFormatado === "industrial") frete = 2;
  else if (bairroFormatado.includes("industrial") || bairroFormatado.includes("cidade industrial")) frete = 3;

  const bairroExibicao = bairro.trim().toUpperCase();

  function validarCampos() {
    if (!nome.trim() || !quemRecebe.trim() || !telefone.trim() || !rua.trim() || !numero.trim() || !bairro.trim()) {
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

  const gerarPayloadPix = (chave, nomeRecebedor, cidade, valorStr, txid) => {
    const tlv = (id, value) => {
      const v = String(value);
      const len = v.length.toString().padStart(2, "0");
      return id + len + v;
    };
    const merchantInfo = `BR.GOV.BCB.PIX${tlv("01", chave)}`;
    let payload = `000201${tlv("26", merchantInfo)}520400005303986`;
    if (valorStr) payload += tlv("54", valorStr);
    payload += tlv("58", "BR");
    payload += tlv("59", nomeRecebedor);
    payload += tlv("60", cidade);
    payload += tlv("62", tlv("05", txid));
    const calcularCRC16 = (str) => {
      const polinomio = 0x1021;
      let crc = 0xffff;
      const data = str + "6304";
      for (let i = 0; i < data.length; i++) {
        crc ^= data.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
          crc = (crc & 0x8000) ? ((crc << 1) ^ polinomio) : (crc << 1);
          crc &= 0xffff;
        }
      }
      return crc.toString(16).toUpperCase().padStart(4, "0");
    };
    const crc = calcularCRC16(payload);
    return payload + "6304" + crc;
  };

  const abrirCupomEmJanela = (cupomHTML, imprimirForcado = false) => {
    try {
      const janela = window.open("", "_blank", "width=420,height=700");
      if (!janela) return alert("Não foi possível abrir a janela do cupom. Verifique bloqueadores de pop-up.");
      janela.document.write(cupomHTML);
      janela.document.close();
      janela.focus();
      if (imprimirForcado) setTimeout(() => janela.print(), 500);
    } catch (e) {
      console.warn("Erro ao abrir cupom:", e);
    }
  };

  async function enviarPedido() {
    if (!validarCampos()) return;
    setIsSending(true);
    setShowModal(false);
    setErrorMessage("");
    setSuccessMessage("");

    const numeroPedido = `#${Math.floor(10000 + Math.random() * 90000)}`;
    const pagamento = pagamentoRef.current?.value || "Não informado";
    const informacoesAdicionais = informacoesAdicionaisRef.current?.value || "Nenhuma";
    const totalComFrete = (parseFloat(totalCart) + frete).toFixed(2);

    const itensFormatados = cartItems.map(item => ({
      produto: item.nome,
      qtd: item.qtd,
      descricao: item.descricao || ""
    }));

    const pedidoParaSalvar = {
      nome: nome.trim(),
      quemRecebe: quemRecebe.trim(),
      telefone: telefone.trim(),
      rua: rua.trim(),
      numero: numero.trim(),
      bairro: bairro.trim(),
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
      if (resposta.ok) setSuccessMessage("✅ Pedido enviado e salvo com sucesso!");
      else setErrorMessage("⚠️ Pedido enviado, mas não foi salvo no servidor.");

      // PIX
      const chavePix = "38998017215";
      const nomeRecebedor = "MARIA MADALENA OLIVEIRA";
      const cidade = "MONTES CLAROS";
      const valorParaPix = totalComFrete;
      const txid = numeroPedido.replace("#", "PED");
      const pixPayload = gerarPayloadPix(chavePix, nomeRecebedor, cidade, valorParaPix, txid);
      let pixDataUrl = pixqrcode;
      try { pixDataUrl = await QRCode.toDataURL(pixPayload); } catch { pixDataUrl = pixqrcode; }
      setPixQRCodePedido(pixDataUrl);

      const cupomHTML = `
        <html><head><meta charset="utf-8"><title>Cupom ${numeroPedido}</title>
        <style>
          body { font-family: Arial; padding:10px; color:#000; }
          .center{text-align:center;}
          .items li{margin-bottom:4px;}
          .bold{font-weight:700;}
          .qr{margin-top:10px;}
          pre.payload{white-space:pre-wrap; word-break:break-all; background:#f4f4f4; padding:8px; border-radius:4px; font-size:12px;}
        </style></head>
        <body>
          <div class="center"><h2>Planet's Burguer</h2><div>Pedido: <strong>${numeroPedido}</strong></div></div>
          <hr/>
          <div><strong>Cliente:</strong> ${nome}</div>
          <div><strong>Recebedor:</strong> ${quemRecebe}</div>
          <div><strong>Telefone:</strong> ${telefone}</div>
          <div><strong>Endereço:</strong> Rua ${rua}, Nº ${numero}, Bairro ${bairro}</div>
          <div><strong>Pagamento:</strong> ${pagamento}</div>
          <div><strong>Total com frete:</strong> R$ ${totalComFrete.replace(".", ",")}</div>
          <div class="items"><strong>Itens:</strong><ul>${cartItems.map(i=>`<li>${i.qtd}x ${i.nome}${i.descricao?` (${i.descricao})`:``}</li>`).join("")}</ul></div>
          <hr/>
          <div class="center qr">
            <div><strong>💳 Pague com PIX</strong></div>
            <div style="margin:8px 0;"><img src="${pixDataUrl}" alt="QR Code PIX" style="width:160px;height:160px;border:2px solid #ccc;border-radius:8px;" /></div>
          </div>
          <hr/>
          <div class="center small">Obrigado pela preferência!</div>
          <div class="center small">Gerado em ${new Date().toLocaleString("pt-BR")}</div>
        </body></html>
      `;
      setUltimoCupomHTML(cupomHTML);

      // Enviar automaticamente para o painel
      fetch("/.netlify/functions/enviarCupomPainel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroPedido, html: cupomHTML })
      }).then(r => r.json()).then(d => console.log("Painel atualizado:", d))
      .catch(e => console.error("Erro ao enviar para painel:", e));

      // WhatsApp (sem payload)
      const listaProdutos = cartItems.map(i=>`- ${i.qtd}x ${i.nome}${i.descricao?` (Obs:${i.descricao})`:``}`).join("\n");
      const mensagem = `Olá, gostaria de finalizar meu pedido.\n\n📌 Número do Pedido: ${numeroPedido}\n👤 Nome: ${nome.trim()}\n🙋 Quem recebe: ${quemRecebe.trim()}\n📞 Telefone: ${telefone.trim()}\n📍 Endereço: Rua ${rua.trim()}, Nº ${numero.trim()}, Bairro ${bairro.trim()}\n💳 Forma de Pagamento: ${pagamento}\n\n🛒 Meu pedido:\n${listaProdutos}\n\n💰 Total com frete: R$ ${totalComFrete.replace(".", ",")}\n📝 Informações adicionais: ${informacoesAdicionais}`;
      const numeroWhatsApp = "5538998017215";
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
      setTimeout(() => { window.open(whatsappUrl, "_blank"); setIsSending(false); }, 1200);

      setNome(""); setQuemRecebe(""); setTelefone(""); setRua(""); setNumero(""); setBairro("");
      if (pagamentoRef.current) pagamentoRef.current.value = "";
      if (informacoesAdicionaisRef.current) informacoesAdicionaisRef.current.value = "";
      clearCart();
    } catch (erro) {
      setErrorMessage("Erro na conexão com o servidor"); console.error("Erro inesperado:", erro); setIsSending(false);
    }
  }

  return (
    <>
      <Dock position="right" isVisible={show} fluid={false} size={340} onVisibleChange={(v)=>setShow(v)}>
        <motion.div className="cart-motion-wrapper" whileHover={{scale:1.02}} whileTap={{scale:0.98}} transition={{type:"spring",stiffness:300,damping:20}}>
          <div className="text-center">
            <img onClick={()=>setShow(false)} src={back} className="cart-btn-close" alt="Fechar"/>
            <h1>Meu Pedido</h1>
          </div>

          <div className="formulario-cliente">
            <label>Nome:</label><input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Digite seu nome" onBlur={()=>document.activeElement.blur()}/>
            <label>Telefone:</label><InputMask mask="(99) 99999-9999" value={telefone} onChange={e=>setTelefone(e.target.value)} placeholder="(31) 91234-5678" onBlur={()=>document.activeElement.blur()}/>
            <label>Rua:</label><input value={rua} onChange={e=>setRua(e.target.value)} placeholder="Digite sua rua" onBlur={()=>document.activeElement.blur()}/>
            <label>Número:</label><input value={numero} onChange={e=>setNumero(e.target.value)} placeholder="Número da casa" onBlur={()=>document.activeElement.blur()}/>
            <label>Bairro:</label><input value={bairro} onChange={e=>setBairro(e.target.value)} placeholder="Digite seu bairro" onBlur={()=>document.activeElement.blur()}/>
            <label>Forma de Pagamento:</label><input ref={pagamentoRef} placeholder="Pix, Cartão ou Dinheiro" onBlur={()=>document.activeElement.blur()}/>
            <label>Informações Adicionais:</label><input ref={informacoesAdicionaisRef} placeholder="Ex. sem cebola - Troco pra 100" onBlur={()=>document.activeElement.blur()}/>
            <label>Quem recebe:</label><input value={quemRecebe} onChange={e=>setQuemRecebe(e.target.value)} placeholder="Caso você não receba o pedido" onBlur={()=>document.activeElement.blur()}/>
          </div>

          <div className="lista-produtos">{cartItems.map(i=><ProdutoCart key={i.id} {...i}/>)} </div>
          <p className="frete-msg">{frete===0?`🚚 Frete grátis para ${bairroExibicao || "BAIRRO INFORMADO"}.`:`🚚 Frete aplicado ao bairro ${bairroExibicao || "BAIRRO INFORMADO"}.`}</p>

          <div className="footer-cart-valor">
            <span>Total com frete</span>
            <strong>{new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(parseFloat(totalCart)+frete)}</strong>
          </div>

          <div style={{textAlign:"center",marginTop:20}}>
            <p style={{fontWeight:"bold",marginBottom:8}}>💳 Pague com PIX na entrega</p>
            <img src={pixQRCodePedido || pixqrcode} alt="QR Code PIX" style={{width:160,height:160,borderRadius:10,border:"2px solid #ccc",margin:"0 auto"}}/>
            <p style={{fontSize:"0.9rem",marginTop:8}}>Escaneie o QR Code ou finalize pelo Pix</p>
          </div>

          {errorMessage && <div className="error-message">❌ {errorMessage}</div>}
          {successMessage && <div style={{fontSize:"1.2rem",fontWeight:700,margin:"1rem 0",color:"green",textAlign:"center"}}>{successMessage}</div>}

          <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:8}}>
            <button onClick={abrirModal} className="btn-checkout" disabled={isSending}>{isSending?"Enviando...":"Finalizar Pedido"}</button>
            <button onClick={()=>ultimoCupomHTML?abrirCupomEmJanela(ultimoCupomHTML,true):alert("Nenhum cupom gerado ainda.")} className="btn-print-cupom" style={{background:"#2b7a78",color:"#fff",padding:"8px 12px",borderRadius:6}}>Imprimir Cupom</button>
          </div>
        </motion.div>
      </Dock>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <h2 id="modal-title">Confirmar Pedido</h2>
            <p>Você deseja realmente finalizar o pedido?</p>
            <div className="modal-buttons">
              <button onClick={()=>setShowModal(false)} className="cancel-btn">Cancelar</button>
              <button onClick={enviarPedido} className="confirm-btn" disabled={isSending}>
                {isSending ? (
                  <>
                    <svg className="spinner" viewBox="0 0 50 50" aria-hidden="true" focusable="false">
                      <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"/>
                    </svg>
                    Enviando...
                  </>
                ) : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
