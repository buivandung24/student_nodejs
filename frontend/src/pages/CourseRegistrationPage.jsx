import { useState } from "react";
import { C, S } from "../constants/styles";
import Btn from "../components/Btn";
import Select from "../components/Select";

export default function CourseRegistrationPage({ students, depts, classes, courses }) {
  const [filters, setFilters] = useState({ dept: "", cls: "", semester: "", course: "" });
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [toast, setToast] = useState("");

  const visibleStudents = students.filter(
    (s) =>
      (!filters.dept || s.dept === filters.dept) &&
      (!filters.cls || s.cls === filters.cls)
  );

  const toggleAll = (checked) => {
    setSelectAll(checked);
    setSelected(checked ? visibleStudents.map((s) => s.id) : []);
  };

  const toggleOne = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const setFilter = (key) => (val) => setFilters((f) => ({ ...f, [key]: val }));

  return (
    <div>
      <h1 style={S.pageTitle}>Bulk Course Registration</h1>

      {/* Filters */}
      <div style={S.card}>
        <div style={S.sectionTitle}>Filters</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
          {[
            ["Department", "dept", depts.map((d) => d.name)],
            ["Class", "cls", classes.map((c) => c.name)],
            ["Semester", "semester", ["Semester 1", "Semester 2", "Summer"]],
            ["Course", "course", courses.map((c) => c.name)],
          ].map(([label, key, opts]) => (
            <div key={key}>
              <label style={S.label}>{label}</label>
              <Select value={filters[key]} onChange={setFilter(key)} options={opts} />
            </div>
          ))}
        </div>
      </div>

      {/* Student Selection */}
      <div style={S.card}>
        <div style={S.sectionTitle}>Student Selection</div>
        <label style={{ ...S.row(8), fontSize: 14, cursor: "pointer", marginBottom: 12 }}>
          <input type="checkbox" checked={selectAll} onChange={(e) => toggleAll(e.target.checked)} />
          Select All
        </label>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: 12, minHeight: 120, background: C.white }}>
          {visibleStudents.map((s) => (
            <label key={s.id} style={{ ...S.row(8), fontSize: 14, cursor: "pointer", padding: "3px 0" }}>
              <input
                type="checkbox"
                checked={selected.includes(s.id)}
                onChange={() => toggleOne(s.id)}
              />
              {s.id} - {s.name}
            </label>
          ))}
          {visibleStudents.length === 0 && (
            <div style={{ color: C.textMuted, fontSize: 13 }}>No students match the selected filters.</div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={S.card}>
        <div style={S.sectionTitle}>Actions</div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <Btn
            style={{ padding: "10px 28px" }}
            onClick={() => { if (selected.length) showToast(`✅ Registered ${selected.length} student(s) to course.`); }}
          >
            Register Selected Students to Course
          </Btn>
          <Btn
            variant="danger"
            style={{ padding: "10px 28px" }}
            onClick={() => { if (selected.length) showToast(`❌ Unregistered ${selected.length} student(s) from course.`); }}
          >
            Unregister Selected Students from Course
          </Btn>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: C.dark, color: "#fff", padding: "12px 20px", borderRadius: 8, fontSize: 14, zIndex: 9999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
