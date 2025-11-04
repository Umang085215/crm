import React from "react";

const Button = ({ text, type, className = "", icon, handleClick }) => {
  return (
    <button
      type={type}
      onClick={handleClick ? handleClick : () => {}}
      className={` w-max flex items-center gap-2 py-2 px-3 rounded transition ${className} bg-var(--dark)`}
      style={{
        backgroundColor: "var(--dark)",
        color: "#fff",
      }}
    >
      {icon}
      {text}
    </button>
  );
};

export default Button;
