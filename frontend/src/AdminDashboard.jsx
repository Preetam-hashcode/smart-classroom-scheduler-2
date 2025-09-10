import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// If you're using create-react-app or Vite, put BU.png inside /public or /src/assets and adjust the path accordingly

const dashboardCSS = `
:root {
  --beach-sand: #f9e1e0;
  --coral-pink: #faadb9;
  --mauve-rose: #bc85a3;
  --lavender: #9799ba;
  --ocean-blue: #4a7ba6;
  --text: #1b1b1b;
  --text-2: #444;
  --text-dark: #ffffff;
  --text-2-dark: #d0d0d0;
  --bg-start: var(--beach-sand);
  --bg-end: var(--coral-pink);
  --bg-start-dark: #1a1b2e;
  --bg-end-dark: #2a3b5f;
  --brand-start: var(--mauve-rose);
  --brand-end: var(--lavender);
  --glass: rgba(255, 255, 255, 0.15);
  --glass-border: rgba(255, 255, 255, 0.25);
  --glass-dark: rgba(255, 255, 255, 0.08);
  --glass-border-dark: rgba(255, 255, 255, 0.18);
  --input: rgba(255, 255, 255, 0.95);
  --input-dark: rgba(255, 255, 255, 0.12);
  --focus: rgba(74, 123, 166, 0.5);
  --radius: 18px;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body, .dashboard-root {
  font-family: 'Nunito Sans', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
  color: var(--text);
  background: linear-gradient(135deg, var(--bg-start) 0%, var(--bg-end) 100%);
  opacity: 0;
  animation: fadeBody 0.5s ease-out forwards;
}
.dashboard-root.dark {
  color: var(--text-dark);
  background: linear-gradient(135deg, var(--bg-start-dark) 0%, var(--bg-end-dark) 100%);
}
nav.navbar {
  position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
  background: linear-gradient(90deg, var(--brand-start), var(--brand-end));
  animation: slideNav 0.45s ease-out both;
  min-height: 70px;
}
.navbar .navbar-brand, .navbar .nav-link, .navbar .btn { color: #fff !important; }
.navbar .nav-link.active { text-decoration: underline; text-underline-offset: 4px; }
.navbar-brand img {
  height: 50px;
  width: auto;
  border-radius: 50%;
  background: white;
  padding: 3px;
  margin-right: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
.theme-toggle-container { position: fixed; top: 100px; right: 28px; z-index: 1100; }
.theme-toggle {
  position: relative; width: 70px; height: 35px; border-radius: 50px; cursor: pointer; overflow: hidden;
  background: linear-gradient(45deg, var(--brand-start), var(--brand-end));
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}
.theme-toggle.dark { background: linear-gradient(45deg, var(--ocean-blue), #2a3b5f); }
.toggle-slider {
  position: absolute; top: 3px; left: 3px; width: 29px; height: 29px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.4s ease; background: #fff;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
.theme-toggle.dark .toggle-slider { background: #111; transform: translateX(35px); }
.toggle-icon { font-size: 16px; }
.sun-icon { opacity: 1; transition: opacity 0.3s; }
.moon-icon { opacity: 0; position: absolute; transition: opacity 0.3s; }
.theme-toggle.dark .sun-icon { opacity: 0; }
.theme-toggle.dark .moon-icon { opacity: 1; }
.main-content { padding: 120px 2rem 2rem; min-height: calc(100vh - 80px); }
.welcome-section { text-align: center; margin-bottom: 2.5rem; }
.welcome-text { font-size: 2.6rem; margin-bottom: 0.5rem; font-weight: 600; text-shadow: 0 4px 8px rgba(0,0,0,0.25); }
.subtitle { color: var(--text-2); }
.dashboard-root.dark .subtitle { color: var(--text-2-dark); }
@keyframes fadeBody { to { opacity: 1; } }
@keyframes slideNav { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`;

function AdminDashboard() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
  const navigate = useNavigate();

  // Handle fade-in like original animation
  useEffect(() => {
    document.body.style.opacity = 1;
    return () => { document.body.style.opacity = ''; };
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  function handleLogout() {
    localStorage.removeItem("adminName");
    navigate("/"); // Change to your login route if needed
  }

  return (
    <div className={`dashboard-root${isDark ? " dark" : ""}`}>
      {/* Inline custom styles for this page */}
      <style>{dashboardCSS}</style>

      {/* Theme Toggle */}
      <div className="theme-toggle-container">
        <div className={`theme-toggle${isDark ? " dark" : ""}`} onClick={() => setIsDark(d => !d)}>
          <div className={`toggle-slider${isDark ? " dark" : ""}`}>
            <span className="toggle-icon sun-icon" aria-hidden="true">☀️</span>
            <span className="toggle-icon moon-icon" aria-hidden="true">🌙</span>
          </div>
        </div>
      </div>

      {/* NavBar */}
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="/admin-dashboard">
            <img src="/BU.png" alt="Brainware University Logo" />
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

      <div className="main-content">
        <div className="welcome-section">
          <h1 className="welcome-text">Welcome, Admin!</h1>
          <p className="subtitle">You are now logged into the admin dashboard</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
