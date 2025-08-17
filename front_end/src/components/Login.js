import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Adjust the path as necessary
import { api } from "../api/api-client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    // Ovde ide logika za autentifikaciju

    try {
      const {data} = await api.post("/login", {
        email,
        password,
      });
      const { token, user } = data;

      login(user.id, user.email, user.role, token); // Pozivamo login funkciju iz AuthContext
      console.log("Login successful", { email: user.email, role: user.role, token });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed");
      return;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Prijava</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Unesite email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Unesite lozinku"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Prijava</button>
        </form>
        <div style={styles.links}>
          <button onClick={() => navigate("/register")} style={styles.linkButton}>
            Registracija
          </button>
          <button onClick={() => navigate("/forgot-password")} style={styles.linkButton}>
            Zaboravljena lozinka?
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f7f7f7",
  },
  card: {
    width: "350px",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    margin: "12px 0",
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  inputFocus: {
    borderColor: "#007bff",
  },
  button: {
    padding: "12px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  links: {
    marginTop: "20px",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#007bff",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "underline",
    margin: "5px",
  },
};

export default Login;
