import { useState } from "react";
import { C, S } from "../constants/styles";
import Btn from "../components/Btn";
import Input from "../components/Input";
import Select from "../components/Select";

export default function GradeManagementPage({ students, classes, courses }) {
  const [cls, setCls] = useState("");
  const [course, setCourse] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [grades, setGrades] = useState({});
  const [toast, setToast] = useState("");

  const visibleStudents = students.filter((s) => !cls || s.cls === cls);
  const filtered = visibleStudents.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleLoad = () => {
    if (cls && course) setLoaded(true);
  };

  const setGrade = (sid, field, val) =>
    setGrades((g) => ({ ...g, [sid]: { ...(g[sid] || {}), [field]: val } }));

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <div>
      <h1 style={S.pageTitle}>Grade Management</h1>

      {/* Select Class & Course */}
      <div style={S.card}>
        <div style={S.sectionTitle}>Select Class and Course</div>
        <div style={S.grid2}>
          <div>
            <label style={S.label}>Class</label>
            <Select value={cls} onChange={setCls} options={classes.map((c) => c.name)} />
          </div>
          <div>
            <label style={S.label}>Course</label>
            <Select value={course} onChange={setCourse} options={courses.map((c) => c.name)} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
          <Btn onClick={handleLoad}>Load Grades</Btn>
        </div>
      </div>

      {/* Grade input table */}
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
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td style={S.td}>{s.id}</td>
                    <td style={S.td}>{s.name}</td>
                    <td style={S.td}>
                      <Input
                        value={(grades[s.id] || {}).midterm || ""}
                        onChange={(v) => setGrade(s.id, "midterm", v)}
                        type="number"
                        style={{ width: 120 }}
                      />
                    </td>
                    <td style={S.td}>
                      <Input
                        value={(grades[s.id] || {}).final || ""}
                        onChange={(v) => setGrade(s.id, "final", v)}
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
            <Btn onClick={() => showToast("✅ Grades saved successfully!")}>Save Grades</Btn>
            <Btn variant="secondary" onClick={() => setLoaded(false)}>Cancel</Btn>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: C.dark, color: "#fff", padding: "12px 20px", borderRadius: 8, fontSize: 14, zIndex: 9999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
