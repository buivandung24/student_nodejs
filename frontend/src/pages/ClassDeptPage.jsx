import { useEffect, useState } from "react";
import { C, S } from "../constants/styles";
import Btn from "../components/Btn";
import Input from "../components/Input";
import Select from "../components/Select";
import Modal from "../components/Modal";
import ConfirmModal from "../components/ConfirmModal";
import api from "../services/api";

export default function ClassDeptPage() {
  const [depts, setDepts] = useState([]);
  const [classes, setClasses] = useState([]);
  const [deptSearch, setDeptSearch] = useState("");
  const [classSearch, setClassSearch] = useState("");
  const [deptModal, setDeptModal] = useState(null);
  const [classModal, setClassModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deptForm, setDeptForm] = useState({ _id: "", id: "", name: "" });
  const [classForm, setClassForm] = useState({ _id: "", id: "", name: "", deptId: "" });

  const loadData = async () => {
    try {
      const [deptData, classData] = await Promise.all([
        api.get("/departments"),
        api.get("/classes"),
      ]);
      setDepts(deptData);
      setClasses(classData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredDepts = depts.filter(
    (d) =>
      !deptSearch ||
      d.name.toLowerCase().includes(deptSearch.toLowerCase()) ||
      d.deptId.toLowerCase().includes(deptSearch.toLowerCase())
  );

  const filteredClasses = classes.filter(
    (c) =>
      !classSearch ||
      c.name.toLowerCase().includes(classSearch.toLowerCase()) ||
      c.classId.toLowerCase().includes(classSearch.toLowerCase())
  );

  const handleDeleteConfirm = async () => {
    try {
      if (deleteTarget.type === "dept") {
        await api.delete(`/departments/${deleteTarget.item._id}`);
      } else {
        await api.delete(`/classes/${deleteTarget.item._id}`);
      }
      setDeleteTarget(null);
      loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1 style={S.pageTitle}>Class & Department Management</h1>

      <h2 style={S.sectionTitle}>Departments</h2>
      <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
        <Input value={deptSearch} onChange={setDeptSearch} placeholder="Search..." style={{ width: 220 }} />
        <Btn
          style={{ marginLeft: "auto" }}
          onClick={() => {
            setDeptForm({ _id: "", id: "", name: "" });
            setDeptModal({ mode: "add" });
          }}
        >
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
              <tr key={d._id}>
                <td style={S.td}>{d.deptId}</td>
                <td style={S.td}>{d.name}</td>
                <td style={S.td}>
                  <div style={S.row(6)}>
                    <Btn
                      size="sm"
                      onClick={() => {
                        setDeptForm({ _id: d._id, id: d.deptId, name: d.name });
                        setDeptModal({ mode: "edit" });
                      }}
                    >
                      Edit
                    </Btn>
                    <Btn size="sm" variant="danger" onClick={() => setDeleteTarget({ type: "dept", item: d })}>Delete</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={S.sectionTitle}>Classes</h2>
      <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
        <Input value={classSearch} onChange={setClassSearch} placeholder="Search..." style={{ width: 220 }} />
        <Btn
          style={{ marginLeft: "auto" }}
          onClick={() => {
            setClassForm({ _id: "", id: "", name: "", deptId: "" });
            setClassModal({ mode: "add" });
          }}
        >
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
              <tr key={c._id}>
                <td style={S.td}>{c.classId}</td>
                <td style={S.td}>{c.name}</td>
                <td style={S.td}>{c.department?.name}</td>
                <td style={S.td}>
                  <div style={S.row(6)}>
                    <Btn
                      size="sm"
                      onClick={() => {
                        setClassForm({
                          _id: c._id,
                          id: c.classId,
                          name: c.name,
                          deptId: c.department?._id || "",
                        });
                        setClassModal({ mode: "edit" });
                      }}
                    >
                      Edit
                    </Btn>
                    <Btn size="sm" variant="danger" onClick={() => setDeleteTarget({ type: "class", item: c })}>Delete</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deptModal && (
        <Modal title={deptModal.mode === "add" ? "Add New Department" : "Edit Department"} onClose={() => setDeptModal(null)}>
          <div style={{ marginBottom: 14 }}><label style={S.label}>Department ID</label><Input value={deptForm.id} onChange={(v) => setDeptForm((f) => ({ ...f, id: v }))} /></div>
          <div style={{ marginBottom: 20 }}><label style={S.label}>Department Name</label><Input value={deptForm.name} onChange={(v) => setDeptForm((f) => ({ ...f, name: v }))} /></div>
          <div style={{ ...S.row(10), justifyContent: "flex-end" }}>
            <Btn
              onClick={async () => {
                try {
                  if (deptModal.mode === "add") {
                    await api.post("/departments", {
                      deptId: deptForm.id,
                      name: deptForm.name,
                    });
                  } else {
                    await api.put(`/departments/${deptForm._id}`, {
                      deptId: deptForm.id,
                      name: deptForm.name,
                    });
                  }
                  setDeptModal(null);
                  loadData();
                } catch (error) {
                  alert(error.message);
                }
              }}
            >
              Save
            </Btn>
            <Btn variant="secondary" onClick={() => setDeptModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {classModal && (
        <Modal title={classModal.mode === "add" ? "Add New Class" : "Edit Class"} onClose={() => setClassModal(null)}>
          <div style={{ marginBottom: 14 }}><label style={S.label}>Class ID</label><Input value={classForm.id} onChange={(v) => setClassForm((f) => ({ ...f, id: v }))} /></div>
          <div style={{ marginBottom: 14 }}><label style={S.label}>Class Name</label><Input value={classForm.name} onChange={(v) => setClassForm((f) => ({ ...f, name: v }))} /></div>
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>Department</label>
            <Select
              value={classForm.deptId}
              onChange={(v) => setClassForm((f) => ({ ...f, deptId: v }))}
              options={depts.map((d) => ({ value: d._id, label: d.name }))}
            />
          </div>
          <div style={{ ...S.row(10), justifyContent: "flex-end" }}>
            <Btn
              onClick={async () => {
                try {
                  if (classModal.mode === "add") {
                    await api.post("/classes", {
                      classId: classForm.id,
                      name: classForm.name,
                      department: classForm.deptId,
                    });
                  } else {
                    await api.put(`/classes/${classForm._id}`, {
                      classId: classForm.id,
                      name: classForm.name,
                      department: classForm.deptId,
                    });
                  }
                  setClassModal(null);
                  loadData();
                } catch (error) {
                  alert(error.message);
                }
              }}
            >
              Save
            </Btn>
            <Btn variant="secondary" onClick={() => setClassModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

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