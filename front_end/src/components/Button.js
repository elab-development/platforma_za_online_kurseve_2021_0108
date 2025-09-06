import React from "react";

export default function Button({
  children,
  variant = "primary",     
  size = "md",              
  style = {},
  disabled,
  ...props
}) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    border: "1px solid transparent",
    textDecoration: "none",
  };

  const sizes = {
    sm: { padding: "6px 10px", fontSize: 12 },
    md: { padding: "8px 12px", fontSize: 13 },
    lg: { padding: "10px 16px", fontSize: 15 },
  };

  const variants = {
    primary: { background: "#1e3a8a", color: "#fff", borderColor: "#1e3a8a" },
    outline: { background: "#fdfdfdff", color: "#1e3a8a", borderColor: "#1e3a8a" },
    ghost:   { background: "transparent", color: "#1e3a8a" },
  };

  return (
    <button
      disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
