import { useState } from "react";
import { C, S } from "../constants/styles";
import Btn from "../components/Btn";
import Input from "../components/Input";
import Select from "../components/Select";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";

const EMPTY_FORM = { id: "", name: "", credits: "", dept: "" };

export default function CourseManagementPage({ courses, setCourses, depts }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = courses.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  const setField = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    const entry = { ...form, credits: Number(form.credits) };
    if (modal.mode === "add") {
      setCourses((prev) => [...prev, entry]);
    } else {
      setCourses((prev) => prev.map((c) => (c.id === form.id ? entry : c)));
    }
    setModal(null);
  };

  return (
    <div>
      <h1 style={S.pageTitle}>Course Management</h1>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <Input value={search} onChange={setSearch} placeholder="Search..." style={{ width: 220 }} />
        <Btn style={{ marginLeft: "auto" }} onClick={() => { setForm(EMPTY_FORM); setModal({ mode: "add" }); }}>
          Add New Course
        </Btn>
      </div>

      {/* Table */}
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
              <tr key={c.id}>
                <td style={S.td}>{c.id}</td>
                <td style={S.td}>{c.name}</td>
                <td style={S.td}>{c.credits}</td>
                <td style={S.td}>{c.dept}</td>
                <td style={S.td}>
                  <div style={S.row(6)}>
                    <Btn size="sm" variant="secondary" onClick={() => {
                      setForm({ id: c.id, name: c.name, credits: String(c.credits), dept: c.dept });
                      setModal({ mode: "edit" });
                    }}>Edit</Btn>
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

      {/* Add/Edit Modal */}
      {modal && (
        <Modal title={modal.mode === "add" ? "Add New Course" : "Edit Course"} onClose={() => setModal(null)}>
          <div style={S.grid2}>
            <div><label style={S.label}>Course ID</label><Input value={form.id} onChange={setField("id")} /></div>
            <div><label style={S.label}>Credit Number</label><Input value={form.credits} onChange={setField("credits")} type="number" /></div>
          </div>
          <div style={{ marginTop: 14 }}><label style={S.label}>Course Name</label><Input value={form.name} onChange={setField("name")} /></div>
          <div style={{ marginTop: 14, marginBottom: 20 }}>
            <label style={S.label}>Department</label>
            <Select value={form.dept} onChange={setField("dept")} options={depts.map((d) => d.name)} />
          </div>
          <div style={{ ...S.row(10), justifyContent: "flex-end" }}>
            <Btn onClick={handleSave}>Save</Btn>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <ConfirmModal
          message={`Delete course "${deleteTarget.name}"?`}
          onConfirm={() => { setCourses((prev) => prev.filter((c) => c.id !== deleteTarget.id)); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
