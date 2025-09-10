import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Scoped CSS copied from your HTML
const css = `
:root {
  --beach-sand: #f9e1e0;
  --coral-pink: #faadb9;
  --mauve-rose: #bc85a3;
  --lavender: #9799ba;
  --ocean-blue: #4a7ba6;
  --text: #1b1b1b;
  --text-dark: #ffffff;
  --bg-start: var(--beach-sand);
  --bg-end: var(--coral-pink);
  --bg-start-dark: #101322;
  --bg-end-dark: #1f2a44;
  --brand-start: var(--mauve-rose);
  --brand-end: var(--lavender);
  --glass: rgba(255,255,255,0.16);
  --glass-dark: rgba(255,255,255,0.12);
  --input: rgba(255,255,255,0.96);
  --input-dark: rgba(255,255,255,0.15);
  --focus: rgba(74,123,166,0.55);
}
body, .change-pass-root {
  font-family: 'Nunito Sans', sans-serif;
  background: linear-gradient(135deg, var(--bg-start), var(--bg-end));
  color: var(--text);
  padding-top: 90px;
  transition: background 450ms ease, color 300ms ease;
  min-height: 100vh;
}
.change-pass-root.dark {
  background: linear-gradient(135deg, var(--bg-start-dark), var(--bg-end-dark));
  color: var(--text-dark);
}
nav.navbar {
  background: linear-gradient(90deg, var(--brand-start), var(--brand-end));
  min-height: 70px;
  transition: background 450ms ease;
}
.change-pass-root.dark nav.navbar {
  background: linear-gradient(90deg, var(--ocean-blue), #2a3b5f);
}
.navbar-brand img {
  height: 50px;
  border-radius: 50%;
  background: #fff;
  padding: 3px;
  margin-right: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
.navbar .nav-link, .navbar .navbar-brand, .navbar .btn { color: #fff !important; }
.navbar .nav-link.active { text-decoration: underline; text-underline-offset: 4px; }
.theme-toggle {
  position: fixed;
  top: 100px;
  right: 20px;
  width: 74px;
  height: 38px;
  border-radius: 999px;
  background: linear-gradient(45deg, var(--brand-start), var(--brand-end));
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  cursor: pointer;
  transition: background 450ms ease, transform 150ms ease;
  user-select: none;
  z-index: 1100;
}
.theme-toggle:active { transform: scale(0.98); }
.theme-toggle.dark {
  background: linear-gradient(45deg, var(--ocean-blue), #2a3b5f);
}
.toggle-slider {
  position: absolute;
  top: 4px; left: 4px;
  width: 30px; height: 30px;
  border-radius: 50%;
  background: #ffffff;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 14px rgba(0,0,0,0.25);
  transition: transform 420ms cubic-bezier(.2,.8,.2,1), background 420ms ease;
}
.theme-toggle.dark .toggle-slider {
  transform: translateX(36px);
  background: #0e1016;
}
.toggle-icon { font-size: 16px; transition: opacity 280ms ease; }
.sun-icon { opacity: 1; }
.moon-icon { position: absolute; opacity: 0; }
.theme-toggle.dark .sun-icon { opacity: 0; }
.theme-toggle.dark .moon-icon { opacity: 1; }
.form-card {
  background: var(--glass);
  border-radius: 16px;
  padding: 2rem;
  margin: 40px auto;
  max-width: 460px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.15);
  backdrop-filter: saturate(140%) blur(6px);
  transition: background 450ms ease, color 300ms ease, transform 200ms ease;
}
.change-pass-root.dark .form-card { background: var(--glass-dark); }
.form-card:hover { transform: translateY(-2px); }
.form-control {
  background: var(--input);
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.08);
  transition: background 300ms ease, color 300ms ease, border-color 200ms ease, box-shadow 200ms ease;
}
.change-pass-root.dark .form-control {
  background: var(--input-dark);
  color: var(--text-dark);
  border-color: rgba(255,255,255,0.18);
}
.form-control::placeholder { color: rgba(0,0,0,0.45); }
.change-pass-root.dark .form-control::placeholder { color: rgba(255,255,255,0.72); }
.form-control:focus {
  box-shadow: 0 0 0 0.25rem var(--focus);
  border-color: var(--ocean-blue);
  outline: none;
}
.btn-warning {
  background: linear-gradient(45deg, #ffd54f, #ffb300);
  border: none;
  color: #111;
}
.btn-primary {
  background: linear-gradient(45deg, var(--brand-start), var(--brand-end));
  border: none;
  color: #fff;
}
.btn:hover { transform: translateY(-1px); filter: brightness(1.02); }
`;

export default function ChangePassword() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [showModal, setShowModal] = useState(false);
  const [prevPass, setPrevPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newRecoveredPass, setNewRecoveredPass] = useState("");
  const navigate = useNavigate();

  // Theme persistence
  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const logout = () => {
    localStorage.removeItem("adminName");
    navigate("/");
  };

  // Admin data helpers
  function getAdmin() {
    const raw = localStorage.getItem("admin");
    if (!raw) {
      const seed = { password: "admin123", recoveryCode: "BU2025" };
      localStorage.setItem("admin", JSON.stringify(seed));
      return seed;
    }
    try { return JSON.parse(raw); }
    catch (e) {
      const seed = { password: "admin123", recoveryCode: "BU2025" };
      localStorage.setItem("admin", JSON.stringify(seed));
      return seed;
    }
  }
  function setAdmin(obj) {
    localStorage.setItem("admin", JSON.stringify(obj));
  }

  // Change password
  const handlePasswordChange = e => {
    e.preventDefault();
    const prev = prevPass.trim();
    const nPass = newPass.trim();
    const cPass = confirmPass.trim();
    const admin = getAdmin();
    if (!prev || !nPass || !cPass) { alert('Please fill all fields.'); return; }
    if (nPass.length < 6) { alert('New password must be at least 6 characters.'); return; }
    if (nPass !== cPass) { alert('New and confirm password do not match.'); return; }
    if (prev !== admin.password) { alert('Current password is incorrect.'); return; }
    admin.password = nPass;
    setAdmin(admin);
    alert('Password changed successfully.');
    setPrevPass(""); setNewPass(""); setConfirmPass("");
  };

  // Recover password from modal
  const handleRecover = e => {
    e.preventDefault();
    const code = recoveryCode.trim();
    const nPass = newRecoveredPass.trim();
    const admin = getAdmin();
    if (!code || !nPass) { alert('Please enter recovery code and new password.'); return; }
    if (code !== admin.recoveryCode) { alert('Invalid recovery code.'); return; }
    if (nPass.length < 6) { alert('New password must be at least 6 characters.'); return; }
    admin.password = nPass;
    setAdmin(admin);
    alert('Password reset successfully.');
    setRecoveryCode(""); setNewRecoveredPass(""); setShowModal(false);
  };

  return (
    <div className={`change-pass-root${isDark ? " dark" : ""}`}>
      <style>{css}</style>
      {/* Theme toggle */}
      <div className={`theme-toggle${isDark ? " dark" : ""}`}
        aria-label="Toggle theme"
        title="Toggle theme"
        onClick={() => setIsDark(d => !d)}
      >
        <div className="toggle-slider">
          <span className="toggle-icon sun-icon" aria-hidden="true">☀️</span>
          <span className="toggle-icon moon-icon" aria-hidden="true">🌙</span>
        </div>
      </div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="/admin-dashboard">
            <img src="/BU.png" alt="Brainware University Logo" />
            Admin Panel
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar"
            aria-controls="adminNavbar" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="adminNavbar">
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><a className="nav-link" href="/add-data">Add Data</a></li>
              <li className="nav-item"><a className="nav-link" href="/delete-data">Delete Data</a></li>
              <li className="nav-item"><a className="nav-link active" href="/change-password" aria-current="page">Change Password</a></li>
            </ul>
            <button className="btn btn-outline-light" onClick={logout}>Logout</button>
          </div>
        </div>
      </nav>
      {/* Change Password Card */}
      <div className="form-card">
        <h3 className="mb-3">Change Password</h3>
        <form onSubmit={handlePasswordChange} autoComplete="off">
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Current Password"
            value={prevPass}
            required
            onChange={e => setPrevPass(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="New Password (min 6 chars)"
            value={newPass}
            required
            onChange={e => setNewPass(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Confirm New Password"
            value={confirmPass}
            required
            onChange={e => setConfirmPass(e.target.value)}
          />
          <button type="submit" className="btn btn-warning w-100 mb-2">Change Password</button>
        </form>
        <div className="text-center mt-2">
          <span className="text-decoration-underline"
            style={{ cursor: "pointer" }}
            onClick={() => setShowModal(true)}>
            Forgot password?
          </span>
        </div>
      </div>
      {/* Recovery Modal */}
      {showModal &&
        <div className="modal fade show" style={{
          display: "block", background: "rgba(0,0,0,0.3)"
        }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: "14px" }}>
              <div className="modal-header" style={{ background: "#f9e1e0" }}>
                <h5 className="modal-title">Password Recovery</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form className="modal-body" onSubmit={handleRecover}>
                <p className="mb-2">Enter your recovery code to reset your password.</p>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Recovery Code"
                  value={recoveryCode}
                  onChange={e => setRecoveryCode(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="New Password"
                  value={newRecoveredPass}
                  onChange={e => setNewRecoveredPass(e.target.value)}
                />
                <button type="submit" className="btn btn-primary w-100">Reset Password</button>
              </form>
            </div>
          </div>
        </div>
      }
    </div>
  );
}
