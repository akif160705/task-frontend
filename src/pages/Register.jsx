// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f0ff"
    }}>
      <div style={{
        width: "380px",
        padding: "30px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#6B21A8" }}>
          Create Account
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <input type="text" name="name" placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={styles.input}
          />

          <input type="email" name="email" placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={styles.input}
          />

          <input type="password" name="password" placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={styles.input}
          />

          <select name="role"
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            style={styles.input}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <button style={styles.button}>Register</button>
        </form>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#6B21A8" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  input: {
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px"
  },
  button: {
    background: "#6B21A8",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px"
  }
};