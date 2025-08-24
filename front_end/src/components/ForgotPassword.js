import React, { useState } from "react";
import { api } from "../api/api-client";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setMsg(null);
    setErr(null);

    try {
      const res = await api.post("/reset-password-simple", form);
      setMsg(res.data?.message ?? "Lozinka promenjena.");
      // mali delay pa nazad na login
      setTimeout(() => navigate("/"), 1200);
    } catch (e) {
      const d = e?.response?.data;
      if (d?.errors) {
        const messages = [];
        for (const k in d.errors) messages.push(`${k}: ${d.errors[k].join(", ")}`);
        setErr(messages.join("\n"));
      } else if (d?.message) {
        setErr(d.message);
      } else {
        setErr("Greška prilikom promene lozinke.");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.badge}>eLearn</div>
          <h1 style={styles.title}>Promena lozinke</h1>
          <p style={styles.subtitle}>
            Unesite vaš email i novu lozinku. Biće odmah sačuvana.
          </p>
        </div>

        <form onSubmit={onSubmit} style={styles.form}>
          <label style={styles.label} htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="npr. pera@example.com"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label} htmlFor="password">Nova lozinka</label>
          <div style={styles.pwRow}>
            <input
              id="password"
              type={showPw ? "text" : "password"}
              name="password"
              placeholder="Najmanje 6 karaktera"
              value={form.password}
              onChange={handleChange}
              required
              style={{ ...styles.input, marginBottom: 0, flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              style={styles.pwToggle}
            >
              {showPw ? "Sakrij" : "Prikaži"}
            </button>
          </div>

          <label style={styles.label} htmlFor="password_confirmation">Potvrdi lozinku</label>
          <input
            id="password_confirmation"
            type={showPw ? "text" : "password"}
            name="password_confirmation"
            placeholder="Ponovite lozinku"
            value={form.password_confirmation}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" disabled={sending} style={styles.submit}>
            {sending ? "Čuvam..." : "Sačuvaj novu lozinku"}
          </button>

          {msg && <div style={{ ...styles.alert, ...styles.success }}>{msg}</div>}
          {err && <div style={{ ...styles.alert, ...styles.danger }}>{err}</div>}
        </form>

        <div style={styles.footer}>
          <Link to="/" style={styles.link}>← Nazad na prijavu</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background:
      "radial-gradient(70% 70% at 20% 0%, #eef2ff 0%, #e2e8f0 45%, #f8fafc 100%)",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 520,
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(30,58,138,0.10)",
    overflow: "hidden",
  },
  header: {
    padding: "24px 24px 8px 24px",
    background:
      "linear-gradient(135deg, rgba(30,58,138,0.07), rgba(99,102,241,0.06))",
  },
  badge: {
    display: "inline-block",
    background: "#1e3a8a",
    color: "#fff",
    fontWeight: 700,
    letterSpacing: 0.3,
    borderRadius: 999,
    padding: "6px 12px",
    fontSize: 12,
    marginBottom: 10,
  },
  title: { margin: 0, color: "#0f172a", fontSize: 24, fontWeight: 800 },
  subtitle: { margin: "6px 0 0 0", color: "#475569", fontSize: 14 },
  form: { padding: 24, display: "grid", gap: 12 },
  label: { fontSize: 13, color: "#334155", fontWeight: 600 },
  input: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    outline: "none",
    background: "#f8fafc",
  },
  pwRow: { display: "flex", gap: 8, alignItems: "center", marginBottom: 12 },
  pwToggle: {
    whiteSpace: "nowrap",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    background: "#eef2ff",
    color: "#1e3a8a",
    cursor: "pointer",
    fontWeight: 600,
  },
  submit: {
    marginTop: 8,
    padding: "12px 16px",
    background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(59,130,246,0.35)",
  },
  alert: { marginTop: 12, padding: "10px 12px", borderRadius: 10, fontSize: 14 },
  success: { background: "#ecfdf5", color: "#065f46", border: "1px solid #10b981" },
  danger:  { background: "#fef2f2", color: "#991b1b", border: "1px solid #ef4444" },
  footer: { padding: "0 24px 20px 24px", color: "#475569", fontSize: 14 },
  link: { color: "#1e3a8a", fontWeight: 700, textDecoration: "none" },
};

// Fokus stilovi
(() => {
  const style = document.createElement("style");
  style.innerHTML = `
    input:focus {
      border-color: #93c5fd !important;
      box-shadow: 0 0 0 4px rgba(59,130,246,0.15) !important;
      background: #fff !important;
    }
    button:disabled { opacity: .7; cursor: not-allowed; }
  `;
  if (typeof document !== "undefined") document.head.appendChild(style);
})();

export default ForgotPassword;


