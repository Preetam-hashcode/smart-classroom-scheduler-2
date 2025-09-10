import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const addDataCss = `
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
* { box-sizing: border-box; }
.add-data-root, body {
  font-family: 'Nunito Sans', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  background: linear-gradient(135deg, var(--bg-start), var(--bg-end));
  color: var(--text);
  padding-top: 90px;
  transition: background 450ms ease, color 300ms ease;
  min-height: 100vh;
}
.add-data-root.dark {
  background: linear-gradient(135deg, var(--bg-start-dark), var(--bg-end-dark));
  color: var(--text-dark);
}
nav.navbar {
  background: linear-gradient(90deg, var(--brand-start), var(--brand-end));
  min-height: 70px;
  transition: background 450ms ease;
}
.add-data-root.dark nav.navbar {
  background: linear-gradient(90deg, var(--ocean-blue), #2a3b5f);
}
.navbar-brand img {
  height: 50px;
  width: auto;
  border-radius: 50%;
  background: #fff;
  padding: 3px;
  margin-right: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
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
  user-select: none;
  transition: background 450ms ease, transform 150ms ease;
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
.toggle-icon {
  font-size: 16px;
  transition: opacity 280ms ease;
}
.sun-icon { opacity: 1; }
.moon-icon { position: absolute; opacity: 0; }
.theme-toggle.dark .sun-icon { opacity: 0; }
.theme-toggle.dark .moon-icon { opacity: 1; }
.form-card {
  background: var(--glass);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 16px 40px rgba(0,0,0,0.15);
  backdrop-filter: saturate(140%) blur(6px);
  transition: background 450ms ease, color 300ms ease, transform 200ms ease;
}
.form-card:hover { transform: translateY(-2px); }
.add-data-root.dark .form-card { background: var(--glass-dark); }
.form-control {
  background: var(--input);
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.08);
  transition: background 300ms ease, color 300ms ease, box-shadow 200ms ease, border-color 200ms ease;
}
.add-data-root.dark .form-control {
  background: var(--input-dark);
  color: var(--text-dark);
  border-color: rgba(255,255,255,0.18);
}
.form-control::placeholder { color: rgba(0,0,0,0.45); }
.add-data-root.dark .form-control::placeholder { color: rgba(255,255,255,0.7); }
.form-control:focus {
  box-shadow: 0 0 0 0.25rem var(--focus);
  border-color: var(--ocean-blue);
  outline: none;
}
.btn-primary {
  background: linear-gradient(45deg, var(--brand-start), var(--brand-end));
  border: none;
  transition: transform 150ms ease, filter 200ms ease;
}
.btn-warning {
  background: linear-gradient(45deg, #ffd54f, #ffb300);
  border: none;
  color: #111;
}
.btn:hover { transform: translateY(-1px); filter: brightness(1.02); }
.table-responsive { border-radius: 12px; overflow: auto; }
.badge-valid { background-color: #2e7d32; }
.badge-invalid { background-color: #c62828; }
`;

const CODE_REGEX = /^[a-z]{3}\/[a-z]{3}\/\d{2}\/\d{3}$/;

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]
  ));
}

function AddData() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [students, setStudents] = useState(() => JSON.parse(localStorage.getItem("students") || "[]"));

  // Single entry states
  const [singleName, setSingleName] = useState("");
  const [singleCode, setSingleCode] = useState("");

  // Bulk upload states
  const [file, setFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [bulkStats, setBulkStats] = useState("");
  const [validCount, setValidCount] = useState(0);
  const [invalidCount, setInvalidCount] = useState(0);

  const fileInputRef = useRef();
  const previewBodyRef = useRef();
  const navigate = useNavigate();

  // Theme state
  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Save students on change
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  // Handlers
  const logout = () => {
    localStorage.removeItem("adminName");
    navigate("/"); // change to your login path if needed
  };

  const handleSingleSubmit = e => {
    e.preventDefault();
    if (!CODE_REGEX.test(singleCode)) {
      alert("Invalid code format. Expected: bwu/bts/23/001");
      return;
    }
    if (students.some(s => s.code.toLowerCase() === singleCode.toLowerCase())) {
      alert("Code already exists.");
      return;
    }
    setStudents([...students, { name: singleName, code: singleCode }]);
    alert(`Added:\n${singleName} (${singleCode})`);
    setSingleName("");
    setSingleCode("");
  };

  // CSV utils
  function parseCSV(text) {
    const [headerLine, ...rows] = text.split(/\r?\n/).filter(Boolean);
    const headers = splitCsvLine(headerLine).map(h => h.trim());
    return rows.map(line => {
      const cols = splitCsvLine(line);
      let obj = {};
      headers.forEach((h, idx) => obj[h] = cols[idx] ?? "");
      return obj;
    });
  }

  function splitCsvLine(line) {
    // Minimal for quoted CSVs
    const result = [], re = /("([^"]|"")*"|[^,]*)(,|$)/g;
    line.replace(re, (m, field) => result.push(field.replace(/^"|"$/g, '').replace(/""/g, '"')));
    if (result[result.length-1] === "") result.pop(); // Remove trailing
    return result;
  }

  // Bulk helpers
  function validateRows(rows) {
    return rows.map(r => {
      const name = (r.Name ?? r.name ?? "").toString().trim();
      const code = (r.Code ?? r.code ?? "").toString().trim();
      let valid = true, reason = "";
      if (!name || !code) { valid = false; reason = "Missing name or code"; }
      else if (!CODE_REGEX.test(code)) { valid = false; reason = "Invalid code format"; }
      else if (students.some(s => s.code.toLowerCase() === code.toLowerCase())) { valid = false; reason = "Duplicate (existing)"; }
      return { name, code, valid, reason };
    });
  }

  const handleFileChange = e => {
    const f = e.target.files[0];
    setFile(f || null);
    setParsedRows([]);
    setShowPreview(false);
    setBulkStats("");
    setValidCount(0);
    setInvalidCount(0);
  };

  const handlePreview = async e => {
    e.preventDefault();
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === "csv") {
      const text = await file.text();
      const rows = parseCSV(text);
      const validated = validateRows(rows);
      setParsedRows(validated);
      const v = validated.filter(r => r.valid).length, i = validated.filter(r => !r.valid).length;
      setValidCount(v); setInvalidCount(i);
      setShowPreview(true);
      setBulkStats(`Preview: ${validated.length} rows — ${v} valid, ${i} invalid`);
    } else {
      alert("Only .csv import enabled in demo. XLSX import needs extra library in React.");
    }
  };

  const handleImport = () => {
    const newRows = parsedRows.filter(r => r.valid && !students.some(s => s.code.toLowerCase() === r.code.toLowerCase()));
    setStudents([...students, ...newRows.map(r => ({ name: r.name, code: r.code }))]);
    alert(`Import complete. ${newRows.length} new records added.`);
    setFile(null);
    setParsedRows([]);
    setShowPreview(false);
    setBulkStats("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={`add-data-root${isDark ? " dark" : ""}`}>
      <style>{addDataCss}</style>
      {/* Theme toggle */}
      <div className={`theme-toggle${isDark ? " dark" : ""}`} aria-label="Toggle theme" title="Toggle theme" onClick={() => setIsDark(d => !d)}>
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
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="adminNavbar">
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><a className="nav-link active" href="/add-data">Add Data</a></li>
              <li className="nav-item"><a className="nav-link" href="/delete-data">Delete Data</a></li>
              <li className="nav-item"><a className="nav-link" href="/change-password">Change Password</a></li>
            </ul>
            <button className="btn btn-outline-light" onClick={logout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="form-card">
          <h3 className="mb-3">Add Single Entry</h3>
          <form onSubmit={handleSingleSubmit} autoComplete="off">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Name"
              value={singleName}
              required
              onChange={e => setSingleName(e.target.value)}
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Student Code (e.g. bwu/bts/23/001)"
              pattern="^[a-z]{3}/[a-z]{3}/\d{2}/\d{3}$"
              title="Format: bwu/bts/23/001"
              value={singleCode}
              required
              onChange={e => setSingleCode(e.target.value)}
            />
            <button type="submit" className="btn btn-primary w-100">Submit</button>
          </form>
        </div>

        <div className="form-card">
          <h3 className="mb-3">Bulk Upload</h3>
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            className="form-control mb-3"
            onChange={handleFileChange}
          />
          <div className="d-flex gap-2 mb-3">
            <button
              className="btn btn-primary flex-grow-1"
              onClick={handlePreview}
              disabled={!file}
            >Preview</button>
            <button
              className="btn btn-warning flex-grow-1"
              onClick={handleImport}
              disabled={parsedRows.filter(r => r.valid).length === 0}
              type="button"
            >Import</button>
          </div>
          {bulkStats && <div className="text-muted mb-2">{bulkStats}</div>}
          {showPreview && (
            <div className="table-responsive">
              <table className="table table-sm table-hover align-middle">
                <thead>
                  <tr>
                    <th>#</th><th>Name</th><th>Code</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.map((r, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{escapeHtml(r.name)}</td>
                      <td><code>{escapeHtml(r.code)}</code></td>
                      <td>
                        {r.valid
                          ? <span className="badge badge-valid">valid</span>
                          : <span className="badge badge-invalid">invalid</span>} {r.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddData;
