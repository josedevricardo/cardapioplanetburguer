// salvarPedido.js

const admin = require("firebase-admin");

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT;
const databaseUrl = "https://cardapioplanetsburguer-default-rtdb.firebaseio.com";

let db; 

function initializeFirebase() {
    if (admin.apps.length) {
        return admin.database();
    }

    try {
        if (!serviceAccountKey) {
            // Se a variável estiver vazia, retorna um erro claro.
            console.error("ERRO GRAVE: FIREBASE_SERVICE_ACCOUNT está vazia no Netlify.");
            return null;
        }

        // --- CORREÇÃO DE QUEBRAS DE LINHA E ASPAS ---
        let safeServiceAccountKey = serviceAccountKey;

        // Tenta remover as aspas externas se o Netlify as tiver adicionado.
        if (safeServiceAccountKey.startsWith('"') && safeServiceAccountKey.endsWith('"')) {
            safeServiceAccountKey = safeServiceAccountKey.substring(1, safeServiceAccountKey.length - 1);
        }
        
        // CORREÇÃO ESSENCIAL: Substitui as sequências de "\\n" para serem reconhecidas no JSON.parse.
        safeServiceAccountKey = safeServiceAccountKey.replace(/\\n/g, '\n');
        // --- FIM DA CORREÇÃO ---

        // Log de Segurança: Verifica se o JSON foi parseado. 
        // Não mostra a chave privada, mas confirma a leitura dos campos.
        const serviceAccount = JSON.parse(safeServiceAccountKey);

        console.log(`SUCESSO LOG: Variável lida. Projeto ID: ${serviceAccount.project_id}`);
        
        // Inicializa o Admin SDK
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: databaseUrl,
        });
        
        console.log("Firebase Admin SDK inicializado com sucesso.");
        return admin.database();

    } catch (e) {
        // Loga qualquer erro durante o parse ou inicialização.
        console.error("ERRO DE INICIALIZAÇÃO. Detalhes:", e.message);
        return null; 
    }
}

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ erro: "Método não permitido" }),
        };
    }

    db = initializeFirebase();

    if (!db) {
        // Retorna 500 se a inicialização falhou.
        return {
            statusCode: 500,
            body: JSON.stringify({ erro: "Erro de configuração: Inicialização do Firebase falhou." }),
        };
    }

    try {
        const dados = JSON.parse(event.body);
        const numeroPedido = dados.numeroPedido || `#${Math.floor(10000 + Math.random() * 90000)}`;

        const novoPedido = {
            ...dados,
            numeroPedido: numeroPedido,
            informacoes_adicionais: dados.informacoes_adicionais || "",
            data: new Date().toISOString(),
            status: "pendente",
        };

        await db.ref("pedidos").push(novoPedido);

        return {
            statusCode: 200,
            body: JSON.stringify({ sucesso: true, numeroPedido }),
        };
    } catch (error) {
        console.error("Erro ao salvar pedido (Regras ou Dados):", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ erro: error.message || "Erro interno do servidor ao salvar no banco." }),
        };
    }
};