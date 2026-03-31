import { useEffect, useState } from "react";
import { C, S } from "../constants/styles";
import Btn from "../components/Btn";
import Input from "../components/Input";
import Select from "../components/Select";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import api from "../services/api";

const EMPTY_FORM = { _id: "", id: "", name: "", dob: "", gender: "", deptId: "", clsId: "", email: "" };

export default function StudentManagementPage({ setViewStudent }) {
  const [students, setStudents] = useState([]);
  const [depts, setDepts] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadData = async () => {
    try {
      const [studentsData, deptsData, classesData] = await Promise.all([
        api.get("/students"),
        api.get("/departments"),
        api.get("/classes"),
      ]);

      setStudents(studentsData);
      setDepts(deptsData);
      setClasses(classesData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const deptOptions = depts.map((d) => ({ value: d._id, label: d.name }));
  const classOptions = classes
    .filter((c) => !filterDept || c.department?._id === filterDept)
    .map((c) => ({ value: c._id, label: c.name }));

  const filtered = students.filter(
    (s) =>
      (!search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId.toLowerCase().includes(search.toLowerCase())) &&
      (!filterDept || s.department?._id === filterDept) &&
      (!filterClass || s.class?._id === filterClass)
  );

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal({ mode: "add" });
  };

  const openEdit = (s) => {
    setForm({
      _id: s._id,
      id: s.studentId,
      name: s.name,
      dob: s.dob ? String(s.dob).slice(0, 10) : "",
      gender: s.gender,
      deptId: s.department?._id || "",
      clsId: s.class?._id || "",
      email: s.email,
    });
    setModal({ mode: "edit", student: s });
  };

  const handleSave = async () => {
    const payload = {
      studentId: form.id,
      name: form.name,
      dob: form.dob,
      gender: form.gender,
      department: form.deptId,
      class: form.clsId,
      email: form.email,
    };

    try {
      if (modal.mode === "add") {
        await api.post("/students", payload);
      } else {
        await api.put(`/students/${form._id}`, payload);
      }
      setModal(null);
      loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/students/${deleteTarget._id}`);
      setDeleteTarget(null);
      loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const setField = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div>
      <h1 style={S.pageTitle}>Student Management</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <Input value={search} onChange={setSearch} placeholder="Search..." style={{ width: 220 }} />
        <Select value={filterDept} onChange={setFilterDept} options={deptOptions} style={{ width: 180 }} />
        <Select value={filterClass} onChange={setFilterClass} options={classOptions} style={{ width: 150 }} />
        <Btn onClick={openAdd} style={{ marginLeft: "auto" }}>
          Add New Student
        </Btn>
      </div>

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
              <tr key={s._id}>
                <td style={S.td}>{s.studentId}</td>
                <td style={S.td}>{s.name}</td>
                <td style={S.td}>{s.department?.name}</td>
                <td style={S.td}>{s.class?.name}</td>
                <td style={S.td}>{s.email}</td>
                <td style={S.td}>
                  <div style={S.row(6)}>
                    <Btn size="sm" onClick={() => setViewStudent(s._id)}>View</Btn>
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

      {modal && (
        <Modal title="Add / Edit Student Form" onClose={() => setModal(null)}>
          <div style={S.grid2}>
            <div><label style={S.label}>Student ID</label><Input value={form.id} onChange={setField("id")} /></div>
            <div><label style={S.label}>Full name</label><Input value={form.name} onChange={setField("name")} /></div>
            <div><label style={S.label}>Date of birth</label><Input value={form.dob} onChange={setField("dob")} type="date" /></div>
            <div><label style={S.label}>Gender</label><Select value={form.gender} onChange={setField("gender")} options={["Male", "Female", "Other"]} /></div>
            <div><label style={S.label}>Department</label><Select value={form.deptId} onChange={setField("deptId")} options={deptOptions} /></div>
            <div>
              <label style={S.label}>Class</label>
              <Select
                value={form.clsId}
                onChange={setField("clsId")}
                options={classes
                  .filter((c) => !form.deptId || c.department?._id === form.deptId)
                  .map((c) => ({ value: c._id, label: c.name }))}
              />
            </div>
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