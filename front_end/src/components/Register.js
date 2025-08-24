import React, { useState, useContext } from "react";
import { api } from "../api/api-client";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",        // Ime i prezime (jedno polje)
    email: "",
    password: "",
    role: "student", // "student" | "teacher" | "admin" (po potrebi)
    agree: false,
  });

  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.agree) {
      alert("Potrebno je označiti saglasnost.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      // backend vraća token i user
      setUser({
        id: data.user.id,
        username: data.user.name, // ako negde koristiš username u UI-ju
        role: data.user.role,
        token: data.token,
      });
      alert("Registracija uspešna!");
      // opcionalno: redirect na /login ili /courses
      // navigate("/courses");
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || "Greška pri registraciji.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={onSubmit} style={styles.card}>
        <h1 style={styles.title}>Registracija</h1>

        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Ime i prezime"
          value={form.name}
          onChange={onChange}
          required
        />

        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
        />

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Lozinka"
          value={form.password}
          onChange={onChange}
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={onChange}
          style={styles.input}
        >
          <option value="student">Student</option>
          <option value="teacher">Nastavnik</option>
          {/* <option value="admin">Admin</option>  // ostavi ako želiš ručno kreiranje admina */}
        </select>

        <label style={styles.checkboxRow}>
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={onChange}
          />
          <span style={{ marginLeft: 8 }}>Registrujem se u eLearn</span>
        </label>

        <button type="submit" style={styles.submit} disabled={loading}>
          {loading ? "Slanje..." : "Registracija"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f7fc",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 520,
    background: "white",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 8px 24px rgba(0,0,0,.08)",
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    marginBottom: 12,
    outline: "none",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 12,
  },
  submit: {
    width: "100%",
    padding: "12px 14px",
    border: "none",
    borderRadius: 8,
    background: "#1e3a8a",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default Register;

