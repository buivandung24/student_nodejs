import { useEffect, useState } from "react";
import { C, S } from "../constants/styles";
import Btn from "../components/Btn";
import Select from "../components/Select";
import api from "../services/api";

export default function CourseRegistrationPage() {
  const [students, setStudents] = useState([]);
  const [depts, setDepts] = useState([]);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({ dept: "", cls: "", semester: "", course: "" });
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentsData, deptsData, classesData, coursesData] = await Promise.all([
          api.get("/students"),
          api.get("/departments"),
          api.get("/classes"),
          api.get("/courses"),
        ]);
        setStudents(studentsData);
        setDepts(deptsData);
        setClasses(classesData);
        setCourses(coursesData);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  const visibleStudents = students.filter(
    (s) =>
      (!filters.dept || s.department?._id === filters.dept) &&
      (!filters.cls || s.class?._id === filters.cls)
  );

  const toggleAll = (checked) => {
    setSelectAll(checked);
    setSelected(checked ? visibleStudents.map((s) => s._id) : []);
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

      <div style={S.card}>
        <div style={S.sectionTitle}>Filters</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
          <div>
            <label style={S.label}>Department</label>
            <Select
              value={filters.dept}
              onChange={setFilter("dept")}
              options={depts.map((d) => ({ value: d._id, label: d.name }))}
            />
          </div>
          <div>
            <label style={S.label}>Class</label>
            <Select
              value={filters.cls}
              onChange={setFilter("cls")}
              options={classes
                .filter((c) => !filters.dept || c.department?._id === filters.dept)
                .map((c) => ({ value: c._id, label: c.name }))}
            />
          </div>
          <div>
            <label style={S.label}>Semester</label>
            <Select
              value={filters.semester}
              onChange={setFilter("semester")}
              options={["Semester 1", "Semester 2", "Summer"]}
            />
          </div>
          <div>
            <label style={S.label}>Course</label>
            <Select
              value={filters.course}
              onChange={setFilter("course")}
              options={courses.map((c) => ({ value: c._id, label: c.name }))}
            />
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.sectionTitle}>Student Selection</div>
        <label style={{ ...S.row(8), fontSize: 14, cursor: "pointer", marginBottom: 12 }}>
          <input type="checkbox" checked={selectAll} onChange={(e) => toggleAll(e.target.checked)} />
          Select All
        </label>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, padding: 12, minHeight: 120, background: C.white }}>
          {visibleStudents.map((s) => (
            <label key={s._id} style={{ ...S.row(8), fontSize: 14, cursor: "pointer", padding: "3px 0" }}>
              <input
                type="checkbox"
                checked={selected.includes(s._id)}
                onChange={() => toggleOne(s._id)}
              />
              {s.studentId} - {s.name}
            </label>
          ))}
          {visibleStudents.length === 0 && (
            <div style={{ color: C.textMuted, fontSize: 13 }}>No students match the selected filters.</div>
          )}
        </div>
      </div>

      <div style={S.card}>
        <div style={S.sectionTitle}>Actions</div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <Btn
            style={{ padding: "10px 28px" }}
            onClick={async () => {
              try {
                if (!selected.length) return showToast("❌ Please select students.");
                if (!filters.course || !filters.semester) return showToast("❌ Please select semester and course.");

                const result = await api.post("/enrollments/bulk-register", {
                  studentIds: selected,
                  courseId: filters.course,
                  semester: filters.semester,
                });

                showToast(`✅ Registered ${result.createdCount} student(s).`);
              } catch (error) {
                showToast(`❌ ${error.message}`);
              }
            }}
          >
            Register Selected Students to Course
          </Btn>
          <Btn
            variant="danger"
            style={{ padding: "10px 28px" }}
            onClick={async () => {
              try {
                if (!selected.length) return showToast("❌ Please select students.");
                if (!filters.course || !filters.semester) return showToast("❌ Please select semester and course.");

                const result = await api.post("/enrollments/bulk-unregister", {
                  studentIds: selected,
                  courseId: filters.course,
                  semester: filters.semester,
                });

                showToast(`❌ Unregistered ${result.deletedCount} student(s).`);
              } catch (error) {
                showToast(`❌ ${error.message}`);
              }
            }}
          >
            Unregister Selected Students from Course
          </Btn>
        </div>
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: C.dark, color: "#fff", padding: "12px 20px", borderRadius: 8, fontSize: 14, zIndex: 9999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}