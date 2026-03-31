import { useState } from "react";
import { C, S } from "../constants/styles";
import Btn from "../components/Btn";
import Input from "../components/Input";
import api from "../services/api";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setError("");
      const data = await api.post("/auth/login", {
        username,
        password,
      });
      onLogin(data);
    } catch (err) {
      setError(err.message || "Login failed.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: C.bg,
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          background: C.white,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "40px 40px",
          width: 420,
          boxShadow: "0 4px 24px rgba(0,0,0,.08)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: 20,
            marginBottom: 32,
          }}
        >
          Student Management System Login
        </h2>

        <div style={{ marginBottom: 18 }}>
          <label style={S.label}>Username/Email</label>
          <Input value={username} onChange={setUsername} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={S.label}>Password</label>
          <Input value={password} onChange={setPassword} type="password" />
        </div>

        {error && (
          <p style={{ color: C.danger, fontSize: 13, marginBottom: 12 }}>
            {error}
          </p>
        )}

        <div style={{ textAlign: "center" }}>
          <Btn onClick={handleLogin} style={{ padding: "10px 48px", fontSize: 15 }}>
            Login
          </Btn>
        </div>
      </div>
    </div>
  );
}