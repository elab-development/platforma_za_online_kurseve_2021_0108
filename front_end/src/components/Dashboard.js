import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";
import { FaBookOpen, FaLaptop, FaUserGraduate, FaChartLine } from "react-icons/fa";
import { api } from "../api/api-client";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [quote, setQuote] = useState(null);
  const [qLoading, setQLoading] = useState(true);

  const fetchLearningQuote = async () => {
    setQLoading(true);
    try {
      
      const res = await api.get("/external/quote");
      const { text, author } = res.data || {};
      setQuote({
        text:
          text ||
          "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
        author: author || "Malcolm X",
      });
    } catch (e) {
     
      setQuote({
        text:
          "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
        author: "Malcolm X",
      });
    } finally {
      setQLoading(false);
    }
  };

  useEffect(() => {
    fetchLearningQuote();
   
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

          {/* Motivaciona poruka za učenje */}
          <div style={styles.motivationCard}>
            {qLoading ? (
              <span style={{ opacity: 0.7 }}>Učitavam...</span>
            ) : (
              <>
                <div style={styles.quoteText}>&ldquo;{quote?.text}&rdquo;</div>
                <div style={styles.quoteAuthor}>— {quote?.author}</div>
              </>
            )}
          </div>

          {/* Informativne kartice */}
          <div style={styles.infoSection}>
            <div style={styles.infoBox}>
              <FaBookOpen style={styles.icon} />
              <h3>Pristupite besplatnim kursevima</h3>
              <p>
                Svi naši kursevi su u potpunosti besplatni i dostupni svima. Učite u svom tempu kroz interaktivne video
                lekcije i edukativne materijale koji će vam pomoći da proširite svoja znanja.
              </p>
            </div>
            <div style={styles.infoBox}>
              <FaLaptop style={styles.icon} />
              <h3>Učite bilo gde</h3>
              <p>
                Pristup kursevima je moguć sa bilo kog uređaja – računara, tableta ili telefona. Sve što vam je potrebno
                je internet konekcija. Učenje nikada nije bilo lakše!
              </p>
            </div>
            <div style={styles.infoBox}>
              <FaUserGraduate style={styles.icon} />
              <h3>Osvojite sertifikate</h3>
              <p>
                Po završetku kursa i gledanju svih video lekcija, automatski dobijate sertifikat koji možete koristiti za
                unapređenje svoje karijere ili dalje obrazovanje.
              </p>
            </div>
            <div style={styles.infoBox}>
              <FaChartLine style={styles.icon} />
              <h3>Praćenje napretka</h3>
              <p>
                Pratite svoj napredak kroz kurseve i vidite koliko vam je ostalo do završetka. Obeležavajte završene
                lekcije i učite bez stresa!
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
    background: "#f8faff",
    borderLeft: "4px solid #1e3a8a",
    padding: "12px 16px",
    marginBottom: "18px",
    borderRadius: "6px",
    color: "#1e293b",
  },
  quoteText: { fontSize: "16px", fontStyle: "italic", marginBottom: 6, lineHeight: 1.5 },
  quoteAuthor: { fontSize: "14px", fontWeight: 600, color: "#334155" },

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
    marginTop: "20px",
    padding: "10px",
    fontSize: "14px",
  },
};

export default Dashboard;

