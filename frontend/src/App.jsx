import { useState } from "react";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import StudentManagementPage from "./pages/StudentManagementPage";
import StudentDetailPage from "./pages/StudentDetailPage";
import ClassDeptPage from "./pages/ClassDeptPage";
import CourseManagementPage from "./pages/CourseManagementPage";
import CourseRegistrationPage from "./pages/CourseRegistrationPage";
import GradeManagementPage from "./pages/GradeManagementPage";

function getStoredAuth() {
  try {
    const raw = localStorage.getItem("sms_auth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [page, setPage] = useState(getStoredAuth() ? "dashboard" : "login");
  const [auth, setAuth] = useState(getStoredAuth());
  const [viewStudent, setViewStudent] = useState(null);

  if (page === "login" || !auth) {
    return (
      <LoginPage
        onLogin={(userData) => {
          localStorage.setItem("sms_auth", JSON.stringify(userData));
          setAuth(userData);
          setPage("dashboard");
        }}
      />
    );
  }

  if (viewStudent) {
    return (
      <Layout
        page="students"
        setPage={(p) => {
          setViewStudent(null);
          if (p === "logout") {
            localStorage.removeItem("sms_auth");
            setAuth(null);
            setPage("login");
          } else {
            setPage(p);
          }
        }}
        username={auth.username}
      >
        <StudentDetailPage
          studentId={viewStudent}
          onBack={() => setViewStudent(null)}
        />
      </Layout>
    );
  }

  const handleSetPage = (p) => {
    if (p === "logout") {
      localStorage.removeItem("sms_auth");
      setAuth(null);
      setViewStudent(null);
      setPage("login");
      return;
    }
    setPage(p);
  };

  const pageContent = {
    dashboard: <DashboardPage setPage={handleSetPage} />,
    students: <StudentManagementPage setViewStudent={setViewStudent} />,
    classDept: <ClassDeptPage />,
    courses: <CourseManagementPage />,
    registration: <CourseRegistrationPage />,
    grades: <GradeManagementPage />,
  };

  return (
    <Layout page={page} setPage={handleSetPage} username={auth.username}>
      {pageContent[page] ?? <div>Page not found</div>}
    </Layout>
  );
}