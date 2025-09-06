import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/api-client";

const Register = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/register", form);

      // uspeh: postavi user + token i idi na dashboard
      setUser({
        ...(res.data?.data?.user ?? res.data?.user),
        token: res.data?.data?.token ?? res.data?.token,
      });
      navigate("/dashboard");
    } catch (err) {
      const d = err.response?.data;
      
      if (d?.errors) {
        const msgs = [];
        for (const k in d.errors) msgs.push(`${k}: ${d.errors[k].join(", ")}`);
        alert(msgs.join("\n"));
      } else if (d?.message) {
        alert(d.message);
      }
      console.error("Greška pri registraciji:", d || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.badge}>eLearn</div>
          <h1 style={styles.title}>Kreiraj nalog</h1>
          <p style={styles.subtitle}>
            Dobrodošao/la! Popuni podatke ispod i pridruži se platformi.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label} htmlFor="name">Ime i prezime</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="npr. Pera Perić"
            value={form.name}
            onChange={handleChange}
            required
            style={styles.input}
          />

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

          <label style={styles.label} htmlFor="password">Lozinka</label>
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
              aria-label={showPw ? "Sakrij lozinku" : "Prikaži lozinku"}
            >
              {showPw ? "Sakrij" : "Prikaži"}
            </button>
          </div>

          <label style={styles.label} htmlFor="role">Uloga</label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="student">Student</option>
            <option value="teacher">Nastavnik</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" disabled={loading} style={styles.submit}>
            {loading ? "Kreiram nalog..." : "Registruj se u eLearn"}
          </button>
        </form>

        <div style={styles.footer}>
          Već imaš nalog?{" "}
          <Link to="/" style={styles.link}>
            Prijavi se
          </Link>
        </div>
      </div>
    </div>
  );
};

// ——— Stilovi ———
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
  title: {
    margin: 0,
    color: "#0f172a",
    fontSize: 24,
    fontWeight: 800,
  },
  subtitle: {
    margin: "6px 0 0 0",
    color: "#475569",
    fontSize: 14,
  },
  form: {
    padding: 24,
    display: "grid",
    gap: 12,
  },
  label: {
    fontSize: 13,
    color: "#334155",
    fontWeight: 600,
  },
  input: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    outline: "none",
    background: "#f8fafc",
    transition: "box-shadow .15s, border-color .15s",
    fontSize: 14,
  },
  pwRow: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    marginBottom: 12,
  },
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
  select: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    fontSize: 14,
    outline: "none",
  },
  submit: {
    marginTop: 8,
    padding: "12px 16px",
    background:
      "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(59,130,246,0.35)",
  },
  footer: {
    padding: "0 24px 20px 24px",
    color: "#475569",
    fontSize: 14,
  },
  link: {
    color: "#1e3a8a",
    fontWeight: 700,
    textDecoration: "none",
  },
};

// Fokus stilovi 
(() => {
  const style = document.createElement("style");
  style.innerHTML = `
    input:focus, select:focus {
      border-color: #93c5fd !important;
      box-shadow: 0 0 0 4px rgba(59,130,246,0.15) !important;
      background: #fff !important;
    }
    button:disabled { opacity: .7; cursor: not-allowed; }
  `;
  if (typeof document !== "undefined") document.head.appendChild(style);
})();

export default Register;





