import React from "react";
import "./SearchBar.css";

const SearchBar = ({ busca, setBusca }) => {
  const handleInputChange = (event) => {
    setBusca(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.target.blur();
    }
  };

  return (
    <div className="search-bar-wrapper">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar aqui seu pedido..."
          value={busca}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <svg
          className="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0a7 7 0 1110-10 7 7 0 01-10 10z"
          />
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;
