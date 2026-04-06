import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { createItem } from "../services/api";

const AddItem = () => {
  const navigate = useNavigate();

  // ── form state variables ─────────────
  const [name, setName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [status, setStatus] = useState("Active");

  // ── handle form submit ───────────────
  const handleSubmit = async () => {
    // check if name is filled
    if (name === "") {
      alert("Please enter item name");
      return;
    }

    // check if price is filled
    if (unitPrice === "") {
      alert("Please enter item price");
      return;
    }

    try {
      // create item data object
      const itemData = {
        name: name,
        unit_price: unitPrice,
        status: status,
      };

      // call api to create item
      await createItem(itemData);

      // show success message
      alert("Item created successfully");

      // go back to items page
      navigate("/master/items");
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

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
    color: "#333",
    marginBottom: "30px",
  };

  const formCardStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "30px",
    maxWidth: "600px",
    border: "1px solid #e0e0e0",
  };

  const rowStyle = {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  };

  const fieldStyle = {
    flex: 1,
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    color: "#555",
    marginBottom: "6px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
  };

  const selectStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    color: "#333",
    backgroundColor: "white",
  };

  const buttonsStyle = {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  };

  const cancelButtonStyle = {
    padding: "10px 24px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "white",
    fontSize: "14px",
    cursor: "pointer",
    color: "#333",
  };

  const createButtonStyle = {
    padding: "10px 24px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#4a90e2",
    color: "white",
    fontSize: "14px",
    cursor: "pointer",
  };

  return (
    <div>
      {/* sidebar */}
      <Sidebar />

      {/* main content */}
      <div style={pageStyle}>
        {/* heading */}
        <div style={headingStyle}>Add New Item</div>

        {/* form card */}
        <div style={formCardStyle}>
          {/* row 1 - name and price */}
          <div style={rowStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Item Name</label>
              <input
                style={inputStyle}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter item name"
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Selling Price</label>
              <input
                style={inputStyle}
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="Enter price"
              />
            </div>
          </div>

          {/* status dropdown */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Item Status</label>
            <select
              style={selectStyle}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* buttons */}
          <div style={buttonsStyle}>
            <button
              style={cancelButtonStyle}
              onClick={() => navigate("/master/items")}
            >
              Cancel
            </button>
            <button style={createButtonStyle} onClick={handleSubmit}>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
