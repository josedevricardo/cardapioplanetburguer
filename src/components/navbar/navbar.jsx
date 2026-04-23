import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CartContext } from "../../contexts/cart-context";
import { categoriasFixas } from "../../rotas2";
import Cart from "../Cart/cart";
import logo from "../../assets/mascote.png";
import bannerDelivery from "../../assets/planetburguer.gif";

import "./navbar.css";

function Navbar() {
  const [isSticky, setSticky] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [motinhaAtiva, setMotinhaAtiva] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const { totalCart, cartItems } = useContext(CartContext);
  const totalItens = cartItems
    ? cartItems.reduce((acc, obj) => acc + obj.qtd, 0)
    : 0;

  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const openSidebar = () =>
    window.dispatchEvent(new CustomEvent("openSidebar"));
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const navegarComEfeito = (rota) => {
    setMotinhaAtiva(true);
    setMobileMenuOpen(false);
    setTimeout(() => {
      setMotinhaAtiva(false);
      navigate(rota);
    }, 1000);
  };

  useEffect(() => {
    if (totalItens > 0) {
      const interval = setInterval(() => {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2500);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [totalItens]);

  useEffect(() => {
    const handleScroll = () => setSticky(window.pageYOffset > 80);
    window.addEventListener("scroll", handleScroll);
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isMobile = window.innerWidth < 768;

  const WhatsAppLink = () => (
    <a
      href="https://wa.me/5538998017215"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-global-link"
    >
      <div className="whatsapp-icon-bg">
        <svg viewBox="0 0 32 32">
          <path
            fill="#fff"
            d="M16 .4C7.4.4.5 7.2.5 15.8c0 2.8.8 5.5 2.3 7.8L0 32l8.6-2.8c2.3 1.3 4.9 2 7.5 2 8.6 0 15.5-6.8 15.5-15.4C31.6 7.2 24.7.4 16 .4zM24 19.3c-.4-.2-2.3-1.1-2.6-1.3-.4-.1-.6-.2-.8.2-.2.4-.9 1.3-1.1 1.5-.2.2-.4.2-.8 0-.4-.2-1.5-.6-2.9-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8.2-.2.4-.4.6-.6.2-.2.2-.4.4-.6.2-.2.2-.4.2-.6 0-.2 0-.4-.2-.6-.2-.2-1.1-2.6-1.5-3.5-.4-.8-.8-.8-1.1-.8h-.8c-.2 0-.6.2-.9.4-.2.4-1.1 1.1-1.1 2.8 0 1.7 1.1 3.3 1.3 3.5.2.2 2.3 4.7 5.8 6.6 3.5 1.9 4.1 1.3 4.9 1.3.8 0 2.3-1 2.6-1.9.4-.8.4-1.5.2-1.7-.2-.2-.6-.4-1-.6z"
          />
        </svg>
      </div>
      <div className="whatsapp-info">
        <span>Fale conosco</span>
      </div>
    </a>
  );

  return (
    <>
      {loading && (
        <div className="loading-screen">
          <img src={logo} alt="Logo" className="loading-logo" />
          <div className="loading-content">
            <p>🍔 Carregando...</p>
          </div>
        </div>
      )}

      <nav className={`navbar ${isSticky ? "sticky" : ""}`}>
        {/* GRUPO ESQUERDA */}
        <div className="nav-left">
          <button
            className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}
            onClick={toggleMobileMenu}
          >
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </button>
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" className="logo" />
            <Link to="/" className="home-icon-link">
            🏠
          </Link>
            <span className="logotext">
              Planet's <strong>Burguer</strong>
            </span>
          </Link>
        </div>

        {/* NOVO GRUPO CENTRO: BANNER DE DELIVERY */}
        <div className="nav-center-group">
          <div className="delivery-banner">
            <img 
          src={bannerDelivery} 
          alt="Propaganda Delivery" 
          className="banner-img"
          style={{ height: '120px', width: 'auto' }} 
          />
          
          </div>
        </div>

        {/* GRUPO CONTATO + CARRINHO */}
        <div className="nav-right-group">
          {!isMobile && <WhatsAppLink />}

          <button onClick={openSidebar} className="sacola-button compact-new">
            <div className="sacola-wrapper">
              <span className="sacola-icon">🛒</span>
              <AnimatePresence>
                {totalItens > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="cart-badge-inner"
                  >
                    {totalItens}x
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <span className="sacola-text-price">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalCart || 0)}
            </span>

            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: isMobile ? 48 : -45 }}
                  exit={{ opacity: 0 }}
                  className="sacola-tooltip"
                >
                  Finalizar Pedido? 🍔
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* RESTANTE DO CÓDIGO (SIDEBAR, CART, ETC) */}
        {/* ... (mantido) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25 }}
                className="mobile-sidebar"
                ref={menuRef}
              >
                <div className="sidebar-header">Categorias</div>
                <ul className="mobile-menu-list">
                  <li>
                    <button
                      className={`menu-item-btn ${location.pathname === "/" ? "ativo" : ""}`}
                      onClick={() => navegarComEfeito("/")}
                    >
                      <span>Início</span> 🏠
                    </button>
                  </li>
                  {categoriasFixas.map(({ nome, rota }, index) => (
                    <motion.li
                      key={nome}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <button
                        className={`menu-item-btn ${location.pathname === rota ? "ativo" : ""}`}
                        onClick={() => navegarComEfeito(rota)}
                      >
                        <span>{nome}</span>
                        <div className="arrow-icon">→</div>
                      </button>
                    </motion.li>
                  ))}
                </ul>
                <div className="sidebar-footer">
                  <WhatsAppLink />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mobile-overlay"
                onClick={() => setMobileMenuOpen(false)}
              />
            </>
          )}
        </AnimatePresence>
        <Cart id="cart" />
        <AnimatePresence>
          {motinhaAtiva && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "120%" }}
              exit={{ opacity: 0 }}
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
