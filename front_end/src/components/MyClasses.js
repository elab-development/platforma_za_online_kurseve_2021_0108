import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";
import { FaBookOpen } from "react-icons/fa";

const MyClasses = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);

  const watchedKey = `watchedCourses_${user?.id ?? "guest"}`;

  const load = () => {
    try {
      const raw = localStorage.getItem(watchedKey);
      const list = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(list) ? list : []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    load();
    // osveži listu i kada se vrati na stranicu
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        <h1 style={styles.title}><FaBookOpen style={{ marginRight: 10 }} /> Moji časovi</h1>

        {items.length === 0 ? (
          <div style={styles.emptyBox}>
            Niste još uvek pogledali nijedan kurs.
          </div>
        ) : (
          <div style={styles.grid}>
            {items.map((c) => (
              <div key={c.id} style={styles.card}>
                <h3 style={{ margin: 0 }}>{c.title}</h3>
                <p style={{ margin: "6px 0", color: "#334155" }}>
                  Instruktor: {c.instructor ?? "Nastavnik"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
  },
  content: { flex: 1, padding: 20 },
  title: { display: "flex", alignItems: "center", color: "#1e3a8a", marginBottom: 12 },
  emptyBox: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
    color: "#334155",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 20,
  },
  card: {
    background: "#eef2ff",
    padding: 16,
    borderRadius: 14,
    boxShadow: "0 2px 8px rgba(0,0,0,.08)",
  },
};

export default MyClasses;

