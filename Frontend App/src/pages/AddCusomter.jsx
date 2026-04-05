import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { createCustomer } from "../services/api";

const AddCustomer = () => {
  const navigate = useNavigate();

  // ── form state variables ─────────────
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [gstin, setGstin] = useState("");
  const [status, setStatus] = useState("Active");

  // ── handle form submit ───────────────
  const handleSubmit = async () => {
    // check if name is filled
    if (name === "") {
      alert("Please enter customer name");
      return;
    }

    try {
      // create customer data object
      const customerData = {
        name: name,
        address: address,
        pan_number: panNumber,
        gstin: gstin === "" ? null : gstin,
        status: status,
      };

      // call api to create customer
      await createCustomer(customerData);

      // show success message
      alert("Customer created successfully");

      // go back to customers page
      navigate("/master/customers");
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
        <div style={headingStyle}>Add New Customer</div>

        {/* form card */}
        <div style={formCardStyle}>
          {/* row 1 - name and address */}
          <div style={rowStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Customer Name</label>
              <input
                style={inputStyle}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Customer Address</label>
              <input
                style={inputStyle}
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
              />
            </div>
          </div>

          {/* row 2 - pan and gstin */}
          <div style={rowStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Customer Pan Card Number</label>
              <input
                style={inputStyle}
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                placeholder="Enter PAN number"
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Customer GST Number</label>
              <input
                style={inputStyle}
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                placeholder="Enter GST number"
              />
            </div>
          </div>

          {/* row 3 - status */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Customer Status</label>
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
              onClick={() => navigate("/master/customers")}
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

export default AddCustomer;
