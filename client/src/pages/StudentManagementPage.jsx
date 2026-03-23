import { useState } from "react";
import { C, S } from "../constants/styles";
import Btn from "../components/Btn";
import Input from "../components/Input";
import Select from "../components/Select";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";

const EMPTY_FORM = { id: "", name: "", dob: "", gender: "", dept: "", cls: "", email: "" };

export default function StudentManagementPage({
  students,
  setStudents,
  depts,
  classes,
  setViewStudent,
}) {
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const deptOptions = depts.map((d) => d.name);
  const classOptions = classes.map((c) => c.name);

  const filtered = students.filter(
    (s) =>
      (!search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase())) &&
      (!filterDept || s.dept === filterDept) &&
      (!filterClass || s.cls === filterClass)
  );

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal({ mode: "add" });
  };

  const openEdit = (s) => {
    setForm({ id: s.id, name: s.name, dob: s.dob, gender: s.gender, dept: s.dept, cls: s.cls, email: s.email });
    setModal({ mode: "edit", student: s });
  };

  const handleSave = () => {
    if (modal.mode === "add") {
      setStudents((prev) => [...prev, form]);
    } else {
      setStudents((prev) => prev.map((s) => (s.id === form.id ? { ...s, ...form } : s)));
    }
    setModal(null);
  };

  const handleDelete = () => {
    setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const setField = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div>
      <h1 style={S.pageTitle}>Student Management</h1>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <Input value={search} onChange={setSearch} placeholder="Search..." style={{ width: 220 }} />
        <Select value={filterDept} onChange={setFilterDept} options={deptOptions} style={{ width: 180 }} />
        <Select value={filterClass} onChange={setFilterClass} options={classOptions} style={{ width: 150 }} />
        <Btn onClick={openAdd} style={{ marginLeft: "auto" }}>
          Add New Student
        </Btn>
      </div>

      {/* Table */}
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
        <table style={S.table}>
          <thead>
            <tr>
              {["Student ID", "Full Name", "Department", "Class", "Email", "Actions"].map((h) => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td style={S.td}>{s.id}</td>
                <td style={S.td}>{s.name}</td>
                <td style={S.td}>{s.dept}</td>
                <td style={S.td}>{s.cls}</td>
                <td style={S.td}>{s.email}</td>
                <td style={S.td}>
                  <div style={S.row(6)}>
                    <Btn size="sm" onClick={() => setViewStudent(s)}>View</Btn>
                    <Btn size="sm" variant="secondary" onClick={() => openEdit(s)}>Edit</Btn>
                    <Btn size="sm" variant="danger" onClick={() => setDeleteTarget(s)}>Delete</Btn>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...S.td, textAlign: "center", color: C.textMuted }}>
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <Modal title="Add / Edit Student Form" onClose={() => setModal(null)}>
          <div style={S.grid2}>
            <div><label style={S.label}>Student ID</label><Input value={form.id} onChange={setField("id")} /></div>
            <div><label style={S.label}>Full name</label><Input value={form.name} onChange={setField("name")} /></div>
            <div><label style={S.label}>Date of birth</label><Input value={form.dob} onChange={setField("dob")} type="date" /></div>
            <div><label style={S.label}>Gender</label><Select value={form.gender} onChange={setField("gender")} options={["Male", "Female", "Other"]} /></div>
            <div><label style={S.label}>Department</label><Select value={form.dept} onChange={setField("dept")} options={deptOptions} /></div>
            <div><label style={S.label}>Class</label><Select value={form.cls} onChange={setField("cls")} options={classOptions} /></div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={S.label}>Email</label>
            <Input value={form.email} onChange={setField("email")} />
          </div>
          <div style={{ ...S.row(10), justifyContent: "flex-end", marginTop: 20 }}>
            <Btn onClick={handleSave}>Save</Btn>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <ConfirmModal
          message={`Delete student "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
