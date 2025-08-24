import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";
import { FaAward } from "react-icons/fa";

const CertificatesPage = () => {
  const { user } = useContext(AuthContext);
  const [certs, setCerts] = useState([]);

  const certKey = `certificates_${user?.id ?? "guest"}`;

  const load = () => {
    try {
      const raw = localStorage.getItem(certKey);
      const list = raw ? JSON.parse(raw) : [];
      setCerts(Array.isArray(list) ? list : []);
    } catch {
      setCerts([]);
    }
  };

  useEffect(() => {
    load();
    // kada se vrati na tab, osveži
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        <h1 style={styles.title}><FaAward style={{ marginRight: 10 }} /> Sertifikati</h1>

        {certs.length === 0 ? (
          <div style={styles.emptyBox}>
            Nemate još uvek nijedan sertifikat.
          </div>
        ) : (
          <div style={styles.grid}>
            {certs.map((c) => (
              <div key={c.id} style={styles.card}>
                <div style={styles.ribbon}>
                  <FaAward />
                </div>
                <div style={styles.cardBody}>
                  <h3 style={styles.certTitle}>Sertifikat za {c.courseTitle}</h3>
                  <p style={styles.meta}>
                    Izdato za korisnika: <strong>{user?.username}</strong>
                  </p>
                  <p style={styles.metaLight}>
                    Datum: {new Date(c.issuedAt).toLocaleDateString()}
                  </p>
                </div>
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
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
  },
  card: {
    position: "relative",
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    borderRadius: 16,
    boxShadow: "0 4px 14px rgba(30,58,138,0.08)",
    overflow: "hidden",
  },
  ribbon: {
    position: "absolute",
    top: 0,
    right: 0,
    background: "#1e3a8a",
    color: "#fff",
    padding: "10px 12px",
    borderBottomLeftRadius: 12,
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: 16,
  },
  certTitle: {
    margin: "0 0 6px 0",
    color: "#0f172a",
    fontSize: 18,
    fontWeight: 700,
  },
  meta: {
    margin: "6px 0 2px 0",
    color: "#334155",
  },
  metaLight: {
    margin: 0,
    color: "#64748b",
    fontSize: 14,
  },
};

export default CertificatesPage;

