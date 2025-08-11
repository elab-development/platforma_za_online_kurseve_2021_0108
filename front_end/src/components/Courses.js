import React, { useState, useMemo } from "react";
import { FaUserGraduate, FaBookOpen, FaCode, FaPaintBrush, FaRobot, FaDatabase, FaReact, FaPython, FaShieldAlt, FaGlobe } from "react-icons/fa";
import Sidebar from "./Sidebar";
import useFetch from "../hooks/useFetch";
import Breadcrumbs from "./Breadcrumbs";

/**
 * Lokalni fallback kursevi
 */
const localCourses = [
  { title: "Kompletan JavaScript Kurs 2022", instructor: "Marko Petrović", link: "#", icon: <FaCode /> },
  { title: "Online HTML & CSS kurs", instructor: "Ivana Jovanović", link: "#", icon: <FaGlobe /> },
  { title: "React od nule do heroja", instructor: "Nikola Stojanović", link: "#", icon: <FaReact /> },
  { title: "Python za početnike", instructor: "Ana Milovanović", link: "#", icon: <FaPython /> },
  { title: "Full Stack Web Development", instructor: "Stefan Lazić", link: "#", icon: <FaDatabase /> },
  { title: "Machine Learning", instructor: "Marko Petrović", link: "#", icon: <FaRobot /> },
  { title: "UX/UI Design Masterclass", instructor: "Ivana Jovanović", link: "#", icon: <FaPaintBrush /> },
  { title: "Cyber Security Basics", instructor: "Nikola Stojanović", link: "#", icon: <FaShieldAlt /> }
];

/**
 * Primer API endpointa:
 * - Ako imaš svoj backend: ubaci npr. "/api/courses" ili punu URL adresu
 * - Ako nemaš backend sada, možeš ostaviti neki javni endpoint ili prazan string da force fallback
 */
const COURSES_API_URL = process.env.REACT_APP_COURSES_API || "https://jsonplaceholder.typicode.com/users";

/**
 * Helper: mapiraj "raw" API podatke u oblik koji komponenta očekuje.
 * Za jsonplaceholder koristimo name kao instructor i pravimo dummy kursove.
 * Ako imaš pravi API, prilagodi map funkciju ili baci direktno data ako je već u odgovarajućem obliku.
 */
const mapApiToCourses = (apiData) => {
  if (!Array.isArray(apiData)) return null;

  // Ako API vraća već kurseve u istom obliku, možeš direktno vratiti apiData
  // Ali za primer sa jsonplaceholder ćemo iz svakog usera napraviti kurs
  const mapped = apiData.slice(0, 8).map((u, idx) => ({
    title: u.company?.bs
      ? `${u.company.bs.split(" ")[0].charAt(0).toUpperCase() + u.company.bs.split(" ")[0].slice(1)} kurs`
      : `Kurs ${idx + 1}`,
    instructor: u.name || `Predavač ${idx + 1}`,
    link: "#",
    icon: localCourses[idx]?.icon || <FaBookOpen />
  }));
  return mapped;
};

const Courses = () => {
  // useFetch: pokuša da povuče, ako error => data će biti fallback
  const { data: apiData, loading, error } = useFetch(COURSES_API_URL, {}, null);

  // Ako apiData postoji i mapira se, koristimo ga; inače koristimo lokalne kurseve
  const derivedCourses = useMemo(() => {
    const mapped = mapApiToCourses(apiData);
    return mapped && mapped.length ? mapped : localCourses;
  }, [apiData]);

  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;
  const [filteredInstructor, setFilteredInstructor] = useState(null);

  // Generišemo listu instruktora iz trenutno aktivnih kurseva
  const uniqueInstructors = useMemo(() => {
    return [...new Set(derivedCourses.map(course => course.instructor))];
  }, [derivedCourses]);

  const filteredCourses = filteredInstructor
    ? derivedCourses.filter(course => course.instructor === filteredInstructor)
    : derivedCourses;

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const nextPage = () => {
    if (indexOfLastCourse < filteredCourses.length) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleInstructorClick = (instructor) => {
    setFilteredInstructor(instructor);
    setCurrentPage(1);
  };

  const resetFilter = () => {
    setFilteredInstructor(null);
    setCurrentPage(1);
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        <div style={styles.dashboardContent}>
          <Breadcrumbs />
          <h1 style={styles.title}><FaBookOpen /> Kursevi</h1>

          {/* Ako fetch traje ili se desila greška, obavesti korisnika (ali i dalje prikaži fallback) */}
          {loading && <p style={{ color: "#555" }}>Učitavanje podataka...</p>}
          {error && <p style={{ color: "darkorange" }}>Ne mogu da povučem podatke sa API-ja — koristi se lokalni sadržaj.</p>}

          {/* Lista nastavnika sa klikabilnim filterima */}
          <div style={styles.instructorsList}>
            {uniqueInstructors.map((instructor, index) => (
              <button
                key={index}
                onClick={() => handleInstructorClick(instructor)}
                style={{
                  ...styles.instructorButton,
                  ...(filteredInstructor === instructor ? styles.activeInstructor : {}),
                }}
              >
                <FaUserGraduate style={styles.instructorIcon} /> {instructor}
              </button>
            ))}
            {filteredInstructor && (
              <button onClick={resetFilter} style={styles.resetButton}>Prikaži sve</button>
            )}
          </div>

          <div style={styles.coursesGrid}>
            {currentCourses.map((course, index) => (
              <div key={index} style={styles.courseCard}>
                <div style={styles.courseInfo}>
                  <h3 style={styles.courseTitle}>
                    {course.icon} {course.title}
                  </h3>
                  <p style={styles.instructor}><FaUserGraduate /> {course.instructor}</p>
                  <a href={course.link} style={styles.button}>Pogledaj kurs</a>
                </div>
              </div>
            ))}
            {currentCourses.length === 0 && <p>Nema kurseva za izabrane filtere.</p>}
          </div>

          <div style={styles.pagination}>
            <button onClick={prevPage} disabled={currentPage === 1} style={styles.pageButton}>← Prethodna</button>
            <span> Stranica {currentPage} </span>
            <button onClick={nextPage} disabled={indexOfLastCourse >= filteredCourses.length} style={styles.pageButton}>Sledeća →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- stilovi ostaju isti kao pre (kopirano iz tvog originalnog fajla) ---
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f4f7fc",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
    fontSize: "30px",
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: "20px",
  },
  instructorsList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "20px",
  },
  instructorButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  activeInstructor: {
    backgroundColor: "#0056b3",
  },
  instructorIcon: {
    marginRight: "8px",
  },
  resetButton: {
    marginLeft: "10px",
    padding: "10px 20px",
    backgroundColor: "#ccc",
    color: "black",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  coursesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  courseCard: {
    background: "#eef2ff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  courseTitle: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  instructor: {
    fontSize: "14px",
    color: "#555",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textDecoration: "none",
  },
  pagination: {
    marginTop: "20px",
  },
  pageButton: {
    margin: "5px",
    padding: "8px 15px",
    border: "none",
    backgroundColor: "#1e3a8a",
    color: "white",
    cursor: "pointer",
    borderRadius: "5px",
  }
};

export default Courses;

