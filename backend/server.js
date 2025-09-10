const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

app.post('/api/login', async (req, res) => {
  const { id, code, password, designation } = req.body;
  if (!designation)
    return res.json({ success: false, error: "Designation is required." });

  try {
    if (designation === "Student") {
      if (!id) return res.json({ success: false, error: "Student ID is required." });
      const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [id]);
      if (!rows.length)
        return res.json({ success: false, error: "Invalid Student ID." });
      // success
      return res.json({ success: true });
    }
    if (designation === "Faculty") {
      if (!code || !password)
        return res.json({ success: false, error: "Faculty Code and Password are required." });
      const [rows] = await pool.query("SELECT * FROM faculty WHERE code = ? AND password = ?", [code, password]);
      if (!rows.length)
        return res.json({ success: false, error: "Invalid Faculty credentials." });
      // success
      return res.json({ success: true });
    }
    if (designation === "Admin") {
      if (!id || !password)
        return res.json({ success: false, error: "Admin ID and Password are required." });
      const [rows] = await pool.query("SELECT * FROM admins WHERE id = ? AND password = ?", [id, password]);
      if (!rows.length)
        return res.json({ success: false, error: "Invalid Admin credentials." });
      // success
      return res.json({ success: true });
    }
    return res.json({ success: false, error: "Invalid role." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log("Backend running on port", port)
);
app.post('/api/login', async (req, res) => {
  const { id, code, password, designation } = req.body;
  if (!designation)
    return res.json({ success: false, error: "Designation is required." });

  try {
    if (designation === "Student") {
      if (!id) return res.json({ success: false, error: "Student ID is required." });
      const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [id]);
      if (!rows.length)
        return res.json({ success: false, error: "Invalid Student ID." });
      return res.json({ success: true });
    }
    if (designation === "Faculty") {
      if (!code || !password)
        return res.json({ success: false, error: "Faculty Code and Password are required." });
      const [rows] = await pool.query(
        "SELECT * FROM faculty WHERE code = ? AND password = ?", [code, password]);
      if (!rows.length)
        return res.json({ success: false, error: "Invalid Faculty credentials." });
      return res.json({ success: true });
    }
    if (designation === "Admin") {
      if (!id || !password)
        return res.json({ success: false, error: "Admin ID and Password are required." });
      const [rows] = await pool.query(
        "SELECT * FROM admins WHERE id = ? AND password = ?", [id, password]);
      if (!rows.length)
        return res.json({ success: false, error: "Invalid Admin credentials." });
      return res.json({ success: true });
    }
    return res.json({ success: false, error: "Invalid role." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
