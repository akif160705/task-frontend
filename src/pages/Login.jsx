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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", data);

      // FIX: store correct key
      localStorage.setItem("auth_token", res.data.token);

      navigate(data.role === "teacher" ? "/teacher" : "/student");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>

        <form onSubmit={handleLogin} style={styles.form}>
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

          <button style={styles.btn}>Login</button>
        </form>

        <p style={{ marginTop: 15, textAlign: "center" }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    background: "#f3e8ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: 350,
    padding: 25,
    background: "white",
    borderRadius: 12,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
    color: "#6B21A8",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  btn: {
    padding: 12,
    background: "#6B21A8",
    border: "none",
    color: "white",
    fontSize: 16,
    borderRadius: 8,
    cursor: "pointer",
  },
};