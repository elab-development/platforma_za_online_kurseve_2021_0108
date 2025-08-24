import React, { useContext, useEffect, useState } from "react";
import {
  FaUserGraduate,
  FaBookOpen,
  FaCode,
  FaRobot,
  FaDatabase,
  FaReact,
  FaTrash,
  FaSearch,
  FaTimes
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import { api } from "../api/api-client";
import { AuthContext } from "../context/AuthContext";

const Courses = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 4;

  const [filteredInstructor, setFilteredInstructor] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // <-- NOVO
  const [allCourses, setAllCourses] = useState([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const {
          data: { data },
        } = await api.get("/courses", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        setAllCourses(
          data.map((course) => ({
            id: course.id,
            title: course.title,
            instructor: course.teacher?.name ?? "Nastavnik",
            teacherId: course.teacher?.id,
            link: "#",
            icon: [<FaCode />, <FaRobot />, <FaDatabase />, <FaReact />].sort(
              () => Math.random() - 0.5
            )[0],
          }))
        );
      } catch (e) {
        console.error("Greška pri učitavanju kurseva:", e);
      }
    };

    fetchCourses();
  }, [user?.token]);

  const uniqueInstructors = [...new Set(allCourses.map((c) => c.instructor))];

  // --- Filtriranje: prvo po nazivu (pretraga), pa po nastavniku ---
  const normalized = (s) => (s ?? "").toString().trim().toLowerCase();

  const applyFilters = (list) => {
    let out = list;

    if (normalized(searchTerm).length > 0) {
      const q = normalized(searchTerm);
      out = out.filter((c) => normalized(c.title).startsWith(q));
    }

    if (filteredInstructor) {
      out = out.filter((c) => c.instructor === filteredInstructor);
    }

    return out;
  };

  const filteredCourses = applyFilters(allCourses);

  // --- Paginacija ---
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  const nextPage = () => {
    if (indexOfLastCourse < filteredCourses.length) {
      setCurrentPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  // --- UI akcije ---
  const handleInstructorClick = (instructor) => {
    setFilteredInstructor(instructor);
    setCurrentPage(1);
  };

  const resetFilter = () => {
    setFilteredInstructor(null);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // --- Brisanje kursa ---
  const handleDeleteCourse = async (courseId) => {
    const sure = window.confirm("Da li ste sigurni da želite da obrišete kurs?");
    if (!sure) return;

    try {
      await api.delete(`/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      setAllCourses((prev) => prev.filter((c) => c.id !== courseId));
      alert("Kurs je uspešno obrisan.");
    } catch (err) {
      console.error("DELETE /courses error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      alert(
        err.response?.data?.message ??
          err.response?.data?.error ??
          "Greška prilikom brisanja kursa."
      );
    }
  };

  const canDelete = (course) =>
    user?.role === "admin" ||
    (user?.role === "teacher" && user?.id && user.id === course.teacherId);

  // Enter u polju za pretragu -> pozovi pretragu
  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.mainContent}>
        <div style={styles.dashboardContent}>
          <h1 style={styles.title}>
            <FaBookOpen /> Kursevi
          </h1>

          {/* --- PRETRAGA KURSA (NOVO) --- */}
          <div style={styles.searchBar}>
            <label htmlFor="courseSearch" style={styles.searchLabel}>
              Pretraži kurs:
            </label>
            <input
              id="courseSearch"
              type="text"
              placeholder="npr. 'ja' za 'JavaScript osnove'"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={onSearchKeyDown}
              style={styles.searchInput}
            />
            <button onClick={handleSearch} style={styles.searchButton}>
              <FaSearch style={{ marginRight: 6 }} />
              Pretraži
            </button>
            {searchTerm && (
              <button onClick={clearSearch} style={styles.clearButton}>
                <FaTimes style={{ marginRight: 6 }} />
                Poništi
              </button>
            )}
          </div>

          {/* Lista nastavnika sa klikabilnim filterima */}
          <div style={styles.instructorsList}>
            {uniqueInstructors.map((instructor, index) => (
              <button
                key={index}
                onClick={() => handleInstructorClick(instructor)}
                style={{
                  ...styles.instructorButton,
                  ...(filteredInstructor === instructor
                    ? styles.activeInstructor
                    : {}),
                }}
              >
                <FaUserGraduate style={styles.instructorIcon} /> {instructor}
              </button>
            ))}
            {(filteredInstructor || searchTerm) && (
              <button onClick={resetFilter} style={styles.resetButton}>
                Prikaži sve
              </button>
            )}
          </div>

          {/* Grid kurseva */}
          <div style={styles.coursesGrid}>
            {currentCourses.map((course) => (
              <div key={course.id} style={styles.courseCard}>
                <div style={styles.courseInfo}>
                  <h3 style={styles.courseTitle}>
                    {course.icon} {course.title}
                  </h3>
                  <p style={styles.instructor}>
                    <FaUserGraduate /> {course.instructor}
                  </p>

                  {/* Pogledaj kurs */}
                  <a href={course.link} style={styles.button}>
                    Pogledaj kurs
                  </a>

                  {/* Obriši kurs (samo ovlašćeni) */}
                  {canDelete(course) && (
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      style={{
                        ...styles.button,
                        backgroundColor: "#dc2626",
                        marginLeft: 8,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                      title="Obriši kurs"
                    >
                      <FaTrash />
                      Obriši
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Paginacija */}
          <div style={styles.pagination}>
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              style={styles.pageButton}
            >
              ← Prethodna
            </button>
            <span> Stranica {currentPage} </span>
            <button
              onClick={nextPage}
              disabled={indexOfLastCourse >= filteredCourses.length}
              style={styles.pageButton}
            >
              Sledeća →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    marginBottom: "16px",
  },

  // --- Stilovi za pretragu ---
  searchBar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "center",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  searchLabel: {
    fontWeight: "bold",
  },
  searchInput: {
    minWidth: "260px",
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    outline: "none",
  },
  searchButton: {
    padding: "10px 14px",
    backgroundColor: "#1e3a8a",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
  },
  clearButton: {
    padding: "10px 14px",
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
  },

  // — Nastavnici filter
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

  // — Grid
  coursesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "10px",
  },
  courseCard: {
    background: "#eef2ff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  courseInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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

  // — Paginacija
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
  },
};

export default Courses;

