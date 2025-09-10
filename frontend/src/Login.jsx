// src/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import "./index.css";

function Login() {
  const [form, setForm] = useState({ designation: "", id: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = { designation: form.designation };
    if (form.designation === "Student") payload.id = form.id;
    if (form.designation === "Faculty") {
      payload.code = form.id;
      payload.password = form.password;
    }
    if (form.designation === "Admin") {
      payload.id = form.id;
      payload.password = form.password;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.success) {
        if (form.designation === "Student" || form.designation === "Faculty") {
          const user = {
            username: form.id,
            role: form.designation === "Faculty" ? "teacher" : "student",
          };
          navigate("/booking", { state: { user } });
        } else if (form.designation === "Admin") {
          // Save admin login session
          localStorage.setItem("adminName", form.id);
          navigate("/admin-dashboard", { state: { username: form.id } });
        }
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img
            src="/Brainware_University.webp"
            alt="Logo"
            className="logo-img"
          />
        </div>
        <h1 className="title">Brainware University</h1>
        <p className="subtitle">Smart Classroom System</p>
        <div className="form-container">
          <h2 className="form-title">Login</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <select
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select Designation</option>
                <option value="Faculty">Faculty</option>
                <option value="Student">Student</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            {form.designation && (
              <div className="form-group">
                <input
                  type="text"
                  name="id"
                  value={form.id}
                  onChange={handleChange}
                  placeholder={
                    form.designation === "Faculty"
                      ? "Enter Faculty Code"
                      : form.designation === "Student"
                      ? "Enter Student ID"
                      : "Enter Admin ID"
                  }
                  className="form-input"
                  autoComplete="off"
                  required
                />
              </div>
            )}
            {(form.designation === "Faculty" ||
              form.designation === "Admin") && (
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  className="form-input"
                  required
                />
              </div>
            )}
            <button
              type="submit"
              className="login-button"
              disabled={
                !form.designation ||
                !form.id ||
                ((form.designation === "Faculty" ||
                  form.designation === "Admin") &&
                  !form.password)
              }
              style={{
                background:
                  form.designation === "Admin"
                    ? "#FAAE7B"
                    : form.designation === "Faculty"
                    ? "#2563eb"
                    : "#5d8cf3",
                color: "#fff",
                border: "none",
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
