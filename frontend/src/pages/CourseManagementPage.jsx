import { useEffect, useState } from "react";
import { C, S } from "../constants/styles";
import Btn from "../components/Btn";
import Input from "../components/Input";
import Select from "../components/Select";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import api from "../services/api";

const EMPTY_FORM = { _id: "", id: "", name: "", credits: "", deptId: "" };

export default function CourseManagementPage() {
  const [courses, setCourses] = useState([]);
  const [depts, setDepts] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadData = async () => {
    try {
      const [courseData, deptData] = await Promise.all([
        api.get("/courses"),
        api.get("/departments"),
      ]);
      setCourses(courseData);
      setDepts(deptData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = courses.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.courseId.toLowerCase().includes(search.toLowerCase())
  );

  const setField = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    const entry = {
      courseId: form.id,
      name: form.name,
      credits: Number(form.credits),
      department: form.deptId,
    };

    try {
      if (modal.mode === "add") {
        await api.post("/courses", entry);
      } else {
        await api.put(`/courses/${form._id}`, entry);
      }
      setModal(null);
      loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1 style={S.pageTitle}>Course Management</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <Input value={search} onChange={setSearch} placeholder="Search..." style={{ width: 220 }} />
        <Btn style={{ marginLeft: "auto" }} onClick={() => { setForm(EMPTY_FORM); setModal({ mode: "add" }); }}>
          Add New Course
        </Btn>
      </div>

      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
        <table style={S.table}>
          <thead>
            <tr>
              {["Course ID", "Course Name", "Credit Number", "Department", "Actions"].map((h) => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c._id}>
                <td style={S.td}>{c.courseId}</td>
                <td style={S.td}>{c.name}</td>
                <td style={S.td}>{c.credits}</td>
                <td style={S.td}>{c.department?.name}</td>
                <td style={S.td}>
                  <div style={S.row(6)}>
                    <Btn
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setForm({
                          _id: c._id,
                          id: c.courseId,
                          name: c.name,
                          credits: String(c.credits),
                          deptId: c.department?._id || "",
                        });
                        setModal({ mode: "edit" });
                      }}
                    >
                      Edit
                    </Btn>
                    <Btn size="sm" variant="danger" onClick={() => setDeleteTarget(c)}>Delete</Btn>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ ...S.td, textAlign: "center", color: C.textMuted }}>
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Add New Course" : "Edit Course"} onClose={() => setModal(null)}>
          <div style={S.grid2}>
            <div><label style={S.label}>Course ID</label><Input value={form.id} onChange={setField("id")} /></div>
            <div><label style={S.label}>Credit Number</label><Input value={form.credits} onChange={setField("credits")} type="number" /></div>
          </div>
          <div style={{ marginTop: 14 }}><label style={S.label}>Course Name</label><Input value={form.name} onChange={setField("name")} /></div>
          <div style={{ marginTop: 14, marginBottom: 20 }}>
            <label style={S.label}>Department</label>
            <Select
              value={form.deptId}
              onChange={setField("deptId")}
              options={depts.map((d) => ({ value: d._id, label: d.name }))}
            />
          </div>
          <div style={{ ...S.row(10), justifyContent: "flex-end" }}>
            <Btn onClick={handleSave}>Save</Btn>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Delete course "${deleteTarget.name}"?`}
          onConfirm={async () => {
            try {
              await api.delete(`/courses/${deleteTarget._id}`);
              setDeleteTarget(null);
              loadData();
            } catch (error) {
              alert(error.message);
            }
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}