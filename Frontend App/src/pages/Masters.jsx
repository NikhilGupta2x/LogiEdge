import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Master = () => {
  const navigate = useNavigate();

  // ── styles ───────────────────────────
  const pageStyle = {
    marginLeft: "200px",
    padding: "30px",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  };

  const headingStyle = {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#333",
  };

  const cardsContainerStyle = {
    display: "flex",
    gap: "20px",
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "25px",
    width: "200px",
    cursor: "pointer",
    border: "1px solid #e0e0e0",
  };

  const cardTitleStyle = {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#333",
  };

  const cardSubtitleStyle = {
    fontSize: "12px",
    color: "#888",
  };

  return (
    <div>
      {/* sidebar */}
      <Sidebar />

      {/* main content */}
      <div style={pageStyle}>
        {/* heading */}
        <div style={headingStyle}>Master</div>

        {/* two cards side by side */}
        <div style={cardsContainerStyle}>
          {/* customer card */}
          <div style={cardStyle} onClick={() => navigate("/master/customers")}>
            <div style={cardTitleStyle}>Customer</div>
            <div style={cardSubtitleStyle}>Read or Create customer data</div>
          </div>

          {/* items card */}
          <div style={cardStyle} onClick={() => navigate("/master/items")}>
            <div style={cardTitleStyle}>Items</div>
            <div style={cardSubtitleStyle}>Read or Create items data</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Master;
