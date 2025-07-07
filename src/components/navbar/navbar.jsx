import React, { useState, useEffect, useContext, useRef } from "react";
import "./navbar.css";
import logo from "../../assets/mascote.png";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../../contexts/cart-context";
import Cart from "../Cart/cart";
import { categoriasFixas } from "../../rotas2"; 

function Navbar() {
  const [isSticky, setSticky] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { totalCart } = useContext(CartContext);
  const menuRef = useRef();
  const location = useLocation();

  const openSidebar = () => {
    const event = new CustomEvent("openSidebar");
    window.dispatchEvent(event);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
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

      <nav className={isSticky ? "navbar sticky" : "navbar"}>
        {/* Mobile esquerdo */}
        <div className="mobile-left">
          <button
            className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Abrir menu mobile"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </button>

          <Link to="/" className="logo-link logo-text-container">
            <img src={logo} alt="Planets Burguer Logo" className="logotipo" />
            <span className="logo-text">Planet's <strong>Burguer</strong></span>
          </Link>
        </div>

        {/* Menu Desktop fixo */}
        <ul className="menu desktop-menu">
          {categoriasFixas.map(({ nome, rota }) => (
            <li key={nome}>
              <Link
                to={rota}
                className={`menu-link ${location.pathname === rota ? "ativo" : ""}`}
              >
                {nome}
              </Link>
            </li>
          ))}
        </ul>

        {/* Botão Sacola */}
        <div className="right-buttons">
          <button onClick={openSidebar} className="sacola-button" aria-label="Abrir sacola">
            <div className="sacola-icon">🛍️</div>
            <span className="sacola-text">
              Sacola <strong>{totalCart && !isNaN(totalCart) ? totalCart.toFixed(2) : "0.00"}</strong>
            </span>
          </button>
        </div>

        {/* Menu Mobile lateral */}
        {isMobileMenuOpen && (
          <div className="mobile-sidebar" ref={menuRef}>
            <ul className="mobile-menu">
              {categoriasFixas.map(({ nome, rota }) => (
                <li key={nome}>
                  <Link to={rota} onClick={toggleMobileMenu}>
                    {nome}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isMobileMenuOpen && <div className="mobile-overlay" />}
        <Cart id="cart" />
      </nav>

      <div className="navbar-space"></div>
    </>
  );
}

export default Navbar;
