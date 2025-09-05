import React from "react";

export default function TextInput({
  label,
  error,
  type = "text",
  style = {},
  inputStyle = {},
  ...props
}) {
  return (
    <label style={{ display: "block", marginBottom: 12, ...style }}>
      {label && (
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#334155" }}>
          {label}
        </div>
      )}
      <input
        type={type}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #cbd5e1",
          outline: "none",
          fontSize: 14,
          ...inputStyle,
        }}
        {...props}
      />
      {error && (
        <div style={{ color: "#b91c1c", fontSize: 12, marginTop: 4 }}>
          {error}
        </div>
      )}
    </label>
  );
}
