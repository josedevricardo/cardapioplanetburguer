import React, { useEffect, useRef } from "react";
import "./SearchBar.css";

const SearchBar = ({ busca, setBusca, onSearch }) => {
  const inputRef = useRef(null);

  const executarBusca = (event) => {
    // Previne o recarregamento da página (essencial para o blur funcionar no mobile)
    if (event) event.preventDefault();

    // 1. Faz o teclado sumir imediatamente
    if (inputRef.current) {
      inputRef.current.blur();
    }

    // Alternativa "força bruta" se o ref falhar em alguns navegadores:
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // 2. Dispara a lógica de exibir o produto/popup
    if (onSearch) {
      onSearch(busca);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        inputRef.current.blur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="search-bar-wrapper">
      {/* O uso do <form> ajuda o sistema mobile a entender o fim da edição */}
      <form className="search-bar" onSubmit={executarBusca}>
        <svg
          className={`search-icon ${busca ? "active" : ""}`}
          onClick={executarBusca}
          style={{ cursor: 'pointer' }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="7" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        
        <input
          ref={inputRef}
          type="search"
          placeholder="Buscar pedido..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          // 'enterKeyHint' diz ao teclado para mostrar "Buscar" ou "Ir"
          enterKeyHint="search"
          // Garante que o teclado suma ao clicar em "Ir/Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              executarBusca(e);
            }
          }}
        />
      </form>
    </div>
  );
};

export default SearchBar;