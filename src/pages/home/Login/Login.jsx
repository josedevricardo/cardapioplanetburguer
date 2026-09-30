import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebaseConnection"; // Ajuste o caminho se necessário para o seu arquivo Firebase
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    setErro("");
    setMensagem("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Após o login com sucesso, vai direto para a sua Home
      navigate("/"); 
    } catch (error) {
      console.log(error);
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setErro("E-mail ou senha incorretos.");
      } else if (error.code === "auth/too-many-requests") {
        setErro("Muitas tentativas sem sucesso. Tente novamente mais tarde.");
      } else {
        setErro("Ocorreu um erro ao fazer login. Verifique suas credenciais.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!email) {
      setErro("Digite seu e-mail no campo acima para receber a recuperação de senha.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMensagem("E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.");
      setErro("");
    } catch (error) {
      console.log(error);
      setErro("Não foi possível enviar o e-mail. Verifique se o endereço está correto.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-zinc-800">Acesso Restrito</h2>
          <p className="text-zinc-500 text-sm mt-1">Delivery - Painel e Loja</p>
        </div>

        {erro && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 rounded mb-4 text-sm">
            {mensagem}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-orange-600 hover:underline font-medium"
            >
              Esqueceu a senha?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition duration-200 disabled:opacity-50 shadow-md"
          >
            {loading ? "Entrando..." : "Entrar no Sistema"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}