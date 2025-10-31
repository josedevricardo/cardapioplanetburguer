// salvarPedido.js

// 1. Instale o Admin SDK: npm install firebase-admin
const admin = require("firebase-admin");

// 2. IMPORTANTE: Configure esta Variável de Ambiente no Netlify
// Esta variável deve conter o JSON da sua Service Account Key do Firebase.
// Por segurança, é recomendado carregar o JSON do ambiente.
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT;

// Verifica se a Service Account Key existe
if (!serviceAccountKey) {
    console.error("ERRO: Variável de ambiente FIREBASE_SERVICE_ACCOUNT não configurada.");
    // Para evitar que a função falhe antes de ser chamada, 
    // faremos uma checagem de erro mais clara dentro do handler.
}

// Inicializa o Admin SDK apenas se ainda não foi inicializado
// O Netlify pode reutilizar instâncias, então essa checagem é importante.
if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            // Use a URL do seu Realtime Database
            databaseURL: "https://cardapioplanetsburguer-default-rtdb.firebaseio.com",
        });
        console.log("Firebase Admin SDK inicializado com sucesso.");
    } catch (e) {
        console.error("Falha ao inicializar o Firebase Admin SDK:", e.message);
        // Não lançar erro aqui, apenas logar. A falha será capturada no handler.
    }
}

// Obtém a referência do Realtime Database
const db = admin.database();

exports.handler = async (event) => {
    // 1. Checagem de Método HTTP
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ erro: "Método não permitido" }),
        };
    }

    // 2. Checagem de Inicialização do Admin SDK
    if (!admin.apps.length) {
        return {
            statusCode: 500,
            body: JSON.stringify({ erro: "Configuração do Firebase Admin SDK falhou." }),
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
            data: new Date().toISOString(), // Data e hora do pedido
            status: "pendente", // Status inicial para o Admin Panel
        };

        // 3. Salvando no Firebase Realtime Database
        // Usa db.ref() para Realtime Database e .push() para criar um ID único
        await db.ref("pedidos").push(novoPedido);

        // 4. Retorno de Sucesso para o Frontend
        return {
            statusCode: 200,
            body: JSON.stringify({ sucesso: true, numeroPedido }),
        };
    } catch (error) {
        // 5. Tratamento de Erro na Escrita ou Parse
        console.error("Erro ao salvar pedido:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ erro: error.message || "Erro interno do servidor ao salvar no banco." }),
        };
    }
};