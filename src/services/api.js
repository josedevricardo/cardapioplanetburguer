import axios from "axios";

const api = axios.create({
  baseURL: "https://SEU_BACKEND/render_ou_netlify_functions/api", // Troque aqui
  headers: {
    Authorization: `Bearer SEU_TOKEN_AQUI`, // Troque pelo mesmo token usado no backend (.env)
  },
});

export default api;
