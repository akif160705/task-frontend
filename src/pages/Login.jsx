import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", data);

      // SAVE TOKEN CORRECTLY
      localStorage.setItem("auth", res.data.token);

      // redirect based on role
      navigate(data.role === "teacher" ? "/teacher" : "/student");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#f3e8ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: 350,
          background: "white",
          padding: 30,
          borderRadius: 12,
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 20,
            color: "#6B21A8",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          Login
        </h2>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="email"
            placeholder="Email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            style={styles.input}
          />

          <select
            value={data.role}
            onChange={(e) => setData({ ...data, role: e.target.value })}
            style={styles.input}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Checking..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: 15, textAlign: "center", color: "#555" }}>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  input: {
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginBottom: 12,
    fontSize: 15,
  },
  btn: {
    padding: 12,
    borderRadius: 8,
    background: "#6B21A8",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 16,
    marginTop: 5,
  },
};