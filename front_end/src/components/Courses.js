import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  FaUserGraduate,
  FaBookOpen,
  FaCode,
  FaRobot,
  FaDatabase,
  FaReact,
  FaTrash,
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import { api } from "../api/api-client";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/Button";
import TextInput from "../components/TextInput";

const Courses = () => {
  const { user } = useContext(AuthContext);     // trenutno ulogovan korisnik

  const [allCourses, setAllCourses] = useState([]);   // lista svih kurseva koji postoje u bazi
  const [courses, setCourses] = useState([]);        // lista kurseva nakon sto je korisnik izvrsio filtriranje

  const [searchTerm, setSearchTerm] = useState("");   //tekst iz pretrage
  const [filteredInstructor, setFilteredInstructor] = useState("");   //odabran nastavnik po filteru

  // Klijentska paginacija
  const [page, setPage] = useState(1);
  const perPage = 4;                                // prikazuju se 4 kurseva po stranici 

  // — YouTube pretraga (playlist)
  const youtubeLinkFor = (title) => {
    const t = (title || "").toLowerCase();
    const map = [
      { k: "javascript", q: "JavaScript tutorial playlist" },
      { k: "typescript", q: "TypeScript tutorial playlist" },
      { k: "react", q: "React tutorial playlist" },
      { k: "java", q: "Java tutorial playlist" },
      { k: "python", q: "Python tutorial playlist" },
      { k: "c++", q: "C++ tutorial playlist" },
      { k: "c#", q: "C# tutorial playlist" },
      { k: "sql", q: "SQL tutorial playlist" },
      { k: "laravel", q: "Laravel tutorial playlist" },
      { k: "php", q: "PHP tutorial playlist" },
      { k: "html", q: "HTML CSS tutorial playlist" },
      { k: "css", q: "CSS tutorial playlist" },
      { k: "node", q: "Node.js tutorial playlist" },
      { k: "spring", q: "Spring Boot tutorial playlist" },
      { k: "android", q: "Android development playlist" },
      { k: "docker", q: "Docker tutorial playlist" },
      { k: "machine", q: "Machine Learning playlist" },
      { k: "algorithm", q: "Data Structures and Algorithms playlist" },
    ];
    let query = null;
    for (const { k, q } of map) {
      if (t.includes(k)) {
        query = q;
        break;
      }
    }
    if (!query && /\bc(?!\+|#)\b/.test(t))
      query = "C programming tutorial playlist";
    if (!query) query = "programming course playlist";
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(
      query
    )}`;
  };

  // — Učitaj kurseve
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const {
          data: { data },
        } = await api.get("/courses", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });

        setAllCourses(
          data.map((course) => ({
            id: course.id,
            title: course.title,
            instructor: course.teacher?.name ?? "Nastavnik",
            teacherId: course.teacher?.id,
            link: youtubeLinkFor(course.title),
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
  }, []);

  const watchedKey = `watchedCourses_${user?.id ?? "guest"}`;                // cuvamo lokalno koje je sve kurseve taj korisnik pogledao
  const getWatched = () => {
    try {
      return JSON.parse(localStorage.getItem(watchedKey) || "[]");
    } catch {
      return [];
    }
  };
  const saveWatched = (list) => {
    try {
      localStorage.setItem(watchedKey, JSON.stringify(list));
    } catch {}
  };

  const certKey = `certificates_${user?.id ?? "guest"}`;                   // cuvamo lokalno koje je sertifikate sve taj korisnik dobio
  const getCerts = () => {
    try {
      return JSON.parse(localStorage.getItem(certKey) || "[]");
    } catch {
      return [];
    }
  };
  const saveCerts = (list) => {
    try {
      localStorage.setItem(certKey, JSON.stringify(list));
    } catch {}
  };

  // — Backend upis sertifikata
  const saveCertificateToBackend = async (courseId) => {
    const payload = { certificate: "Sertifikat", course_id: courseId };
    try {
      await api.post("/certificates/store", payload, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404 || status === 405) {
        await api.post("/certificates", payload, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
      } else {
        throw err;
      }
    }
  };


  const enrollInCourse = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`, null, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
    } catch (e) {
      if (![400, 409].includes(e?.response?.status)) {
        console.warn("Enroll error:", e?.response?.data || e.message);
      }
    }
  };

  const recordWatchedCourse = async (course) => {            //evidentiramo gledanje kursa i sertifikat
    if (!user || user.role !== "student") return;

    const current = getWatched();
    if (!current.some((c) => c.id === course.id)) {             // proveravamo da li je taj student vec pogledao taj kurs, radi evidencije
      saveWatched([
        { id: course.id, title: course.title, instructor: course.instructor },
        ...current,
      ]);
    }

    const certs = getCerts();
    if (!certs.some((c) => c.id === course.id)) {        // proveravamo da li taj student vec ima taj sertifikat, necemo duplo
      saveCerts([
        {
          id: course.id,
          courseTitle: course.title,
          issuedAt: new Date().toISOString(),
        },
        ...certs,
      ]);
      try {
        await saveCertificateToBackend(course.id);
      } catch (err) {
        console.error(
          "Greška pri snimanju sertifikata:",
          err?.response?.data || err.message
        );
      }
    }
  };

  const handleViewCourse = async (course) => {
    try {
      await enrollInCourse(course.id);
      await recordWatchedCourse(course);
    } finally {
      window.open(course.link, "_blank", "noopener,noreferrer");
    }
  };

  const canDelete = (course) =>
    user?.role === "teacher" && user?.id && user.id === course.teacherId;  // ko moze da brise kurs

  const handleDeleteCourse = async (courseId) => {
    const sure = window.confirm("Da li ste sigurni da želite da obrišete kurs?");    // brisanje kursa
    if (!sure) return;

    try {
      await api.delete(`/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      setAllCourses((prev) => prev.filter((c) => c.id !== courseId));
      setCourses((prev) => prev.filter((c) => c.id !== courseId));

      const current = getWatched().filter((c) => c.id !== courseId);
      saveWatched(current);
      const certs = getCerts().filter((c) => c.id !== courseId);
      saveCerts(certs);

      setTimeout(() => {
        const totalAfter = applyFilters(
          allCourses.filter((c) => c.id !== courseId)
        ).length;
        const lastPageAfter = Math.max(1, Math.ceil(totalAfter / perPage));
        setPage((p) => Math.min(p, lastPageAfter));
      }, 0);

      alert("Kurs je uspešno obrisan.");
    } catch (err) {
      console.error("DELETE /courses error:", err);
      alert(
        err?.response?.data?.message ??
          err?.response?.data?.error ??
          "Greška prilikom brisanja kursa."
      );
    }
  };

  // — Filteri
  const uniqueInstructors = [...new Set(allCourses.map((c) => c.instructor))];
  const normalized = (s) => (s ?? "").toString().trim().toLowerCase();            

  const applyFilters = (list) => {                       // deo za filtriranje, prvo primenjujemo filter po search delu pa po nastavniku
    let out = list;
    if (normalized(searchTerm)) {
      const q = normalized(searchTerm);
      out = out.filter((c) => normalized(c.title).startsWith(q));
    }
    if (filteredInstructor) {
      out = out.filter((c) => c.instructor === filteredInstructor);
    }
    return out;
  };

  useEffect(() => {
    const filtered = applyFilters(allCourses);
    setCourses(filtered);                             // ucitavamo sada novu, filtriranu listu kurseva
    setPage(1);
  }, [allCourses, searchTerm, filteredInstructor]); 

  // — Paginacija
  const { visibleCourses, totalPages, totalCount } = useMemo(() => {
    const total = courses.length;                        //ukupno kurseva
    const last = Math.max(1, Math.ceil(total / perPage));//ukupno strana
    const safePage = Math.min(Math.max(1, page), last);  //ogranicimo da bude izmedju 1 i last
    const start = (safePage - 1) * perPage;
    const end = start + perPage;
    return {
      visibleCourses: courses.slice(start, end),
      totalPages: last,
      totalCount: total,
    };
  }, [courses, page]);

  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        <h1 style={styles.title}>
          <FaBookOpen style={{ marginRight: 10 }} />
          Kursevi
        </h1>

        <div style={styles.filtersRow}>
          <div style={styles.searchGroup}>
            <label htmlFor="courseSearch" style={{ fontWeight: 600 }}>
              Pretraga:
            </label>

            <TextInput
              type="text"
              placeholder="npr. 'ja' za 'JavaScript osnove'"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              inputStyle={styles.searchInput}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontWeight: 600 }}>Instruktor:</span>

            <Button
              onClick={() => setFilteredInstructor("")}
              style={{
                ...styles.instructorButton,
                ...(filteredInstructor === ""
                  ? styles.instructorButtonActive
                  : {}),
              }}
            >
              Svi
            </Button>

            {uniqueInstructors.map((ins) => (
              <Button
                key={ins}
                onClick={() => setFilteredInstructor(ins)}
                style={{
                  ...styles.instructorButton,
                  ...(filteredInstructor === ins
                    ? styles.instructorButtonActive
                    : {}),
                }}
              >
                {ins}
              </Button>
            ))}
          </div>
        </div>

        <div style={styles.coursesGrid}>
          {visibleCourses.map((course) => (
            <div key={course.id} style={styles.courseCard}>
              <div style={styles.iconContainer}>{course.icon}</div>
              <h3 style={styles.courseTitle}>
                <FaBookOpen style={{ marginRight: 8 }} />
                {course.title}
              </h3>
              <p style={styles.instructor}>
                <FaUserGraduate /> {course.instructor}
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button
                  type="button"
                  style={styles.button}
                  onClick={() => handleViewCourse(course)}
                >
                  Pogledaj kurs
                </Button>

                {canDelete(course) && (
                  <Button
                    onClick={() => handleDeleteCourse(course.id)}
                    style={{ ...styles.button, backgroundColor: "#dc2626" }}
                    title="Obriši kurs"
                  >
                    <FaTrash style={{ marginRight: 6 }} />
                    Obriši kurs
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.pager}>
          <Button
            style={{
              ...styles.pageBtn,
              ...(isPrevDisabled
                ? styles.pageBtnDisabled
                : styles.pageBtnActive),
            }}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={isPrevDisabled}
          >
            ← Prethodna
          </Button>
          <span>
            Strana {Math.min(page, totalPages)} / {totalPages} • {totalCount}{" "}
            kurs(eva)
          </span>
          <Button
            style={{
              ...styles.pageBtn,
              ...(isNextDisabled
                ? styles.pageBtnDisabled
                : styles.pageBtnActive),
            }}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={isNextDisabled}
          >
            Sledeća →
          </Button>
        </div>
      </div>
    </div>
  );
};

// — Stilovi —
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
  },
  content: { flex: 1, padding: "20px" },
  title: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#1e3a8a",
    marginBottom: "10px",
  },
  filtersRow: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "12px",
    marginBottom: "20px",
  },
  searchGroup: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
  },
  searchInput: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    minWidth: "260px",
  },
  instructorButton: {
    padding: "8px 12px",
    borderRadius: "9999px",
    border: "1px solid #cbd5e1",
    background: "white",
    cursor: "pointer",
    color: "#0f172a",
    fontWeight: 600,
  },
  instructorButtonActive: {
    background: "#1e3a8a",
    color: "white",
    borderColor: "#1e3a8a",
  },
  coursesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "10px",
  },
  courseCard: {
    background: "#eef2ff",
    padding: "16px",
    borderRadius: "14px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    transition: "transform .2s ease",
  },
  iconContainer: { fontSize: "38px", color: "#1e3a8a", marginBottom: "8px" },
  courseTitle: {
    fontSize: "18px",
    margin: 0,
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
  },
  instructor: { color: "#334155", marginTop: "6px", marginBottom: "12px" },
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
  pager: {
    marginTop: 20,
    display: "flex",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  pageBtn: {
    padding: "8px 12px",
    border: "none",
    borderRadius: 8,
    fontWeight: 700,
    cursor: "pointer",
    minWidth: 110,
    textAlign: "center",
  },
  pageBtnActive: {
    background: "#1e3a8a",
    color: "#fff",
  },
  pageBtnDisabled: {
    background: "#e5e7eb",
    color: "#94a3b8",
    cursor: "not-allowed",
  },
};

export default Courses;



