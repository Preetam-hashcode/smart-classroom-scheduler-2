import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  function getAdmin() {
    const raw = localStorage.getItem("admin");
    if (!raw) {
      const seed = { password: "admin123", recoveryCode: "BU2025" };
      localStorage.setItem("admin", JSON.stringify(seed));
      return seed;
    }
    try { return JSON.parse(raw); } catch {
      const seed = { password: "admin123", recoveryCode: "BU2025" };
      localStorage.setItem("admin", JSON.stringify(seed));
      return seed;
    }
  }
  function setAdmin(obj) {
    localStorage.setItem("admin", JSON.stringify(obj));
  }
  const handleLogout = () => {
    localStorage.removeItem("adminName");
    navigate("/login");
  };
  // Change password
  const handleChange = (e) => {
    e.preventDefault();
    const prev = e.target.prevPass.value.trim();
    const newPass = e.target.newPass.value.trim();
    const confirm = e.target.confirmPass.value.trim();
    const admin = getAdmin();
    if (!prev || !newPass || !confirm) return alert("Please fill all fields.");
    if (newPass.length < 6) return alert("New password must be at least 6 characters.");
    if (newPass !== confirm) return alert("New and confirm password do not match.");
    if (prev !== admin.password) return alert("Current password is incorrect.");
    admin.password = newPass;
    setAdmin(admin);
    alert("Password changed successfully.");
    e.target.reset();
  };
  // Recovery modal
  const handleRecover = (e) => {
    e.preventDefault();
    const code = e.target.recoveryCode.value.trim();
    const newPass = e.target.newRecoveredPass.value.trim();
    const admin = getAdmin();
    if (!code || !newPass) return alert("Please enter recovery code and new password.");
    if (code !== admin.recoveryCode) return alert("Invalid recovery code.");
    if (newPass.length < 6) return alert("New password must be at least 6 characters.");
    admin.password = newPass;
    setAdmin(admin);
    alert("Password reset successfully.");
    e.target.reset();
    setShowModal(false);
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
              <li className="nav-item"><a className="nav-link" href="/delete-data">Delete Data</a></li>
              <li className="nav-item"><a className="nav-link active" href="/change-password">Change Password</a></li>
            </ul>
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
      {/* Form */}
      <div className="form-card" style={{ margin: "40px auto", maxWidth: 460 }}>
        <h3 className="mb-3">Change Password</h3>
        <form id="changePasswordForm" onSubmit={handleChange}>
          <input type="password" name="prevPass" className="form-control mb-3" placeholder="Current Password" required />
          <input type="password" name="newPass" className="form-control mb-3" placeholder="New Password (min 6 chars)" required />
          <input type="password" name="confirmPass" className="form-control mb-3" placeholder="Confirm New Password" required />
          <button type="submit" className="btn btn-warning w-100 mb-2">Change Password</button>
        </form>
        <div className="text-center mt-2">
          <span className="text-decoration-underline" style={{ cursor: "pointer" }}
            onClick={() => setShowModal(true)}>
            Forgot password?
          </span>
        </div>
      </div>
      {/* Modal */}
      {showModal &&
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.4)" }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 14 }}>
              <div className="modal-header" style={{ background: "#f9e1e0" }}>
                <h5 className="modal-title">Password Recovery</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form className="modal-body" onSubmit={handleRecover}>
                <p className="mb-2">Enter your recovery code to reset your password.</p>
                <input type="text" name="recoveryCode" className="form-control mb-3" placeholder="Recovery Code" />
                <input type="password" name="newRecoveredPass" className="form-control mb-3" placeholder="New Password" />
                <button className="btn btn-primary w-100" type="submit">Reset Password</button>
              </form>
            </div>
          </div>
        </div>}
    </>
  );
};

export default ChangePassword;
