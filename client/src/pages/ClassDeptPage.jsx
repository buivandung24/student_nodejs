import { useState } from "react";
import { C, S } from "../constants/styles";
import Btn from "../components/Btn";
import Input from "../components/Input";
import Select from "../components/Select";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";

export default function ClassDeptPage({ depts, setDepts, classes, setClasses }) {
  const [deptSearch, setDeptSearch] = useState("");
  const [classSearch, setClassSearch] = useState("");
  const [deptModal, setDeptModal] = useState(null);
  const [classModal, setClassModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deptForm, setDeptForm] = useState({ id: "", name: "" });
  const [classForm, setClassForm] = useState({ id: "", name: "", dept: "" });

  const filteredDepts = depts.filter(
    (d) =>
      !deptSearch ||
      d.name.toLowerCase().includes(deptSearch.toLowerCase()) ||
      d.id.toLowerCase().includes(deptSearch.toLowerCase())
  );
  const filteredClasses = classes.filter(
    (c) =>
      !classSearch ||
      c.name.toLowerCase().includes(classSearch.toLowerCase()) ||
      c.id.toLowerCase().includes(classSearch.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    if (deleteTarget.type === "dept") {
      setDepts((prev) => prev.filter((d) => d.id !== deleteTarget.item.id));
    } else {
      setClasses((prev) => prev.filter((c) => c.id !== deleteTarget.item.id));
    }
    setDeleteTarget(null);
  };

  return (
    <div>
      <h1 style={S.pageTitle}>Class & Department Management</h1>

      {/* ── Departments ─────────────────────────────────────── */}
      <h2 style={S.sectionTitle}>Departments</h2>
      <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
        <Input value={deptSearch} onChange={setDeptSearch} placeholder="Search..." style={{ width: 220 }} />
        <Btn style={{ marginLeft: "auto" }} onClick={() => { setDeptForm({ id: "", name: "" }); setDeptModal({ mode: "add" }); }}>
          Add New Department
        </Btn>
      </div>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 28 }}>
        <table style={S.table}>
          <thead>
            <tr>{["Department ID", "Department Name", "Actions"].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filteredDepts.map((d) => (
              <tr key={d.id}>
                <td style={S.td}>{d.id}</td>
                <td style={S.td}>{d.name}</td>
                <td style={S.td}>
                  <div style={S.row(6)}>
                    <Btn size="sm" onClick={() => { setDeptForm({ id: d.id, name: d.name }); setDeptModal({ mode: "edit" }); }}>Edit</Btn>
                    <Btn size="sm" variant="danger" onClick={() => setDeleteTarget({ type: "dept", item: d })}>Delete</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Classes ─────────────────────────────────────────── */}
      <h2 style={S.sectionTitle}>Classes</h2>
      <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
        <Input value={classSearch} onChange={setClassSearch} placeholder="Search..." style={{ width: 220 }} />
        <Btn style={{ marginLeft: "auto" }} onClick={() => { setClassForm({ id: "", name: "", dept: "" }); setClassModal({ mode: "add" }); }}>
          Add New Class
        </Btn>
      </div>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
        <table style={S.table}>
          <thead>
            <tr>{["Class ID", "Class Name", "Department", "Actions"].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filteredClasses.map((c) => (
              <tr key={c.id}>
                <td style={S.td}>{c.id}</td>
                <td style={S.td}>{c.name}</td>
                <td style={S.td}>{c.dept}</td>
                <td style={S.td}>
                  <div style={S.row(6)}>
                    <Btn size="sm" onClick={() => { setClassForm({ id: c.id, name: c.name, dept: c.dept }); setClassModal({ mode: "edit" }); }}>Edit</Btn>
                    <Btn size="sm" variant="danger" onClick={() => setDeleteTarget({ type: "class", item: c })}>Delete</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Department Modal */}
      {deptModal && (
        <Modal title={deptModal.mode === "add" ? "Add New Department" : "Edit Department"} onClose={() => setDeptModal(null)}>
          <div style={{ marginBottom: 14 }}><label style={S.label}>Department ID</label><Input value={deptForm.id} onChange={(v) => setDeptForm((f) => ({ ...f, id: v }))} /></div>
          <div style={{ marginBottom: 20 }}><label style={S.label}>Department Name</label><Input value={deptForm.name} onChange={(v) => setDeptForm((f) => ({ ...f, name: v }))} /></div>
          <div style={{ ...S.row(10), justifyContent: "flex-end" }}>
            <Btn onClick={() => {
              if (deptModal.mode === "add") setDepts((p) => [...p, deptForm]);
              else setDepts((p) => p.map((d) => (d.id === deptForm.id ? deptForm : d)));
              setDeptModal(null);
            }}>Save</Btn>
            <Btn variant="secondary" onClick={() => setDeptModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Class Modal */}
      {classModal && (
        <Modal title={classModal.mode === "add" ? "Add New Class" : "Edit Class"} onClose={() => setClassModal(null)}>
          <div style={{ marginBottom: 14 }}><label style={S.label}>Class ID</label><Input value={classForm.id} onChange={(v) => setClassForm((f) => ({ ...f, id: v }))} /></div>
          <div style={{ marginBottom: 14 }}><label style={S.label}>Class Name</label><Input value={classForm.name} onChange={(v) => setClassForm((f) => ({ ...f, name: v }))} /></div>
          <div style={{ marginBottom: 20 }}><label style={S.label}>Department</label><Select value={classForm.dept} onChange={(v) => setClassForm((f) => ({ ...f, dept: v }))} options={depts.map((d) => d.name)} /></div>
          <div style={{ ...S.row(10), justifyContent: "flex-end" }}>
            <Btn onClick={() => {
              if (classModal.mode === "add") setClasses((p) => [...p, classForm]);
              else setClasses((p) => p.map((c) => (c.id === classForm.id ? classForm : c)));
              setClassModal(null);
            }}>Save</Btn>
            <Btn variant="secondary" onClick={() => setClassModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <ConfirmModal
          message={`Delete "${deleteTarget.item.name}"?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
