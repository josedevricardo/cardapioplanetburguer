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

  const { totalCart } = useContext(CartContext); // CORRIGIDO

  const menuRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const openSidebar = () => window.dispatchEvent(new CustomEvent("openSidebar"));
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const handleBuscaChange = (valor) => {
    setBusca(valor);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("buscaAtualizada", { detail: valor }));
    }, 50);
  };

  const handleBuscaKeyDown = (event) => {
    if (event.key === "Enter") {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.blur();
      }, 100);

      setTimeout(() => {
        const firstProduto = document.querySelector(".produto-card");
        if (firstProduto) {
          firstProduto.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }

      if (inputRef.current && !inputRef.current.contains(event.target)) {
        inputRef.current.blur();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

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
      {/* LOADING */}
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
        
        {/* ESQUERDA MOBILE */}
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
            <img src={logo} alt="Planets Burguer Logo" className="logo" />
            <span className="logotext">
              Planet's <strong>Burguer</strong>
            </span>
          </Link>
        </div>

        {/* BUSCA DESKTOP */}
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
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* MENU DESKTOP */}
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

        {/* SACOLA */}
        <div className="right-buttons">
          <button onClick={openSidebar} className="sacola-button" aria-label="Abrir sacola">
            <div className="sacola-icon">🛒</div>
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

        {/* MENU MOBILE */}
        {isMobileMenuOpen && (
          <div className="mobile-sidebar" ref={menuRef}>

            {/* BUSCA MOBILE */}
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
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
            </div>

            {/* ⭐ AVALIAÇÃO — ADICIONADA AQUI */}
            <div className="avaliacao-mobile-box">
              <div className="estrelas">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>☆</span>
                <span className="nota-texto">(4,5/5)</span>
              </div>

              <a
                href="https://maps.app.goo.gl/rVyvhC7mdDsc35ak9?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                className="avaliar-link"
              >
                Avalie no Google
              </a>
            </div>

            {/* LISTA DE CATEGORIAS */}
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

            {/* WHATSAPP */}
            <div className="mobile-whatsapp">
              <a
                href="https://wa.me/5538998017215"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-link"
              >
                <svg
                  className="whatsapp-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="#25D366"
                    d="M16 .4C7.4.4.5 7.2.5 15.8c0 2.8.8 5.5 2.3 7.8L0 32l8.6-2.8c2.3 1.3 4.9 2 7.5 2 8.6 0 15.5-6.8 15.5-15.4C31.6 7.2 24.7.4 16 .4z"
                  />
                  <path
                    fill="#fff"
                    d="M24 19.3c-.4-.2-2.3-1.1-2.6-1.3-.4-.1-.6-.2-.8.2-.2.4-.9 1.3-1.1 1.5-.2.2-.4.2-.8 0-.4-.2-1.5-.6-2.9-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.6.2-.2.2-.4.4-.6.2-.2.2-.4.2-.6 0-.2 0-.4-.2-.6-.2-.2-1.1-2.6-1.5-3.5-.4-.8-.8-.8-1.1-.8h-.8c-.2 0-.6.2-.9.4-.2.4-1.1 1.1-1.1 2.8 0 1.7 1.1 3.3 1.3 3.5.2.2 2.3 4.7 5.8 6.6 3.5 1.9 4.1 1.3 4.9 1.3.8 0 2.3-1 2.6-1.9.4-.8.4-1.5.2-1.7-.2-.2-.6-.4-1-.6z"
                  />
                </svg>

                <span className="whatsapp-text">
                  WhatsApp<br />
                  <strong>38 99801-7215</strong>
                </span>
              </a>
            </div>
          </div>
        )}

        {isMobileMenuOpen && <div className="mobile-overlay" />}
        <Cart id="cart" />

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
