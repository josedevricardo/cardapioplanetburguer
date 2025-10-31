// salvarPedido.js

const admin = require("firebase-admin");

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT;
const databaseUrl = "https://cardapioplanetsburguer-default-rtdb.firebaseio.com";

let db; // Variável para armazenar a instância do Realtime Database

// Função para garantir a inicialização segura do Firebase Admin SDK
function initializeFirebase() {
    if (admin.apps.length) {
        // Se já estiver inicializado (reuso de instância do Netlify), retorna a instância do database
        return admin.database();
    }

    try {
        if (!serviceAccountKey) {
            throw new Error("FIREBASE_SERVICE_ACCOUNT variável de ambiente não configurada.");
        }

        // --- CORREÇÃO DE QUEBRAS DE LINHA ---
        // 1. Cria uma cópia da chave para manipulação.
        let safeServiceAccountKey = serviceAccountKey;

        // 2. Substitui as sequências de "\\n" (quebra de linha literal) por quebras de linha reais.
        safeServiceAccountKey = safeServiceAccountKey.replace(/\\n/g, '\n');
        
        // 3. Remove as aspas externas se existirem (comum no Netlify).
        if (safeServiceAccountKey.startsWith('"') && safeServiceAccountKey.endsWith('"')) {
            safeServiceAccountKey = safeServiceAccountKey.substring(1, safeServiceAccountKey.length - 1);
        }

        const serviceAccount = JSON.parse(safeServiceAccountKey);
        // --- FIM DA CORREÇÃO ---

        // Inicializa o Admin SDK
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: databaseUrl,
        });
        
        console.log("Firebase Admin SDK inicializado com sucesso.");
        return admin.database();

    } catch (e) {
        console.error("Falha fatal na inicialização do Firebase Admin SDK:", e.message);
        // Retorna null ou lança um erro para ser tratado no handler principal
        return null; 
    }
}

exports.handler = async (event) => {
    // 1. Checagem de Método HTTP
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ erro: "Método não permitido" }),
        };
    }

    // 2. Inicializa ou obtém a instância do Database
    db = initializeFirebase();

    // 3. Checagem de Inicialização bem-sucedida
    if (!db) {
        return {
            statusCode: 500,
            body: JSON.stringify({ erro: "Erro de configuração do servidor. Contate o suporte." }),
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

        // 4. Salvando no Firebase Realtime Database
        await db.ref("pedidos").push(novoPedido);

        // 5. Retorno de Sucesso para o Frontend
        return {
            statusCode: 200,
            body: JSON.stringify({ sucesso: true, numeroPedido }),
        };
    } catch (error) {
        // 6. Tratamento de Erro na Escrita ou Parse
        console.error("Erro ao salvar pedido (provavelmente regra de segurança ou dados):", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ erro: error.message || "Erro interno do servidor ao salvar no banco." }),
        };
    }
};