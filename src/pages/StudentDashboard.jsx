import { useEffect, useState } from "react";
import api from "../lib/api";

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // this holds which assignment is being submitted
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("auth");

  // Fetch assignments on load
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/api/assignments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(res.data);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Submit an assignment
  async function handleSubmit(aid) {
    if (!fileUrl.trim()) {
      alert("Please enter a file URL");
      return;
    }

    try {
      setSubmitting(true);

      const res = await api.post(
        `/api/assignments/submit/${aid}`,
        { fileUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Submission successful!");

      // close UI box
      setActiveAssignment(null);
      setFileUrl("");

    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === "You already submitted this assignment") {
        alert("This assignment is already submitted");
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

        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : assignments.length === 0 ? (
          <p style={{ textAlign: "center" }}>No assignments available.</p>
        ) : (
          assignments.map((a) => (
            <div
              key={a._id}
              style={{
                padding: "20px",
                border: "1px solid #e5e5e5",
                background: "#fafafa",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ color: "#6B21A8", fontSize: "20px" }}>{a.title}</h2>
              <p style={{ marginTop: 8 }}>{a.description}</p>

              <p style={{ marginTop: 8, color: "#555" }}>
                <strong>Due:</strong>{" "}
                {new Date(a.dueDate).toLocaleDateString()}
              </p>

              {/* Submit button */}
              <button
                onClick={() => setActiveAssignment(a._id)}
                style={{
                  marginTop: 12,
                  padding: "10px 16px",
                  background: "#6B21A8",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Submit Assignment
              </button>

              {/* Input UI appears when submit clicked */}
              {activeAssignment === a._id && (
                <div
                  style={{
                    marginTop: 15,
                    padding: 15,
                    background: "white",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                  }}
                >
                  <input
                    type="text"
                    placeholder="Enter file URL"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 8,
                      border: "1px solid #ccc",
                      marginBottom: 10,
                    }}
                  />

                  <button
                    onClick={() => handleSubmit(a._id)}
                    disabled={submitting}
                    style={{
                      padding: "10px 16px",
                      background: submitting ? "#9b5de5" : "#6B21A8",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      width: "100%",
                    }}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>

                  <button
                    onClick={() => {
                      setActiveAssignment(null);
                      setFileUrl("");
                    }}
                    style={{
                      marginTop: 10,
                      padding: "10px 16px",
                      background: "#e5e5e5",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}

        {/* Logout */}
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <button
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              background: "#9333EA",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
            }}
            onClick={() => {
              localStorage.removeItem("auth");
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