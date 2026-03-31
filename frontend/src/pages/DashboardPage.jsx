import { useEffect, useState } from "react";
import { S } from "../constants/styles";
import api from "../services/api";

const QUICK_LINKS = [
  {
    icon: "🎓",
    title: "Student Details",
    desc: "View and manage student profiles.",
    page: "students",
  },
  {
    icon: "🏫",
    title: "Classes & Departments",
    desc: "Organize and manage academic structures.",
    page: "classDept",
  },
  {
    icon: "📋",
    title: "Course Management",
    desc: "Add, edit, and remove courses.",
    page: "courses",
  },
  {
    icon: "📝",
    title: "Course Registration",
    desc: "Register students for courses.",
    page: "registration",
  },
  {
    icon: "📊",
    title: "Grade Management",
    desc: "Input and manage student grades.",
    page: "grades",
  },
];

export default function DashboardPage({ setPage }) {
  const [summary, setSummary] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalDepartments: 0,
    totalClasses: 0,
    totalEnrollments: 0,
  });

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await api.get("/dashboard/summary");
        setSummary(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadSummary();
  }, []);

  return (
    <div>
      <h1 style={S.pageTitle}>Dashboard</h1>

      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <div style={S.statCard}>
          <div style={S.statLabel}>Total Students</div>
          <div style={S.statValue}>{summary.totalStudents}</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statLabel}>Total Courses</div>
          <div style={S.statValue}>{summary.totalCourses}</div>
        </div>
        <div style={S.statCard}>
          <div style={S.statLabel}>Active Departments</div>
          <div style={S.statValue}>{summary.totalDepartments}</div>
        </div>
      </div>

      <h2 style={S.sectionTitle}>Quick Links</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {QUICK_LINKS.map((ql) => (
          <div
            key={ql.page}
            style={S.qlCard}
            onClick={() => setPage(ql.page)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <span style={S.qlIcon}>{ql.icon}</span>
            <div>
              <div style={S.qlTitle}>{ql.title}</div>
              <div style={S.qlDesc}>{ql.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}