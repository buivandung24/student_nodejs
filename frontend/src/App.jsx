import { useState } from "react";
import { INIT_STUDENTS, INIT_DEPTS, INIT_CLASSES, INIT_COURSES } from "./constants/mockData";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import StudentManagementPage from "./pages/StudentManagementPage";
import StudentDetailPage from "./pages/StudentDetailPage";
import ClassDeptPage from "./pages/ClassDeptPage";
import CourseManagementPage from "./pages/CourseManagementPage";
import CourseRegistrationPage from "./pages/CourseRegistrationPage";
import GradeManagementPage from "./pages/GradeManagementPage";

export default function App() {
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState("");
  const [students, setStudents] = useState(INIT_STUDENTS);
  const [depts, setDepts] = useState(INIT_DEPTS);
  const [classes, setClasses] = useState(INIT_CLASSES);
  const [courses, setCourses] = useState(INIT_COURSES);
  const [viewStudent, setViewStudent] = useState(null);

  // ── Login ──────────────────────────────────────────────────────────────────
  if (page === "login") {
    return (
      <LoginPage
        onLogin={(u) => {
          setUsername(u);
          setPage("dashboard");
        }}
      />
    );
  }

  // ── Student detail view (overrides page content inside layout) ─────────────
  if (viewStudent) {
    return (
      <Layout
        page="students"
        setPage={(p) => { setViewStudent(null); setPage(p); }}
        username={username}
      >
        <StudentDetailPage
          student={viewStudent}
          onBack={() => setViewStudent(null)}
        />
      </Layout>
    );
  }

  // ── Page map ───────────────────────────────────────────────────────────────
  const pageContent = {
    dashboard: (
      <DashboardPage
        setPage={setPage}
        students={students}
        courses={courses}
        depts={depts}
      />
    ),
    students: (
      <StudentManagementPage
        students={students}
        setStudents={setStudents}
        depts={depts}
        classes={classes}
        setViewStudent={setViewStudent}
      />
    ),
    classDept: (
      <ClassDeptPage
        depts={depts}
        setDepts={setDepts}
        classes={classes}
        setClasses={setClasses}
      />
    ),
    courses: (
      <CourseManagementPage
        courses={courses}
        setCourses={setCourses}
        depts={depts}
      />
    ),
    registration: (
      <CourseRegistrationPage
        students={students}
        depts={depts}
        classes={classes}
        courses={courses}
      />
    ),
    grades: (
      <GradeManagementPage
        students={students}
        classes={classes}
        courses={courses}
      />
    ),
  };

  return (
    <Layout page={page} setPage={setPage} username={username}>
      {pageContent[page] ?? <div>Page not found</div>}
    </Layout>
  );
}
