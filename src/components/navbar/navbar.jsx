// src/components/Navbar/Navbar.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CartContext } from "../../contexts/cart-context";
import { categoriasFixas } from "../../rotas2";
import Cart from "../Cart/cart";
import logo from "../../assets/mascote.png";
import "./navbar.css";

function Navbar() {
  const [isSticky, setSticky] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [motinhaAtiva, setMotinhaAtiva] = useState(false);
  const [busca, setBusca] = useState("");

  const { totalCart } = useContext(CartContext);
  const menuRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const openSidebar = () => window.dispatchEvent(new CustomEvent("openSidebar"));
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  // Atualiza busca e dispara evento global
  const handleBuscaChange = (valor) => {
    setBusca(valor);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("buscaAtualizada", { detail: valor }));
    }, 50);
  };

  // Enter fecha teclado e rola para o primeiro produto
  const handleBuscaKeyDown = (event) => {
    if (event.key === "Enter") {
      // Fecha teclado com delay para mobile
      setTimeout(() => {
        if (inputRef.current) inputRef.current.blur();
      }, 100);

      // Rola para o produto encontrado
      setTimeout(() => {
        const firstProduto = document.querySelector(".produto-card"); // ajuste para sua classe real
        if (firstProduto) {
          firstProduto.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  };

  // Fecha menu mobile ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }

      // Fecha teclado se clicar fora do input
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        inputRef.current.blur();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Sticky + loader
  useEffect(() => {
    const handleScroll = () => setSticky(window.pageYOffset > 80);
    window.addEventListener("scroll", handleScroll);
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {loading && (
        <div className="loading-screen">
          <img src={logo} alt="Logo" className="loading-logo" />
          <div className="loading-content">
            <div className="burger-icon">🍔</div>
            <p>Preparando seu pedido...</p>
          </div>
        </div>
      )}

      <div className="gif-background" />

      <nav className={`navbar ${isSticky ? "sticky" : ""}`}>
        {/* Logo + menu mobile */}
        <div className="mobile-left">
          <button
            className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Abrir menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </button>

          <Link to="/" className="logo-link logo-text-container">
            <img src={logo} alt="Planets Burguer Logo" className="logotipo" />
            <span className="logotext">
              Planet's <strong>Burguer</strong>
            </span>
          </Link>
        </div>

        {/* Barra de busca desktop */}
        <div className="searchbar-desktop">
          <div className="search-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="search-bar"
              placeholder="Buscar produto..."
              value={busca}
              onChange={(e) => handleBuscaChange(e.target.value)}
              onKeyDown={handleBuscaKeyDown}
            />
            <svg
              className={`search-icon ${busca ? "active" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="7" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Menu desktop */}
        <ul className="desktop-menu">
          {categoriasFixas.map(({ nome, rota }) => (
            <li key={nome}>
              <button
                className={`menu-link ${location.pathname === rota ? "ativo" : ""}`}
                onClick={() => {
                  if ("vibrate" in navigator) navigator.vibrate(100);
                  setMotinhaAtiva(true);
                  setTimeout(() => {
                    setMotinhaAtiva(false);
                    navigate(rota);
                  }, 1000);
                }}
              >
                {nome}
              </button>
            </li>
          ))}
        </ul>

        {/* Sacola */}
        <div className="right-buttons">
          <button onClick={openSidebar} className="sacola-button" aria-label="Abrir sacola">
            <div className="sacola-icon">🛍️</div>
            <span className="sacola-text">
              Sacola{" "}
              <strong>
                {typeof totalCart === "number" && !isNaN(totalCart)
                  ? totalCart.toFixed(2)
                  : "0.00"}
              </strong>
            </span>
          </button>
        </div>

        {/* Menu mobile lateral */}
        {isMobileMenuOpen && (
          <div className="mobile-sidebar" ref={menuRef}>
            {/* Busca mobile */}
            <div className="searchbar-mobile">
              <div className="search-input-wrapper">
                <input
                  ref={inputRef}
                  type="text"
                  className="search-bar"
                  placeholder="Buscar produto..."
                  value={busca}
                  onChange={(e) => handleBuscaChange(e.target.value)}
                  onKeyDown={handleBuscaKeyDown}
                />
                <svg
                  className={`search-icon ${busca ? "active" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="11" cy="11" r="7" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <ul className="mobile-menu">
              {categoriasFixas.map(({ nome, rota }) => (
                <li key={nome}>
                  <button
                    className="menu-link"
                    onClick={() => {
                      if ("vibrate" in navigator) navigator.vibrate(100);
                      setMotinhaAtiva(true);
                      setTimeout(() => {
                        setMotinhaAtiva(false);
                        setMobileMenuOpen(false);
                        navigate(rota);
                      }, 1000);
                    }}
                  >
                    {nome}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isMobileMenuOpen && <div className="mobile-overlay" />}
        <Cart id="cart" />

        {/* Motinha animada */}
        <AnimatePresence>
          {motinhaAtiva && (
            <motion.div
              key="motinha"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "120%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="motinha-entrega"
            >
              🛵💨
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="navbar-space" />
    </>
  );
}

export default Navbar;
