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
          type="text"
          placeholder="Buscar seu preferido..."
          value={busca}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default SearchBar;
