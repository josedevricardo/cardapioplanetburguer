import React, { useEffect, useState } from "react";

/* global qz */
export default function TesteQzTray() {
  const [conectado, setConectado] = useState(false);
  const [impressoras, setImpressoras] = useState([]);
  const [selecionada, setSelecionada] = useState("");

  useEffect(() => {
    const carregarQZ = async () => {
      try {
        if (!window.qz) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/qz-tray@2.1.0/qz-tray.js";
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        await qz.websocket.connect();
        setConectado(true);

        const lista = await qz.printers.find();
        setImpressoras(lista);
      } catch (error) {
        console.error("Erro ao conectar com QZ Tray:", error);
      }
    };

    carregarQZ();

    return () => {
      if (qz?.websocket?.isActive()) {
        qz.websocket.disconnect();
      }
    };
  }, []);

  const imprimirTeste = () => {
    if (!selecionada) {
      alert("Selecione uma impressora.");
      return;
    }

    const texto = `
=== TESTE DE IMPRESSÃO ===
Data: ${new Date().toLocaleString("pt-BR")}
==========================
`;

    const config = qz.configs.create(selecionada);
    const data = [{ type: "raw", format: "plain", data: texto }];

    qz.print(config, data)
      .then(() => alert("🖨️ Impressão enviada com sucesso!"))
      .catch((err) => alert("Erro ao imprimir: " + err));
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Teste de Impressão com QZ Tray</h1>

      {conectado ? (
        <>
          <select
            className="border rounded px-2 py-1 mb-4"
            value={selecionada}
            onChange={(e) => setSelecionada(e.target.value)}
          >
            <option value="">Selecione a impressora</option>
            {impressoras.map((nome, idx) => (
              <option key={idx} value={nome}>{nome}</option>
            ))}
          </select>
          <br />
          <button
            onClick={imprimirTeste}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Imprimir Teste
          </button>
        </>
      ) : (
        <p className="text-red-600">QZ Tray não conectado</p>
      )}
    </div>
  );
}
