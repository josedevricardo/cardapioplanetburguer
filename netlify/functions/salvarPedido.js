// salvarPedido.js

const admin = require("firebase-admin");

// 1. Obtém a Service Account Key do Netlify
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT;

// Verifica e inicializa o Admin SDK apenas uma vez
if (!admin.apps.length) {
    try {
        // --- INÍCIO DA CORREÇÃO DE VARIAVEIS DE AMBIENTE ---
        
        // CORREÇÃO: Cria uma cópia da chave para manipulação.
        let safeServiceAccountKey = serviceAccountKey;

        // Substitui as sequências de "\\n" (quebra de linha literal) por quebras de linha reais.
        // Isso é essencial para que o JSON.parse() interprete corretamente a private_key.
        safeServiceAccountKey = safeServiceAccountKey.replace(/\\n/g, '\n');
        
        // Remove as aspas externas se o Netlify as tiver adicionado (ex: "{"type": ...}")
        if (safeServiceAccountKey.startsWith('"') && safeServiceAccountKey.endsWith('"')) {
            safeServiceAccountKey = safeServiceAccountKey.substring(1, safeServiceAccountKey.length - 1);
        }

        const serviceAccount = JSON.parse(safeServiceAccountKey);
        
        // --- FIM DA CORREÇÃO DE VARIAVEIS DE AMBIENTE ---

        // Inicializa o Admin SDK
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            // Usa a URL do seu Realtime Database
            databaseURL: "https://cardapioplanetsburguer-default-rtdb.firebaseio.com",
        });
        console.log("Firebase Admin SDK inicializado com sucesso.");
    } catch (e) {
        console.error("Falha ao inicializar o Firebase Admin SDK. Verifique a variável FIREBASE_SERVICE_ACCOUNT.", e.message);
        // O erro será tratado dentro do exports.handler
    }
}

// Obtém a referência do Realtime Database
const db = admin.database();

exports.handler = async (event) => {
    // Checagem de Método HTTP
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ erro: "Método não permitido" }),
        };
    }

    // Checagem de Inicialização do Admin SDK
    if (!admin.apps.length) {
        return {
            statusCode: 500,
            body: JSON.stringify({ erro: "Configuração do Firebase Admin SDK falhou. Verifique os logs do Netlify." }),
        };
    }

    try {
        const dados = JSON.parse(event.body);

        // Gera o número do pedido
        const numeroPedido = dados.numeroPedido || `#${Math.floor(10000 + Math.random() * 90000)}`;

        const novoPedido = {
            ...dados,
            numeroPedido: numeroPedido,
            informacoes_adicionais: dados.informacoes_adicionais || "",
            data: new Date().toISOString(),
            status: "pendente",
        };

        // Salvando no Firebase Realtime Database usando a sintaxe correta do Admin SDK
        await db.ref("pedidos").push(novoPedido);

        // Retorno de Sucesso para o Frontend
        return {
            statusCode: 200,
            body: JSON.stringify({ sucesso: true, numeroPedido }),
        };
    } catch (error) {
        // Tratamento de Erro na Escrita ou Parse
        console.error("Erro ao salvar pedido:", error);
        return {
            statusCode: 500,
            // Retorna o erro exato para ajudar no debug no console do frontend
            body: JSON.stringify({ erro: error.message || "Erro interno do servidor ao salvar no banco." }),
        };
    }
};