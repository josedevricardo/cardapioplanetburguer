import React from "react";
import "./smoothScrollWrapper.css"; // Crie um arquivo CSS para estilizar o componente

const SmoothScrollWrapper = ({ children }) => {
  return <div className="smooth-scroll-wrapper">{children}</div>;
};

export default SmoothScrollWrapper;
