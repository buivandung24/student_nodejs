import { C, S } from "../constants/styles";
import Btn from "./Btn";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "students", label: "Student Management" },
  { key: "classDept", label: "Class & Department" },
  { key: "courses", label: "Course Management" },
  { key: "registration", label: "Course Registration" },
  { key: "grades", label: "Grade Management" },
];

export default function Layout({ page, setPage, username, children }) {
  return (
    <div style={S.page}>
      {/* Header */}
      <header style={S.header}>
        <span style={S.headerTitle}>Student Management System</span>
        <span style={S.headerUser}>
          Logged in as:{" "}
          <a href="#" style={S.headerUserLink}>
            {username}
          </a>
        </span>
      </header>

      {/* Body */}
      <div style={S.body}>
        {/* Sidebar */}
        <nav style={S.sidebar}>
          {NAV_ITEMS.map((n) => (
            <div
              key={n.key}
              style={S.navItem(page === n.key)}
              onClick={() => setPage(n.key)}
            >
              {n.label}
            </div>
          ))}
          <div style={{ padding: "16px 20px 0" }}>
            <Btn
              variant="outline"
              size="sm"
              onClick={() => setPage("login")}
              style={{ width: "100%" }}
            >
              Logout
            </Btn>
          </div>
        </nav>

        {/* Main content */}
        <main style={S.main}>{children}</main>
      </div>
    </div>
  );
}
