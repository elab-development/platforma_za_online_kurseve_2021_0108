import React from "react";

export default function Card({ title, children, style = {} }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb",
        padding: 16,
        ...style,
      }}
    >
      {title && (
        <div style={{ fontWeight: 700, marginBottom: 8, color: "#1e293b" }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
