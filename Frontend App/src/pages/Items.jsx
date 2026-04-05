import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getAllItems } from "../services/api";

const Items = () => {
  const navigate = useNavigate();

  // ── state variables ──────────────────
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── load items when page opens ───────
  const loadItems = async () => {
    try {
      const response = await getAllItems();
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error loading items", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // ── styles ───────────────────────────
  const pageStyle = {
    marginLeft: "200px",
    padding: "30px",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  };

  const topBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  };

  const headingStyle = {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#333",
  };

  const addButtonStyle = {
    backgroundColor: "#4a90e2",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    border: "1px solid #e0e0e0",
  };

  const cardNameStyle = {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "6px",
  };

  const cardPriceStyle = {
    fontSize: "13px",
    color: "#555",
    marginBottom: "10px",
  };

  const activeBadgeStyle = {
    backgroundColor: "#e6f4ea",
    color: "#2e7d32",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    display: "inline-block",
  };

  const inactiveBadgeStyle = {
    backgroundColor: "#fce8e6",
    color: "#c62828",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    display: "inline-block",
  };

  return (
    <div>
      {/* sidebar */}
      <Sidebar />

      {/* main content */}
      <div style={pageStyle}>
        {/* top bar */}
        <div style={topBarStyle}>
          <div style={headingStyle}>ITEMS</div>
          <button
            style={addButtonStyle}
            onClick={() => navigate("/master/items/add")}
          >
            + ADD
          </button>
        </div>

        {/* loading message */}
        {loading && <div>Loading items...</div>}

        {/* items grid */}
        {loading === false && (
          <div style={gridStyle}>
            {items.map((item) => (
              <div key={item.id} style={cardStyle}>
                {/* item name */}
                <div style={cardNameStyle}>{item.name}</div>

                {/* item price */}
                <div style={cardPriceStyle}>₹ {item.unit_price}</div>

                {/* active or inactive badge */}
                {item.status === "Active" ? (
                  <span style={activeBadgeStyle}>Active</span>
                ) : (
                  <span style={inactiveBadgeStyle}>In Active</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* no items message */}
        {loading === false && items.length === 0 && (
          <div>No items found. Click ADD to create one.</div>
        )}
      </div>
    </div>
  );
};

export default Items;
