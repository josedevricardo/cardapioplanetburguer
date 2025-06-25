import { useEffect, useState } from "react";

/* global qz */
export function useImpressao() {
  const [conectado, setConectado] = useState(false);
  const [impressoras, setImpressoras] = useState([]);

  useEffect(() => {
    const carregarQZ = async () => {
      try {
        // Carrega o script da QZ Tray, se necessário
        if (!window.qz) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/qz-tray@2.1.0/qz-tray.js";
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        // Aguarda a lib QZ estar carregada
        if (!qz.websocket.isActive()) {
          await qz.websocket.connect();
        }

        setConectado(true);

        // Busca todas as impressoras disponíveis
        const lista = await qz.printers.find();
        setImpressoras(lista);
      } catch (error) {
        console.error("❌ Erro ao conectar com QZ Tray:", error);
        setConectado(false);
      }
    };

    carregarQZ();

    return () => {
      if (window.qz?.websocket?.isActive()) {
        qz.websocket.disconnect();
      }
    };
  }, []);

  // 👉 Função para formatar pedido como texto
  const formatarPedidoTexto = (pedido) => {
    return `
=============================
PEDIDO #${pedido.id}
Nome: ${pedido.nome}
Telefone: ${pedido.telefone}
Endereço: Rua ${pedido.rua}, Nº ${pedido.numero}, Bairro ${pedido.bairro}
Pagamento: ${pedido.pagamento}
Informações adicionais: ${pedido.informacoes_adicionais || "Nenhuma"}
-----------------------------
Itens:
${pedido.itens.map((item) => `- ${item.qtd}x ${item.produto}`).join("\n")}
-----------------------------
TOTAL: R$ ${pedido.total}
Data: ${new Date(pedido.data).toLocaleString("pt-BR")}
=============================
`;
  };

  // 🔹 Imprimir pedido via QZ Tray
  const imprimir = (pedido, impressoraSelecionada) => {
    if (!qz || !qz.websocket.isActive()) {
      console.error("QZ Tray não está conectado.");
      return;
    }

    const conteudo = formatarPedidoTexto(pedido);
    const config = qz.configs.create(impressoraSelecionada);
    const data = [{ type: "raw", format: "plain", data: conteudo }];

    qz.print(config, data)
      .then(() => console.log("✅ Pedido enviado para impressão"))
      .catch((err) => console.error("❌ Erro na impressão:", err));
  };

  // 🔹 Fazer download local do pedido como .txt
  const salvarLocalmente = (pedido) => {
    const texto = formatarPedidoTexto(pedido);
    const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pedido_${pedido.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    conectado,
    impressoras,
    imprimir,
    salvarLocalmente,
  };
}
