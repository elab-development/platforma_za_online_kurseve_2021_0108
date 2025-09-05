import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/api-client";
import Button from "../components/Button";
import TextInput from "../components/TextInput";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [btnHover, setBtnHover] = useState(false);
  const [regHover, setRegHover] = useState(false);
  const [fpHover, setFpHover] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/login", { email, password });
      const { token, user } = data;

      login(user.id, user.email, user.role, token);
      console.log("Login successful", { email: user.email, role: user.role, token });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed");
      return;
    }
  };

  return (
    <div style={styles.container}>
      {/* dekorativne "meke" mrlje u pozadini */}
      <div style={styles.blobA} />
      <div style={styles.blobB} />

      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logoCircle}>eL</div>
        </div>

        <h2 style={styles.title}>Prijava</h2>
        <p style={styles.subtitle}>
          Dobrodošli nazad u <b>eLearn</b> platformu
        </p>

        <form onSubmit={handleLogin} style={styles.form}>
          <TextInput
            label="Email"
            type="email"
            placeholder="Unesite email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.label}
            inputStyle={styles.input}
          />

          <TextInput
            label="Lozinka"
            type="password"
            placeholder="Unesite lozinku"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.label}
            inputStyle={styles.input}
          />

          <Button
            type="submit"
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              ...styles.button,
              background: btnHover ? "#16387c" : "#1e3a8a",
              transform: btnHover ? "translateY(-1px)" : "translateY(0)",
              boxShadow: btnHover
                ? "0 10px 20px rgba(30,58,138,0.25)"
                : "0 6px 14px rgba(30,58,138,0.18)",
            }}
          >
            Prijava
          </Button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>ili</span>
          <span style={styles.dividerLine} />
        </div>

        <div style={styles.links}>
          <Button
            onClick={() => navigate("/register")}
            onMouseEnter={() => setRegHover(true)}
            onMouseLeave={() => setRegHover(false)}
            variant="ghost"
            style={{
              ...styles.linkButton,
              color: regHover ? "#16387c" : "#1e3a8a",
            }}
          >
            Registracija
          </Button>

          <Button
            onClick={() => navigate("/forgot-password")}
            onMouseEnter={() => setFpHover(true)}
            onMouseLeave={() => setFpHover(false)}
            variant="ghost"
            style={{
              ...styles.linkButton,
              color: fpHover ? "#16387c" : "#1e3a8a",
            }}
          >
            Zaboravljena lozinka?
          </Button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
    background:
      "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 40%, #f8fafc 100%)",
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
  },

  // dekorativne pozadinske mrlje
  blobA: {
    position: "absolute",
    width: 400,
    height: 400,
    background: "radial-gradient(circle at 30% 30%, #93c5fd, transparent 60%)",
    filter: "blur(40px)",
    top: -60,
    left: -80,
    opacity: 0.6,
    pointerEvents: "none",
  },
  blobB: {
    position: "absolute",
    width: 450,
    height: 450,
    background: "radial-gradient(circle at 70% 70%, #c7d2fe, transparent 60%)",
    filter: "blur(40px)",
    bottom: -80,
    right: -100,
    opacity: 0.6,
    pointerEvents: "none",
  },

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#ffffff",
    padding: "28px 26px",
    borderRadius: "16px",
    boxShadow: "0 20px 45px rgba(2, 6, 23, 0.10)",
    textAlign: "left",
    border: "1px solid #e5e7eb",
    position: "relative",
  },

  logoWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 8,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    letterSpacing: "0.5px",
    boxShadow: "0 8px 18px rgba(59,130,246,0.35)",
  },

  title: {
    fontSize: "26px",
    color: "#0f172a",
    margin: "10px 0 6px",
    fontWeight: 800,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#475569",
    marginBottom: 18,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: 700,
    color: "#334155",
    marginTop: 4,
  },
  input: {
    padding: "12px 14px",
    fontSize: "15px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    outline: "none",
    background: "#f8fafc",
    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
    boxShadow: "inset 0 1px 2px rgba(2,6,23,0.04)",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 6,
    transition: "all 0.2s ease",
    boxShadow: "0 6px 14px rgba(30,58,138,0.18)",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
    marginBottom: 6,
    justifyContent: "center",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },

  links: {
    marginTop: "8px",
    display: "flex",
    gap: 10,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  linkButton: {
    background: "transparent",
    border: "none",
    color: "#1e3a8a",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    padding: "6px 8px",
    borderRadius: 8,
    textDecoration: "none",
    transition: "color 0.15s ease, background 0.15s ease",
  },
};

export default Login;


