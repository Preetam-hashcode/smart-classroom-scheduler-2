import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx"; // install with npm if needed
import { useNavigate } from "react-router-dom";

const AddData = () => {
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");
  const [parsedRows, setParsedRows] = useState([]);
  const [bulkStats, setBulkStats] = useState({ valid: 0, invalid: 0 });
  const [bulkPreview, setBulkPreview] = useState([]);
  const [fileSelected, setFileSelected] = useState(false);
  const [importEnabled, setImportEnabled] = useState(false);
  const fileInputRef = useRef();
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

  // Single entry
  const handleAdd = (e) => {
    e.preventDefault();
    const name = e.target.singleName.value.trim();
    const code = e.target.singleCode.value.trim();
    const regex = /^[a-z]{3}\/[a-z]{3}\/\d{2}\/\d{3}$/;
    if (!regex.test(code)) return alert("Invalid code format. Expected: bwu/bts/23/001");
    const students = getStudents();
    if (students.some(s => s.code.toLowerCase() === code.toLowerCase())) return alert("Code already exists.");
    students.push({ name, code });
    setStudents(students);
    alert(`Added:\n${name} (${code})`);
    e.target.reset();
  };

  // File change, preview, import handlers
  const handleFileChange = (e) => {
    setFileSelected(!!e.target.files.length);
    setImportEnabled(false);
    setBulkPreview([]);
    setBulkStats({ valid: 0, invalid: 0 });
    setParsedRows([]);
  };

  const handlePreview = (e) => {
    e.preventDefault();
    if (!fileInputRef.current.files.length) return;
    const file = fileInputRef.current.files[0];
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "csv") return readCsv(file);
    if (ext === "xlsx") return readXlsx(file);
    alert("Unsupported file. Please upload .xlsx or .csv");
  };

  function validateRows(rows) {
    const regex = /^[a-z]{3}\/[a-z]{3}\/\d{2}\/\d{3}$/;
    const existing = getStudents();
    return rows.map(r => {
      const name = (r.Name ?? r.name ?? "").toString().trim();
      const code = (r.Code ?? r.code ?? "").toString().trim();
      let valid = true, reason = "";
      if (!name || !code) { valid = false; reason = "Missing name or code"; }
      else if (!regex.test(code)) { valid = false; reason = "Invalid code format"; }
      else if (existing.some(s => s.code.toLowerCase() === code.toLowerCase())) { valid = false; reason = "Duplicate (existing)"; }
      return { name, code, valid, reason };
    });
  }

  function renderPreview(rows) {
    setBulkPreview(rows);
    setBulkStats({
      valid: rows.filter(r => r.valid).length,
      invalid: rows.filter(r => !r.valid).length,
    });
    setImportEnabled(rows.some(r => r.valid));
  }

  function readCsv(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const lines = text.split(/\r?\n/).filter(l => l.trim().length);
      if (lines.length < 2) return renderPreview([]);
      const headers = lines[0].split(",").map(h => h.trim());
      const rows = lines.slice(1).map(line => {
        const cols = line.split(",");
        let obj = {};
        headers.forEach((h, idx) => obj[h] = cols[idx] ?? "");
        return obj;
      });
      const validated = validateRows(rows);
      setParsedRows(validated);
      renderPreview(validated);
    };
    reader.readAsText(file);
  }
  function readXlsx(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.SheetNames[0];
      const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
      const validated = validateRows(rows);
      setParsedRows(validated);
      renderPreview(validated);
    };
    reader.readAsArrayBuffer(file);
  }
  const handleImport = (e) => {
    e.preventDefault();
    const students = getStudents();
    let added = 0;
    parsedRows.filter(r => r.valid).forEach(row => {
      if (!students.some(s => s.code.toLowerCase() === row.code.toLowerCase())) {
        students.push({ name: row.name, code: row.code });
        added++;
      }
    });
    setStudents(students);
    alert(`Import complete. ${added} new records added.`);
    fileInputRef.current.value = "";
    setFileSelected(false);
    setImportEnabled(false);
    setParsedRows([]);
    setBulkStats({ valid: 0, invalid: 0 });
    setBulkPreview([]);
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
              <li className="nav-item"><a className="nav-link active" href="/add-data">Add Data</a></li>
              <li className="nav-item"><a className="nav-link" href="/delete-data">Delete Data</a></li>
              <li className="nav-item"><a className="nav-link" href="/change-password">Change Password</a></li>
            </ul>
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
      {/* Add Data Form */}
      <div className="container mt-4">
        <div className="form-card">
          <h3 className="mb-3">Add Single Entry</h3>
          <form id="addDataForm" onSubmit={handleAdd}>
            <input type="text" name="singleName" className="form-control mb-3" placeholder="Name" required />
            <input type="text" name="singleCode" className="form-control mb-3"
              placeholder="Student Code (e.g. bwu/bts/23/001)"
              pattern="^[a-z]{3}/[a-z]{3}/\d{2}/\d{3}$"
              title="Format: bwu/bts/23/001"
              required
            />
            <button type="submit" className="btn btn-primary w-100">Submit</button>
          </form>
        </div>
        <div className="form-card">
          <h3 className="mb-3">Bulk Upload</h3>
          <input ref={fileInputRef} type="file" accept=".csv,.xlsx" className="form-control mb-3" onChange={handleFileChange} />
          <div className="d-flex gap-2 mb-3">
            <button className="btn btn-primary flex-grow-1" disabled={!fileSelected} onClick={handlePreview}>Preview</button>
            <button className="btn btn-warning flex-grow-1" disabled={!importEnabled} onClick={handleImport}>Import</button>
          </div>
          {bulkPreview.length > 0 &&
            <div>
              <div className="text-muted mb-2" style={{ display: "block" }}>
                Preview: {bulkPreview.length} rows — {bulkStats.valid} valid, {bulkStats.invalid} invalid
              </div>
              <div className="table-responsive" style={{ display: "block" }}>
                <table className="table table-sm table-hover align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Code</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkPreview.map((r, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{r.name}</td>
                        <td><code>{r.code}</code></td>
                        <td>
                          {r.valid ?
                            <span className="badge badge-valid" style={{ backgroundColor: "#2e7d32" }}>valid</span> :
                            <span className="badge badge-invalid" style={{ backgroundColor: "#c62828" }}>invalid</span>
                          }
                          {!r.valid && <span style={{ marginLeft: 5 }}>{r.reason}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default AddData;
