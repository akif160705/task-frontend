import { useEffect, useState } from "react";
import api from "../lib/api";

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);

  const token = localStorage.getItem("auth_token");

  // Fetch assignments
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/api/assignments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(res.data);
      } catch (err) {
        console.log("Error fetching assignments", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Submit assignment
  async function handleSubmit(assignmentId) {
  const fileUrl = prompt("Enter your file URL (ex: Google Drive link)");

  if (!fileUrl) return;

  try {
    setSubmitting(true);

    const res = await api.post(
      `/api/assignments/submit/${assignmentId}`,
      { fileUrl },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Submission successful!");
    setAssignments((prev) =>
      prev.map((a) =>
        a._id === assignmentId ? { ...a, submitted: true } : a
      )
    );

  } catch (err) {
    const msg = err.response?.data?.message;

    if (msg === "You already submitted this assignment") {
      alert("You already submitted this assignment earlier!");
    } else if (msg === "Submission deadline has passed") {
      alert("Deadline already passed!");
    } else {
      alert(msg || "Submission failed");
    }

    console.error(err);
  } finally {
    setSubmitting(false);
  }
}

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3e8ff",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "20px",
            color: "#6B21A8",
            textAlign: "center",
          }}
        >
          Student Dashboard
        </h1>

        <p style={{ textAlign: "center", color: "#555", marginBottom: "30px" }}>
          View and submit your assignments.
        </p>

        {loading ? (
          <p style={{ textAlign: "center", color: "#777" }}>Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>No assignments available.</p>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {assignments.map((a) => (
              <div
                key={a._id}
                style={{
                  padding: "20px",
                  border: "1px solid #eee",
                  borderRadius: "12px",
                  background: "#fafafa",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#6B21A8",
                  }}
                >
                  {a.title}
                </h2>

                <p style={{ marginTop: "8px", color: "#444" }}>
                  {a.description}
                </p>

                <p style={{ marginTop: "8px", color: "#777" }}>
                  <strong>Due:</strong>{" "}
                  {new Date(a.dueDate).toLocaleDateString()}
                </p>

                <button
                  onClick={() => handleSubmit(a._id)}
                  disabled={submittingId === a._id}
                  style={{
                    marginTop: "14px",
                    padding: "10px 16px",
                    background:
                      submittingId === a._id ? "#9b5de5" : "#6B21A8",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  {submittingId === a._id
                    ? "Submitting..."
                    : "Submit Assignment"}
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#9333EA",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
            }}
            onClick={() => {
              localStorage.removeItem("auth_token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}