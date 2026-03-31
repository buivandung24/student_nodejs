import { useEffect, useState } from "react";
import { C, S } from "../constants/styles";
import Btn from "../components/Btn";
import Input from "../components/Input";
import Select from "../components/Select";
import api from "../services/api";

export default function GradeManagementPage() {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [cls, setCls] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const [grades, setGrades] = useState({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    const loadBase = async () => {
      try {
        const [classesData, coursesData] = await Promise.all([
          api.get("/classes"),
          api.get("/courses"),
        ]);
        setClasses(classesData);
        setCourses(coursesData);
      } catch (error) {
        console.error(error);
      }
    };

    loadBase();
  }, []);

  const filtered = enrollments.filter(
    (e) =>
      !search ||
      e.student?.name.toLowerCase().includes(search.toLowerCase()) ||
      e.student?.studentId.toLowerCase().includes(search.toLowerCase())
  );

  const handleLoad = async () => {
    try {
      if (cls && course && semester) {
        const data = await api.get(
          `/enrollments?classId=${cls}&courseId=${course}&semester=${encodeURIComponent(semester)}`
        );
        setEnrollments(data);

        const initial = {};
        data.forEach((e) => {
          initial[e._id] = {
            midterm: e.midtermScore ?? "",
            final: e.finalScore ?? "",
          };
        });
        setGrades(initial);
        setLoaded(true);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const setGrade = (id, field, val) =>
    setGrades((g) => ({ ...g, [id]: { ...(g[id] || {}), [field]: val } }));

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <div>
      <h1 style={S.pageTitle}>Grade Management</h1>

      <div style={S.card}>
        <div style={S.sectionTitle}>Select Class and Course</div>
        <div style={S.grid2}>
          <div>
            <label style={S.label}>Class</label>
            <Select
              value={cls}
              onChange={setCls}
              options={classes.map((c) => ({ value: c._id, label: c.name }))}
            />
          </div>
          <div>
            <label style={S.label}>Course</label>
            <Select
              value={course}
              onChange={setCourse}
              options={courses.map((c) => ({ value: c._id, label: c.name }))}
            />
          </div>
        </div>

        <div style={{ marginTop: 14, width: 220 }}>
          <label style={S.label}>Semester</label>
          <Select
            value={semester}
            onChange={setSemester}
            options={["Semester 1", "Semester 2", "Summer"]}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
          <Btn onClick={handleLoad}>Load Grades</Btn>
        </div>
      </div>

      {loaded && (
        <div style={S.card}>
          <div style={S.sectionTitle}>Input Grades</div>
          <div style={{ marginBottom: 12 }}>
            <Input value={search} onChange={setSearch} placeholder="Search..." style={{ width: 220 }} />
          </div>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
            <table style={S.table}>
              <thead>
                <tr>
                  {["Student ID", "Student Name", "Midterm Score", "Final Score"].map((h) => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e._id}>
                    <td style={S.td}>{e.student?.studentId}</td>
                    <td style={S.td}>{e.student?.name}</td>
                    <td style={S.td}>
                      <Input
                        value={(grades[e._id] || {}).midterm || ""}
                        onChange={(v) => setGrade(e._id, "midterm", v)}
                        type="number"
                        style={{ width: 120 }}
                      />
                    </td>
                    <td style={S.td}>
                      <Input
                        value={(grades[e._id] || {}).final || ""}
                        onChange={(v) => setGrade(e._id, "final", v)}
                        type="number"
                        style={{ width: 120 }}
                      />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ ...S.td, textAlign: "center", color: C.textMuted }}>
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ ...S.row(10), justifyContent: "flex-end" }}>
            <Btn
              onClick={async () => {
                try {
                  await api.put("/enrollments/grades", {
                    grades: filtered.map((e) => ({
                      enrollmentId: e._id,
                      midtermScore: (grades[e._id] || {}).midterm ?? "",
                      finalScore: (grades[e._id] || {}).final ?? "",
                    })),
                  });
                  showToast("✅ Grades saved successfully!");
                  handleLoad();
                } catch (error) {
                  showToast(`❌ ${error.message}`);
                }
              }}
            >
              Save Grades
            </Btn>
            <Btn variant="secondary" onClick={() => setLoaded(false)}>Cancel</Btn>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: C.dark, color: "#fff", padding: "12px 20px", borderRadius: 8, fontSize: 14, zIndex: 9999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}