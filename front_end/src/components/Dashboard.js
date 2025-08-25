import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar"; 
import { FaBookOpen, FaLaptop, FaUserGraduate, FaChartLine } from "react-icons/fa"; 
import { api } from "../api/api-client";

const Dashboard = () => {
  const [quote, setQuote] = useState(null);
  const [qLoading, setQLoading] = useState(true);

  useEffect(() => {
    const loadQuote = async () => {
      try {
        const res = await api.get("/external/quote"); // GET /api/external/quote
        if (res?.data?.text) {
          setQuote(res.data);
        } else {
          // fallback ako backend vrati nešto neočekivano
          setQuote({ text: "Uči danas, uspeh dolazi sutra.", author: "eLearn" });
        }
      } catch (e) {
        console.error("Greška pri učitavanju citata:", e?.response?.data || e.message);
        // lokalni fallback da UI nikad nije prazan
        setQuote({ text: "Uči danas, uspeh dolazi sutra.", author: "eLearn" });
      } finally {
        setQLoading(false);
      }
    };
    loadQuote();
  }, []);

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        <div style={styles.dashboardContent}>
          <h1 style={styles.title}>
            Dobrodošli u <span style={styles.highlight}>eLearn</span>!
          </h1>
          <p style={styles.subtitle}>
            <i>Najbolja platforma za online učenje i napredak.</i>
          </p>

          {/* Motivaciona poruka */}
          <div style={styles.motivationCard}>
            {qLoading ? (
              <span style={{ opacity: 0.7 }}>Učitavam motivacionu poruku…</span>
            ) : (
              <>
                <div style={styles.quoteText}>&ldquo;{quote?.text}&rdquo;</div>
                <div style={styles.quoteAuthor}>— {quote?.author || "Nepoznat autor"}</div>
              </>
            )}
          </div>

          <div style={styles.infoSection}>
            <div style={styles.infoBox}>
              <FaBookOpen style={styles.icon} />
              <h3>Pristupite besplatnim kursevima</h3>
              <p>
                Svi naši kursevi su u potpunosti besplatni i dostupni svima.  
                Učite u svom tempu kroz interaktivne video lekcije i edukativne materijale  
                koji će vam pomoći da proširite svoja znanja.
              </p>
            </div>
            <div style={styles.infoBox}>
              <FaLaptop style={styles.icon} />
              <h3>Učite bilo gde</h3>
              <p>
                Pristup kursevima je moguć sa bilo kog uređaja – računara,  
                tableta ili telefona. Sve što vam je potrebno je internet konekcija.  
                Učenje nikada nije bilo lakše!
              </p>
            </div>
            <div style={styles.infoBox}>
              <FaUserGraduate style={styles.icon} />
              <h3>Osvojite sertifikate</h3>
              <p>
                Po završetku kursa i gledanju svih video lekcija,  
                automatski dobijate sertifikat koji možete koristiti za unapređenje  
                svoje karijere ili dalje obrazovanje.
              </p>
            </div>
            <div style={styles.infoBox}>
              <FaChartLine style={styles.icon} />
              <h3>Praćenje napretka</h3>
              <p>
                Pratite svoj napredak kroz kurseve i vidite koliko vam je  
                ostalo do završetka. Obeležavajte završene lekcije i učite bez stresa!
              </p>
            </div>
          </div>
        </div>
        <footer style={styles.footer}>
          <p>&copy; {new Date().getFullYear()} eLearn. Sva prava zadržana.</p>
        </footer>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f7fc",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "100vh",
  },
  dashboardContent: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    width: "80%",
    textAlign: "center",
    maxWidth: "1000px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: "10px",
  },
  highlight: { color: "#ff9800" },
  subtitle: { fontSize: "18px", color: "#555", marginBottom: "18px" },

  motivationCard: {
    background: "linear-gradient(135deg, #eef2ff 0%, #dbeafe 100%)",
    border: "1px solid #c7d2fe",
    color: "#0f172a",
    padding: "16px",
    borderRadius: "12px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "18px",
  },
  quoteText: { fontSize: "18px", fontStyle: "italic", lineHeight: 1.5 },
  quoteAuthor: { marginTop: "8px", fontWeight: 700, color: "#1e3a8a" },

  // ⬇️ Jedina bitna promena: fiksno 2 kolone (2 gore + 2 dole)
  infoSection: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  infoBox: {
    background: "#eef2ff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    transition: "transform 0.3s ease",
  },
  icon: { fontSize: "40px", color: "#1e3a8a", marginBottom: "10px" },
  footer: {
    textAlign: "center",
    background: "#1e3a8a",
    color: "white",
    width: "100%",
    borderTopLeftRadius: "2px",
    borderTopRightRadius: "2px",
    marginTop: "20px",
    padding: "10px",
    fontSize: "14px",
  },
};

export default Dashboard;


