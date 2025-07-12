import React, { useState, useEffect, useContext, useRef } from "react";
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

  const { totalCart } = useContext(CartContext);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const openSidebar = () => {
    window.dispatchEvent(new CustomEvent("openSidebar"));
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Motinha + vibração + navegação
  const handleMenuClick = (rota) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(100);
    }

    setMotinhaAtiva(true);
    setTimeout(() => {
      setMotinhaAtiva(false);
      navigate(rota);
    }, 1000);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
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
        {/* Logo + Mobile */}
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
            <span className="logo-text">
              Planet's <strong>Burguer</strong>
            </span>
          </Link>
        </div>


        {/* Menu Desktop */}
        <ul className="desktop-menu">
          {categoriasFixas.map(({ nome, rota }) => (
            <li key={nome}>
              <button
                className={`menu-link ${location.pathname === rota ? "ativo" : ""}`}
                onClick={() => handleMenuClick(rota)}
              >
                {nome}
              </button>
            </li>
          ))}
        </ul>

        {/* Botão sacola */}
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
            <ul className="mobile-menu">
              {categoriasFixas.map(({ nome, rota }) => (
                <li key={nome}>
                  <button
                    className="menu-link"
                    onClick={() => {
                      if ("vibrate" in navigator) {
                        navigator.vibrate(100);
                      }
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

        {/* Motinha centralizada */}
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

      <div className="navbar-space"></div>
    </>
  );
}

export default Navbar;
