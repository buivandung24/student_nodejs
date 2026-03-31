import { useEffect, useState } from "react";
import { C, S } from "../constants/styles";
import Btn from "../components/Btn";
import api from "../services/api";

export default function StudentDetailPage({ studentId, onBack }) {
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const data = await api.get(`/students/${studentId}/detail`);
        setStudent(data.student);
        setEnrollments(data.enrollments || []);
      } catch (error) {
        console.error(error);
      }
    };

    if (studentId) {
      loadDetail();
    }
  }, [studentId]);

  if (!student) {
    return <div>Loading...</div>;
  }

  const gradeToPoint = (grade) => {
    const map = {
      A: 4.0,
      "B+": 3.5,
      B: 3.0,
      "C+": 2.5,
      C: 2.0,
      "D+": 1.5,
      D: 1.0,
      F: 0,
    };
    return map[grade] ?? 0;
  };

  const gpa =
    enrollments.length > 0
      ? (
          enrollments.reduce((sum, e) => sum + gradeToPoint(e.overallGrade), 0) /
          enrollments.length
        ).toFixed(1)
      : "0.0";

  return (
    <div>
      <div style={{ ...S.row(10), marginBottom: 20 }}>
        <Btn variant="outline" size="sm" onClick={onBack}>← Back</Btn>
        <h1 style={{ ...S.pageTitle, marginBottom: 0 }}>Student Detail View</h1>
      </div>

      <div style={S.card}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Student Profile</div>
        <div style={S.grid2}>
          <div style={{ fontSize: 14, marginBottom: 10 }}>
            <span style={{ color: C.textMuted }}>Student ID: </span>{student.studentId}
          </div>
          <div style={{ fontSize: 14, marginBottom: 10 }}>
            <span style={{ color: C.textMuted }}>Full Name: </span>{student.name}
          </div>
          <div style={{ fontSize: 14, marginBottom: 10 }}>
            <span style={{ color: C.textMuted }}>Date of Birth: </span>{String(student.dob).slice(0, 10)}
          </div>
          <div style={{ fontSize: 14, marginBottom: 10 }}>
            <span style={{ color: C.textMuted }}>Gender: </span>{student.gender}
          </div>
          <div style={{ fontSize: 14, marginBottom: 10 }}>
            <span style={{ color: C.textMuted }}>Department: </span>{student.department?.name}
          </div>
          <div style={{ fontSize: 14, marginBottom: 10 }}>
            <span style={{ color: C.textMuted }}>Class: </span>{student.class?.name}
          </div>
          <div style={{ fontSize: 14 }}>
            <span style={{ color: C.textMuted }}>Email: </span>{student.email}
          </div>
        </div>
      </div>

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
            {enrollments.map((e) => (
              <tr key={e._id}>
                <td style={S.td}>{e.course?.courseId}</td>
                <td style={S.td}>{e.course?.name}</td>
                <td style={S.td}>{e.course?.credits}</td>
                <td style={S.td}>{e.midtermScore ?? "-"}</td>
                <td style={S.td}>{e.finalScore ?? "-"}</td>
                <td style={S.td}>
                  <span style={{ fontWeight: 700, color: C.primary }}>{e.overallGrade ?? "-"}</span>
                </td>
              </tr>
            ))}

            {enrollments.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...S.td, textAlign: "center", color: C.textMuted }}>
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Overall GPA</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{gpa}</div>
        </div>
      </div>
    </div>
  );
}