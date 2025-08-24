import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/api-client";

const Settings = () => {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // Učitaj trenutno ulogovanog korisnika iz baze
  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      setMsg(null);
      try {
        const res = await api.get(`/users/${user.id}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const u = res.data;
        setForm({ name: u.name ?? "", email: u.email ?? "" });
      } catch (e) {
        // Bez prikaza greške korisniku
        console.error("Greška pri učitavanju profila:", e?.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    setMsg(null);

    try {
      const res = await api.put(
        `/users/${user.id}`,
        { name: form.name, email: form.email },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      const updated = res.data?.user ?? {};
      // Sačuvaj u kontekstu (zadrži token!)
      setUser({ ...(user || {}), ...updated, token: user?.token });
      setMsg(res.data?.message || "Profil je uspešno sačuvan.");
    } catch (e) {
      // Bez prikaza greške korisniku
      console.error("Greška pri čuvanju profila:", e?.response?.data || e.message);
      // Po želji: može ostati tiho bez poruke
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <Sidebar />
      <div style={styles.content}>
        <h1 style={styles.title}>Podešavanja</h1>

        {loading ? (
          <div style={styles.card}>Učitavanje…</div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.formCard}>
            <div style={styles.row}>
              <label htmlFor="name" style={styles.label}>Ime i prezime</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="npr. Pera Perić"
              />
            </div>

            <div style={styles.row}>
              <label htmlFor="email" style={styles.label}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="pera@example.com"
              />
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button type="submit" disabled={saving} style={styles.saveBtn}>
                {saving ? "Čuvam…" : "Sačuvaj promene"}
              </button>
              {msg && <span style={{ ...styles.badge, ...styles.success }}>{msg}</span>}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrap: {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
  },
  content: { flex: 1, padding: 20 },
  title: { color: "#1e3a8a", marginBottom: 12, fontWeight: 800 },

  formCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 10px 24px rgba(30,58,138,0.06)",
    maxWidth: 520,
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 16,
    color: "#334155",
    maxWidth: 520,
  },
  row: { display: "grid", gap: 6, marginBottom: 12 },
  label: { fontSize: 13, color: "#334155", fontWeight: 600 },
  input: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    outline: "none",
    background: "#f8fafc",
  },
  saveBtn: {
    padding: "12px 16px",
    background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(59,130,246,0.35)",
  },
  badge: {
    padding: "8px 10px",
    borderRadius: 8,
    fontSize: 13,
    border: "1px solid",
  },
  success: { background: "#ecfdf5", color: "#065f46", borderColor: "#10b981" },
};

export default Settings;


