import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  // get current page url to highlight active link
  const currentPage = window.location.pathname;

  // ── styles ───────────────────────────
  const sidebarStyle = {
    width: "200px",
    minHeight: "100vh",
    backgroundColor: "#1a1a2e",
    padding: "20px 0",
    position: "fixed",
    left: 0,
    top: 0,
  };

  const logoStyle = {
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    padding: "0 20px",
    marginBottom: "30px",
  };

  const normalLinkStyle = {
    padding: "12px 20px",
    color: "#aaaaaa",
    cursor: "pointer",
    fontSize: "14px",
  };

  const activeLinkStyle = {
    padding: "12px 20px",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    backgroundColor: "#2a2a4a",
    borderLeft: "3px solid #4a90e2",
  };

  return (
    <div style={sidebarStyle}>
      {/* logo */}
      <div style={logoStyle}>LogiEdge</div>

      {/* dashboard link */}
      <div
        style={currentPage === "/" ? activeLinkStyle : normalLinkStyle}
        onClick={() => navigate("/")}
      >
        Dashboard
      </div>

      {/* master link */}
      <div
        style={
          currentPage.includes("/master") ? activeLinkStyle : normalLinkStyle
        }
        onClick={() => navigate("/master")}
      >
        Master
      </div>

      {/* billing link */}
      <div
        style={
          currentPage.includes("/billing") ? activeLinkStyle : normalLinkStyle
        }
        onClick={() => navigate("/billing")}
      >
        Billing
      </div>
    </div>
  );
};

export default Sidebar;
