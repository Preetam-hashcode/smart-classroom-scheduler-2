import { useNavigate, useLocation } from "react-router-dom";

export default function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || "Admin";

  function logout() {
    navigate("/");
  }

  return (
    <div
      style={{
        padding: '3rem',
        textAlign: 'center',
        position: 'relative',
        minHeight: '100vh',
        background: '#292544', // (keep this or your dark bg)
        color: '#fff'          // <-- WHITE TEXT!
      }}
    >
      <button
        onClick={logout}
        style={{
          position: "absolute",
          top: 20,
          right: 32,
          padding: "8px 22px",
          background: "#E84949",
          color: "#fff",
          fontWeight: "600",
          border: "none",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(255, 255, 255, 1)",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
      <h2 style={{ color: "#fff", fontSize: "2.2rem", fontWeight: "bold" }}>
        Welcome, {username}!
      </h2>
      <p style={{ color: "#fff", fontSize: "1.17rem", marginTop: "1.7rem" }}>
        This is the admin dashboard.
      </p>
    </div>
  );
}
