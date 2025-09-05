import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api/api-client";

const AllUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | student | teacher
  const [search, setSearch] = useState("");

  // Učitaj sve nastavnike i studente
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/users", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setUsers(res.data?.data ?? []);
      } catch (e) {
        console.error("Greška pri učitavanju korisnika:", e?.response?.data || e.message);
        alert(
          e?.response?.data?.message ||
          "Greška pri učitavanju korisnika."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
    
  }, []);

  const handleDelete = async (id) => {
    const sure = window.confirm("Da li ste sigurni da želite da obrišete ovog korisnika?");
    if (!sure) return;

    try {
      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      console.error("Greška pri brisanju korisnika:", e?.response?.data || e.message);
      alert(
        e?.response?.data?.message ||
        "Greška pri brisanju korisnika."
      );
    }
  };

  const normalized = (s) => (s ?? "").toString().toLowerCase().trim();

  const filtered = users
    .filter((u) => (filter === "all" ? true : u.role === filter))
    .filter((u) => {
      const q = normalized(search);
      if (!q) return true;
      return (
        normalized(u.name).includes(q) ||
        normalized(u.email).includes(q)
      );
    });

  return (
    <div style={styles.wrap}>
      <Sidebar />
      <div style={styles.content}>
        <h1 style={styles.title}>Upravljanje korisnicima</h1>

        <div style={styles.toolbar}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Pretraga po imenu ili email-u"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.input}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={styles.select}
            >
              <option value="all">Svi</option>
              <option value="student">Studenti</option>
              <option value="teacher">Nastavnici</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={styles.card}>Učitavanje...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.card}>Nema korisnika za prikaz.</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Ime</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Uloga</th>
                  <th style={styles.th} />
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} style={styles.tr}>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.roleBadge,
                        background: u.role === "teacher" ? "#eef2ff" : "#ecfeff",
                        borderColor: u.role === "teacher" ? "#c7d2fe" : "#a5f3fc",
                        color: u.role === "teacher" ? "#1e3a8a" : "#155e75",
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={styles.tdRight}>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(u.id)}
                        title="Obriši korisnika"
                      >
                        Obriši
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  input: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    minWidth: 240,
    background: "#f8fafc",
    outline: "none",
  },
  select: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    outline: "none",
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
    color: "#334155",
  },
  tableWrap: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    background: "#f1f5f9",
    color: "#0f172a",
    fontWeight: 700,
    borderBottom: "1px solid #e5e7eb",
  },
  tr: {
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "12px",
    color: "#334155",
  },
  tdRight: {
    padding: "12px",
    textAlign: "right",
  },
  roleBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "capitalize",
  },
  deleteBtn: {
    padding: "8px 12px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
  },
};

export default AllUsers;

