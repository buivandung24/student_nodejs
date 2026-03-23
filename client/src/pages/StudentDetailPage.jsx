import { C, S } from "../constants/styles";
import Btn from "../components/Btn";

const MOCK_COURSES = [
  { id: "CS101", name: "Introduction to Programming", credits: 3, midterm: 85, final: 90, grade: "A" },
  { id: "MA101", name: "Calculus I", credits: 4, midterm: 78, final: 82, grade: "B" },
  { id: "PH101", name: "Physics for Engineers", credits: 3, midterm: 92, final: 88, grade: "A-" },
];

export default function StudentDetailPage({ student, onBack }) {
  return (
    <div>
      {/* Back button + title */}
      <div style={{ ...S.row(10), marginBottom: 20 }}>
        <Btn variant="outline" size="sm" onClick={onBack}>← Back</Btn>
        <h1 style={{ ...S.pageTitle, marginBottom: 0 }}>Student Detail View</h1>
      </div>

      {/* Profile card */}
      <div style={S.card}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Student Profile</div>
        <div style={S.grid2}>
          <div style={{ fontSize: 14, marginBottom: 10 }}>
            <span style={{ color: C.textMuted }}>Student ID: </span>{student.id}
          </div>
          <div style={{ fontSize: 14, marginBottom: 10 }}>
            <span style={{ color: C.textMuted }}>Full Name: </span>{student.name}
          </div>
          <div style={{ fontSize: 14, marginBottom: 10 }}>
            <span style={{ color: C.textMuted }}>Date of Birth: </span>{student.dob}
          </div>
          <div style={{ fontSize: 14, marginBottom: 10 }}>
            <span style={{ color: C.textMuted }}>Gender: </span>{student.gender}
          </div>
          <div style={{ fontSize: 14, marginBottom: 10 }}>
            <span style={{ color: C.textMuted }}>Department: </span>{student.dept}
          </div>
          <div style={{ fontSize: 14, marginBottom: 10 }}>
            <span style={{ color: C.textMuted }}>Class: </span>{student.cls}
          </div>
          <div style={{ fontSize: 14 }}>
            <span style={{ color: C.textMuted }}>Email: </span>{student.email}
          </div>
        </div>
      </div>

      {/* Courses & Grades */}
      <h2 style={S.sectionTitle}>Courses and Grades</h2>
      <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
        <table style={S.table}>
          <thead>
            <tr>
              {["Course ID", "Course Name", "Credit Number", "Midterm Score", "Final Score", "Overall Grade"].map((h) => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_COURSES.map((c) => (
              <tr key={c.id}>
                <td style={S.td}>{c.id}</td>
                <td style={S.td}>{c.name}</td>
                <td style={S.td}>{c.credits}</td>
                <td style={S.td}>{c.midterm}</td>
                <td style={S.td}>{c.final}</td>
                <td style={S.td}>
                  <span style={{ fontWeight: 700, color: C.primary }}>{c.grade}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GPA box */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Overall GPA</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>3.5</div>
        </div>
      </div>
    </div>
  );
}
