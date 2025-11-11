// src/components/SearchBar.jsx
import React, { useEffect, useRef } from "react";
import "./SearchBar.css";

const SearchBar = ({ busca, setBusca }) => {
  const inputRef = useRef(null);

  const handleInputChange = (event) => {
    setBusca(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // Delay pequeno para garantir que o teclado móvel feche
      setTimeout(() => {
        if (inputRef.current) inputRef.current.blur();
      }, 100);

      // Rola a tela para o primeiro produto encontrado
      setTimeout(() => {
        const firstProduto = document.querySelector(".produto-card"); // ajuste para sua classe real
        if (firstProduto) {
          firstProduto.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  };

  useEffect(() => {
    // Fecha o teclado se clicar fora do input
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        inputRef.current.blur();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="search-bar-wrapper">
      <div className="search-bar">
        <svg
          className={`search-icon ${busca ? "active" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="21"
            y1="21"
            x2="16.65"
            y2="16.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar pedido..."
          value={busca}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // <-- mudou de onKeyPress para onKeyDown
        />
      </div>
    </div>
  );
};

export default SearchBar;
