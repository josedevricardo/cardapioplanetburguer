import React, { useContext, useEffect, useRef, useState } from 'react';
import Navbar from "../../components/navbar/navbar.jsx";
import { CartContext } from '../../contexts/cart-context.jsx';
import "./checkout.css";

function Checkout() {
    const { totalCart, cartItems, adicionarPedido } = useContext(CartContext); // Pega adicionarPedido
    const [isProcessing, setIsProcessing] = useState(false);

    const nomeRef = useRef(null);
    const telefoneRef = useRef(null);
    const pagamentoRef = useRef(null);
    const bairroRef = useRef(null);
    const numeroCasaRef = useRef(null);
    const ruaRef = useRef(null);
    const informacoesAdicionaisRef = useRef(null);

    const generateOrderNumber = () => Math.floor(Math.random() * 1000000);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const nome = nomeRef.current.value;
        const telefone = telefoneRef.current.value;
        const pagamento = pagamentoRef.current.value;
        const bairro = bairroRef.current.value;
        const numero = numeroCasaRef.current.value;
        const rua = ruaRef.current.value;
        const informacoesAdicionais = informacoesAdicionaisRef.current.value;
        const numeroPedido = generateOrderNumber();

        // Montar lista de produtos para WhatsApp
        const listaProdutos = cartItems.map(item =>
            `- ${item.qtd}x ${item.nome} ${item.descricao ? `(Obs: ${item.descricao})` : ''} — R$ ${item.preco}`
        ).join("\n");

        const totalComFrete = totalCart.toFixed(2);

        // Mensagem formatada para WhatsApp
        const mensagem = `Olá, gostaria de finalizar meu pedido.\n\n`
            + `📌 *Número do Pedido:* ${numeroPedido}\n`
            + `👤 *Nome:* ${nome}\n`
            + `📞 *Telefone:* ${telefone}\n`
            + `📍 *Endereço:* Rua ${rua}, Nº ${numero}, Bairro ${bairro}\n`
            + `💳 *Forma de Pagamento:* ${pagamento}\n\n`
            + `🛒 *Meu pedido:*\n${listaProdutos}\n\n`
            + `💰 *Total com frete:* R$ ${totalComFrete.replace(".", ",")}\n`
            + `📝 *Informações Adicionais:* ${informacoesAdicionais}`;

        // --- Agora ADICIONAR pedido ao painel admin
        adicionarPedido({
            numeroPedido,
            nome,
            telefone,
            pagamento,
            bairro,
            numero,
            rua,
            informacoesAdicionais,
            itens: cartItems,
            totalComFrete
        });

        // --- Enviar para WhatsApp
        const numeroWhatsApp = '31984676843';
        window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank');

        // --- Imprimir automaticamente
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head><title>Pedido ${numeroPedido}</title></head>
                <body>
                    <h2>Pedido #${numeroPedido}</h2>
                    <p><strong>Nome:</strong> ${nome}</p>
                    <p><strong>Telefone:</strong> ${telefone}</p>
                    <p><strong>Endereço:</strong> Rua ${rua}, Nº ${numero}, Bairro ${bairro}</p>
                    <p><strong>Forma de Pagamento:</strong> ${pagamento}</p>
                    <h3>Produtos:</h3>
                    <pre>${listaProdutos}</pre>
                    <p><strong>Total com frete:</strong> R$ ${totalComFrete}</p>
                    <p><strong>Informações adicionais:</strong> ${informacoesAdicionais}</p>
                    <script>window.print();</script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <>
            <Navbar />
            <div className="checkout-container">
                <div className="titulo text-center">
                    <h1>Finalizar Pedido</h1>
                </div>
                <form className="checkout-form" onSubmit={handleSubmit}>
                    {/* Inputs */}
                    <div className="input-group">
                        <label>Nome</label>
                        <input ref={nomeRef} type="text" required placeholder="Seu nome" />
                    </div>
                    <div className="input-group">
                        <label>Telefone</label>
                        <input ref={telefoneRef} type="text" required placeholder="Seu telefone" />
                    </div>
                    <div className="input-group">
                        <label>Forma de Pagamento</label>
                        <input ref={pagamentoRef} type="text" required placeholder="Pix, Cartão ou Dinheiro" />
                    </div>
                    <div className="input-group">
                        <label>Bairro</label>
                        <input ref={bairroRef} type="text" required placeholder="Bairro" />
                    </div>
                    <div className="input-group">
                        <label>Número da casa</label>
                        <input ref={numeroCasaRef} type="text" required placeholder="Número" />
                    </div>
                    <div className="input-group">
                        <label>Rua</label>
                        <input ref={ruaRef} type="text" required placeholder="Rua" />
                    </div>
                    <div className="input-group">
                        <label>Informações Adicionais</label>
                        <input ref={informacoesAdicionaisRef} type="text" placeholder="Ex: Sem cebola..." />
                    </div>

                    <div className="checkout-button">
                        <button type="submit" disabled={isProcessing}>
                            {isProcessing ? 'Processando...' : 'Finalizar Pedido'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Checkout;
