import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Scoped CSS from your HTML
const css = `
:root{
  --beach-sand:#f9e1e0; --coral-pink:#faadb9; --mauve-rose:#bc85a3; --lavender:#9799ba; --ocean-blue:#4a7ba6;
  --text:#1b1b1b; --text-dark:#ffffff;
  --bg-start:var(--beach-sand); --bg-end:var(--coral-pink);
  --bg-start-dark:#101322; --bg-end-dark:#1f2a44;
  --brand-start:var(--mauve-rose); --brand-end:var(--lavender);
  --glass:rgba(255,255,255,0.16); --glass-dark:rgba(255,255,255,0.12);
  --input:rgba(255,255,255,0.96); --input-dark:rgba(255,255,255,0.15);
  --focus:rgba(74,123,166,0.55);
}
*{box-sizing:border-box}
.delete-root, body{
  font-family:'Nunito Sans',system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
  background:linear-gradient(135deg,var(--bg-start),var(--bg-end));
  color:var(--text);
  padding-top:90px;
  transition:background 450ms ease,color 300ms ease;
  min-height:100vh;
}
.delete-root.dark{
  background:linear-gradient(135deg,var(--bg-start-dark),var(--bg-end-dark));
  color:var(--text-dark);
}
nav.navbar{
  background:linear-gradient(90deg,var(--brand-start),var(--brand-end));
  min-height:70px;
  transition:background 450ms ease;
}
.delete-root.dark nav.navbar{ background:linear-gradient(90deg,var(--ocean-blue),#2a3b5f); }
.navbar-brand img{
  height:50px;width:auto;border-radius:50%;background:#fff;padding:3px;margin-right:10px;
  box-shadow:0 2px 6px rgba(0,0,0,0.15);
}
.navbar .nav-link,.navbar .navbar-brand,.navbar .btn{ color:#fff !important; }
.navbar .nav-link.active{ text-decoration:underline; text-underline-offset:4px; }
.theme-toggle{
  position:fixed; top:100px; right:20px; width:74px; height:38px; border-radius:999px;
  background:linear-gradient(45deg,var(--brand-start),var(--brand-end));
  box-shadow:0 8px 24px rgba(0,0,0,0.18);
  cursor:pointer; user-select:none; z-index:1100;
  transition:background 450ms ease, transform 150ms ease;
}
.theme-toggle:active{ transform:scale(0.98); }
.theme-toggle.dark{ background:linear-gradient(45deg,var(--ocean-blue),#2a3b5f); }
.toggle-slider{
  position:absolute; top:4px; left:4px; width:30px; height:30px; border-radius:50%;
  background:#ffffff; display:flex; align-items:center; justify-content:center;
  box-shadow:0 4px 14px rgba(0,0,0,0.25);
  transition:transform 420ms cubic-bezier(.2,.8,.2,1), background 420ms ease;
}
.theme-toggle.dark .toggle-slider{ transform:translateX(36px); background:#0e1016; }
.toggle-icon{ font-size:16px; transition:opacity 280ms ease; }
.sun-icon{ opacity:1; } .moon-icon{ position:absolute; opacity:0; }
.theme-toggle.dark .sun-icon{ opacity:0; } .theme-toggle.dark .moon-icon{ opacity:1; }
.form-card{
  background:var(--glass); border-radius:16px; padding:2rem; margin:40px auto 0; max-width:460px;
  box-shadow:0 16px 40px rgba(0,0,0,0.15); backdrop-filter:saturate(140%) blur(6px);
  transition:background 450ms ease,color 300ms ease, transform 200ms ease;
}
.form-card:hover{ transform:translateY(-2px); }
.delete-root.dark .form-card{ background:var(--glass-dark); }
.form-control{
  background:var(--input); border-radius:12px; border:1px solid rgba(0,0,0,0.08);
  transition:background 300ms ease,color 300ms ease,border-color 200ms ease, box-shadow 200ms ease;
}
.delete-root.dark .form-control{
  background:var(--input-dark); color:var(--text-dark); border-color:rgba(255,255,255,0.18);
}
.form-control::placeholder{ color:rgba(0,0,0,0.45); }
.delete-root.dark .form-control::placeholder{ color:rgba(255,255,255,0.72); }
.form-control:focus{ box-shadow:0 0 0 0.25rem var(--focus); border-color:var(--ocean-blue); outline:none; }
.btn-danger{
  background:linear-gradient(45deg,#dc3545,#e83e8c); border:none; color:#fff;
  transition:transform 150ms ease, filter 200ms ease;
}
.btn:hover{ transform:translateY(-1px); filter:brightness(1.02); }
`;

const CODE_REGEX = /^[a-z]{3}\/[a-z]{3}\/\d{2}\/\d{3}$/;

export default function DeleteData() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [delName, setDelName] = useState("");
  const [delCode, setDelCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const logout = () => {
    localStorage.removeItem("adminName");
    navigate("/");
  };

  // Manage localstorage students
  function getStudents() {
    return JSON.parse(localStorage.getItem('students') || '[]');
  }
  function setStudents(arr) {
    localStorage.setItem('students', JSON.stringify(arr));
  }

  const handleDelete = e => {
    e.preventDefault();
    const name = delName.trim();
    const code = delCode.trim();
    let students = getStudents();
    const before = students.length;
    students = students.filter(s => (s.code || '').toLowerCase() !== code.toLowerCase());
    const removed = before - students.length;
    setStudents(students);
    alert(
      removed > 0
        ? `Deleted:\nName: ${name}\nStudent Code: ${code}`
        : "No matching record found."
    );
    setDelName("");
    setDelCode("");
  };

  return (
    <div className={`delete-root${isDark ? " dark" : ""}`}>
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
              <li className="nav-item"><a className="nav-link active" href="/delete-data" aria-current="page">Delete Data</a></li>
              <li className="nav-item"><a className="nav-link" href="/change-password">Change Password</a></li>
            </ul>
            <button className="btn btn-outline-light" onClick={logout}>Logout</button>
          </div>
        </div>
      </nav>
      <div className="form-card">
        <h3 className="mb-3">Delete Data</h3>
        <form onSubmit={handleDelete} autoComplete="off">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Name"
            value={delName}
            required
            onChange={e => setDelName(e.target.value)}
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Student Code (e.g. bwu/bts/23/001)"
            pattern="^[a-z]{3}/[a-z]{3}/\d{2}/\d{3}$"
            title="Format: bwu/bts/23/001"
            value={delCode}
            required
            onChange={e => setDelCode(e.target.value)}
          />
          <button type="submit" className="btn btn-danger w-100">Delete</button>
        </form>
      </div>
    </div>
  );
}
