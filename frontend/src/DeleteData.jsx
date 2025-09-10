import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DeleteData = () => {
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  function getStudents() {
    return JSON.parse(localStorage.getItem("students") || "[]");
  }
  function setStudents(arr) {
    localStorage.setItem("students", JSON.stringify(arr));
  }

  const handleDelete = (e) => {
    e.preventDefault();
    const name = e.target.delName.value.trim();
    const code = e.target.delCode.value.trim();
    let students = getStudents();
    const before = students.length;
    students = students.filter(s => (s.code || "").toLowerCase() !== code.toLowerCase());
    const removed = before - students.length;
    setStudents(students);
    alert(removed > 0 ? `Deleted:\nName: ${name}\nStudent Code: ${code}` : "No matching record found.");
    e.target.reset();
  };

  const handleLogout = () => {
    localStorage.removeItem("adminName");
    navigate("/login");
  };

  return (
    <>
      {/* Theme Toggle */}
      <div className="theme-toggle" style={{
        position: "fixed", top: 100, right: 20, width: 74, height: 38, borderRadius: 999
      }} onClick={() => setIsDark(d => !d)}>
        <div className="toggle-slider" style={{
          transform: isDark ? "translateX(36px)" : "none", background: isDark ? "#0e1016" : "#fff"
        }}>
          <span className="toggle-icon sun-icon" style={{ opacity: isDark ? 0 : 1 }}>☀️</span>
          <span className="toggle-icon moon-icon" style={{ opacity: isDark ? 1 : 0, position: "absolute" }}>🌙</span>
        </div>
      </div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="/dashboard">
            <img src="/BU.png" alt="Brainware University Logo" style={{ height: 50, borderRadius: "50%", background: "#fff", padding: 3, marginRight: 10 }} />
            Admin Panel
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="adminNavbar">
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><a className="nav-link" href="/add-data">Add Data</a></li>
              <li className="nav-item"><a className="nav-link active" href="/delete-data">Delete Data</a></li>
              <li className="nav-item"><a className="nav-link" href="/change-password">Change Password</a></li>
            </ul>
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
      <div className="form-card" style={{ margin: "40px auto 0", maxWidth: 460 }}>
        <h3 className="mb-3">Delete Data</h3>
        <form id="deleteDataForm" onSubmit={handleDelete}>
          <input type="text" name="delName" className="form-control mb-3" placeholder="Name" required />
          <input type="text" name="delCode" className="form-control mb-3" placeholder="Student Code (e.g. bwu/bts/23/001)"
            pattern="^[a-z]{3}/[a-z]{3}/\d{2}/\d{3}$" title="Format: bwu/bts/23/001" required />
          <button type="submit" className="btn btn-danger w-100">Delete</button>
        </form>
      </div>
    </>
  );
};

export default DeleteData;
