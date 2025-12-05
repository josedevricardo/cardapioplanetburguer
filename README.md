# 🍔 Planet Burger – Cardápio Online

**Aplicação React moderna com TailwindCSS, Firebase, Netlify e painel Admin completo**

Deploy: **[https://cardapioplanetburger.netlify.app/](https://cardapioplanetburger.netlify.app/)**
Status Netlify: ![Netlify Status](https://api.netlify.com/api/v1/badges/f361336b-89fd-4865-8a36-ceb1d6eb8422/deploy-status)

---

## 🚀 Tecnologias Utilizadas

* **React 18**
* **TailwindCSS 3**
* **Framer Motion**
* **Firebase Auth + Database**
* **Postgres (Neon) + Netlify Functions**
* **QZ Tray (Impressão automática)**
* **Netlify Deploy**
* **Acessibilidade e PWA (opcional)**

---

## 📦 Instalação e Execução

### 1. Clonar o projeto

```bash
git clone https://github.com/SEU_REPO_AQUI.git
cd planet-burger
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Rodar em modo desenvolvimento

```bash
npm start
```

Abra o navegador em:
**[http://localhost:3000](http://localhost:3000)**

---

## 🛠 Scripts Disponíveis

### `npm start`

Inicia o servidor de desenvolvimento.

### `npm run build`

Gera a versão otimizada para produção na pasta `/build`.

### `npm run deploy`

(Necessário configurar no Netlify)
Realiza o deploy automático.

---

## 🔐 Variáveis de Ambiente

Crie os arquivos:

```
.env.local
.env.production
```

E insira:

```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_DB_URL=...
REACT_APP_NEON_DATABASE_URL=...
```

> Nenhuma variável sensível deve ser commitada no Git.

---

## 📁 Estrutura do Projeto

```
src/
 ├─ components/
 ├─ pages/
 ├─ admin/
 ├─ hooks/
 ├─ services/
 ├─ styles/
 └─ firebaseConfig.js
```

---

## 🧩 Funcionalidades Principais

### 🛒 Cardápio Online

* Listagem dinâmica de produtos
* Busca inteligente
* Slider por categorias
* Botões flutuantes
* Modo escuro automático

### 🔐 Área Admin

* Login seguro (Firebase)
* Gerenciamento de produtos e categorias
* Pedidos em tempo real (Postgres + Netlify Functions)
* Impressão automática via QZ Tray
* Exportações: PDF / CSV / XLSX
* Filtros de pedidos (pendente / entregue)
* Backup automático
* Estatísticas

---

## 🎨 UI & UX

* Tailwind moderno e customizado
* Componentes animados (Framer Motion)
* Layout responsivo completo
* Design profissional com cores personalizadas

---

## 📚 Documentação e Fontes Oficiais

* React Docs: [https://react.dev](https://react.dev)
* TailwindCSS: [https://tailwindcss.com](https://tailwindcss.com)
* Firebase: [https://firebase.google.com/docs](https://firebase.google.com/docs)
* Netlify Functions: [https://docs.netlify.com/functions/overview/](https://docs.netlify.com/functions/overview/)
* Postgres Neon: [https://neon.tech/docs](https://neon.tech/docs)
* QZ Tray: [https://qz.io/docs](https://qz.io/docs)

---

## 📌 Observações

* Este projeto é totalmente responsivo.
* Build otimizado para performance no Netlify.
* Código revisado e compatível com padrões modernos.

---

## 🧑‍💻 Autor

Planet Burger • Painel e cardápio desenvolvidos por RICARDO.
