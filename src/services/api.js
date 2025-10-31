import axios from "axios";

const api = axios.create({
  // 👇 Coloque aqui o domínio público do seu site Netlify
  baseURL: "https://cardapioplanetburguer.netlify.app",

  headers: {
    // 🔒 Este token deve ser o mesmo que você definiu no backend (arquivo .env ou função serverless)
    Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export default api;
