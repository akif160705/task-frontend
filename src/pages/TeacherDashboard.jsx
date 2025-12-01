// src/pages/TeacherDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";

export default function TeacherDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const token = localStorage.getItem("auth_token");

  // Fetch assignments
  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assignments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Handle Create Assignment
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/assignments/create",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Assignment Created!");
      setForm({ title: "", description: "", dueDate: "" });
      fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating assignment");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: "#f3e8ff",
      padding: "40px",
    }}>
      
      <h1 style={{ color: "#6B21A8", fontSize: "30px", textAlign: "center", marginBottom: "30px" }}>
        Teacher Dashboard
      </h1>

      {/* CREATE ASSIGNMENT */}
      <div style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        marginBottom: "40px",
        maxWidth: "600px",
        margin: "0 auto"
      }}>
        <h2 style={{ fontSize: "22px", marginBottom: "20px", color: "#6B21A8" }}>
          Create Assignment
        </h2>

        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={styles.input}
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ ...styles.input, height: "90px" }}
          />

          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            style={styles.input}
          />

          <button style={styles.button}>Create Assignment</button>
        </form>
      </div>

      {/* VIEW ASSIGNMENTS */}
      <div style={{
        maxWidth: "700px",
        margin: "20px auto",
        padding: "10px",
      }}>
        <h2 style={{ color: "#6B21A8", textAlign: "center", marginBottom: "20px" }}>
          All Assignments
        </h2>

        {assignments.length === 0 ? (
          <p style={{ textAlign: "center", color: "#555" }}>No assignments yet.</p>
        ) : (
          assignments.map((a) => (
            <div key={a._id} style={styles.card}>
              <h3 style={{ color: "#6B21A8" }}>{a.title}</h3>
              <p>{a.description}</p>
              <p><strong>Due:</strong> {new Date(a.dueDate).toLocaleDateString()}</p>
            </div>
          ))
        )}
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
    fontSize: "14px",
  },
  button: {
    background: "#6B21A8",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
  card: {
    background: "white",
    padding: "20px",
    marginBottom: "15px",
    borderRadius: "10px",
    boxShadow: "0 0 8px rgba(0,0,0,0.1)"
  }
};