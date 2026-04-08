import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{
      width: "240px",
      height: "100vh",
      background: "#020617",
      padding: "25px",
      borderRight: "1px solid #1e293b"
    }}>
      <h2 style={{ color: "#6366f1" }}>TaskFlow</h2>

      <nav style={{ marginTop: "40px" }}>
        <Link to="/" style={linkStyle}>Dashboard</Link>
      </nav>
    </div>
  );
}

const linkStyle = {
  display: "block",
  color: "#cbd5f5",
  marginBottom: "15px",
  textDecoration: "none",
};