import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// If using create-react-app, place BU.png in /public or /src/assets and adjust import path accordingly

const AdminDashboard = () => {
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleLogout = () => {
    localStorage.removeItem("adminName");
    navigate("/login"); // or window.location.replace("/login")
  };

  return (
    <>
      {/* Theme Toggle */}
      <div className="theme-toggle-container" style={{
        position: "fixed", top: 100, right: 28, zIndex: 1100
      }}>
        <div
          className={`theme-toggle${isDark ? " dark" : ""}`}
          onClick={() => setIsDark(d => !d)}>
          <div className={`toggle-slider${isDark ? " dark" : ""}`}>
            <span className="toggle-icon sun-icon" style={{ opacity: isDark ? 0 : 1 }}>☀️</span>
            <span className="toggle-icon moon-icon" style={{ opacity: isDark ? 1 : 0, position: "absolute" }}>🌙</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="/dashboard">
            <img src="/BU.png" alt="Brainware University Logo" style={{ height: 50, borderRadius: "50%", background: "#fff", padding: 3, marginRight: 10 }} />
            Admin Panel
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="adminNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><a className="nav-link" href="/add-data">Add Data</a></li>
              <li className="nav-item"><a className="nav-link" href="/delete-data">Delete Data</a></li>
              <li className="nav-item"><a className="nav-link" href="/change-password">Change Password</a></li>
            </ul>
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="main-content" style={{ padding: "120px 2rem 2rem" }}>
        <div className="welcome-section" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 className="welcome-text" style={{ fontSize: "2.6rem", fontWeight: 600 }}>Welcome, Admin!</h1>
          <p className="subtitle">You are now logged into the admin dashboard</p>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
