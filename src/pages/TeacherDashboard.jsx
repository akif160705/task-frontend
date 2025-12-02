import { useState, useEffect } from "react";
import api from "../lib/api";

export default function TeacherDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [submissions, setSubmissions] = useState({});

  // Load assignments
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/api/assignments");
        setAssignments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Create assignment with UI form
  async function handleCreate(e) {
    e.preventDefault();

    if (!form.title || !form.description || !form.dueDate) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await api.post("/api/assignments/create", form);

      alert("Assignment created!");

      setAssignments([...assignments, res.data.assignment]);

      setShowForm(false);
      setForm({ title: "", description: "", dueDate: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create assignment");
    }
  }

  // Load submissions per assignment
  async function loadSubmissions(id) {
    try {
      const res = await api.get(`/api/assignments/submissions/${id}`);

      setSubmissions((prev) => ({
        ...prev,
        [id]: res.data,
      }));
    } catch (err) {
      alert("Failed to load submissions");
    }
  }

  return (
    <div style={{ padding: "40px", background: "#f3e8ff", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          padding: "40px",
          borderRadius: "14px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            color: "#6B21A8",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Teacher Dashboard
        </h1>

        {/* CREATE BUTTON */}
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 18px",
            background: "#6B21A8",
            color: "white",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            marginBottom: "20px",
            display: "block",
            marginLeft: "auto",
          }}
        >
          {showForm ? "Close Form" : "Create Assignment"}
        </button>

        {/* CREATE FORM */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            style={{
              background: "#faf5ff",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
              border: "1px solid #ddd",
            }}
          >
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              style={inputStyle}
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              style={inputStyle}
            />

            <input
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm({ ...form, dueDate: e.target.value })
              }
              style={inputStyle}
            />

            <button
              type="submit"
              style={{
                padding: "12px",
                background: "#9333EA",
                color: "white",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                width: "100%",
              }}
            >
              Create Assignment
            </button>
          </form>
        )}

        {/* ASSIGNMENT LIST */}
        {loading ? (
          <p>Loading…</p>
        ) : assignments.length === 0 ? (
          <p>No assignments yet.</p>
        ) : (
          assignments.map((a) => (
            <div
              key={a._id}
              style={{
                padding: "20px",
                border: "1px solid #ddd",
                background: "#fafafa",
                marginBottom: "20px",
                borderRadius: "10px",
              }}
            >
              <h2 style={{ color: "#6B21A8" }}>{a.title}</h2>
              <p>{a.description}</p>
              <p>
                <strong>Due:</strong>{" "}
                {new Date(a.dueDate).toLocaleDateString()}
              </p>

              <button
                onClick={() => loadSubmissions(a._id)}
                style={{
                  marginTop: "12px",
                  padding: "10px 16px",
                  background: "#7E22CE",
                  color: "white",
                  borderRadius: "8px",
                  border: "none",
                }}
              >
                View Submissions
              </button>

              {/* SUBMISSION LIST */}
              {submissions[a._id] && (
                <div
                  style={{
                    marginTop: "15px",
                    padding: "15px",
                    background: "white",
                    borderRadius: "10px",
                    border: "1px solid #eee",
                  }}
                >
                  {submissions[a._id].length === 0 ? (
                    <p>No submissions yet.</p>
                  ) : (
                    submissions[a._id].map((s) => (
                      <div key={s._id} style={{ marginBottom: "10px" }}>
                        <p>
                          <strong>Student:</strong> {s.student?.name}
                        </p>
                        <a
                          href={s.fileUrl}
                          target="_blank"
                          style={{ color: "#6B21A8" }}
                        >
                          View Work
                        </a>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.removeItem("auth");
            window.location.href = "/login";
          }}
          style={logoutButton}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  width: "100%",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const logoutButton = {
  padding: "10px 20px",
  borderRadius: "8px",
  background: "#6B21A8",
  color: "white",
  border: "none",
  cursor: "pointer",
  display: "block",
  margin: "40px auto 0",
};