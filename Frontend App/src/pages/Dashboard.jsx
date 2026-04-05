import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  getAllInvoices,
  getInvoiceById,
  getInvoicesByCustomer,
  getAllCustomers,
} from "../services/api";

const Dashboard = () => {
  // ── state variables ──────────────────
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchedInvoice, setSearchedInvoice] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [loading, setLoading] = useState(true);

  // ── load all invoices and customers on page open ──
  const loadData = async () => {
    try {
      const invoicesResponse = await getAllInvoices();
      setInvoices(invoicesResponse.data);

      const customersResponse = await getAllCustomers();
      setCustomers(customersResponse.data);

      setLoading(false);
    } catch (error) {
      console.log("Error loading data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── search invoice by id ─────────────
  const handleSearch = async () => {
    if (searchId === "") {
      alert("Please enter an invoice ID");
      return;
    }

    try {
      setSearchError("");
      const response = await getInvoiceById(searchId);
      setSearchedInvoice(response.data);
    } catch (error) {
      setSearchedInvoice(null);
      setSearchError("Invoice not found");
    }
  };

  // ── filter invoices by customer ──────
  const handleCustomerFilter = async (e) => {
    const customerId = e.target.value;
    setSelectedCustomerId(customerId);

    if (customerId === "") {
      // load all invoices again
      const response = await getAllInvoices();
      setInvoices(response.data);
      return;
    }

    try {
      const response = await getInvoicesByCustomer(customerId);
      setInvoices(response.data);
    } catch (error) {
      console.log("Error filtering invoices", error);
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

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "25px",
    border: "1px solid #e0e0e0",
    marginBottom: "20px",
  };

  const sectionTitleStyle = {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "15px",
  };

  const searchRowStyle = {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  };

  const inputStyle = {
    flex: 1,
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
  };

  const searchButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#4a90e2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
  };

  const selectStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#333",
    backgroundColor: "white",
    outline: "none",
    minWidth: "200px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle = {
    textAlign: "left",
    padding: "10px",
    borderBottom: "2px solid #eee",
    fontSize: "13px",
    color: "#555",
  };

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
    color: "#333",
  };

  const errorStyle = {
    color: "#c62828",
    fontSize: "13px",
    marginTop: "8px",
  };

  const invoiceCardStyle = {
    backgroundColor: "#f9f9f9",
    borderRadius: "6px",
    padding: "15px",
    border: "1px solid #e0e0e0",
    marginTop: "10px",
  };

  return (
    <div>
      {/* sidebar */}
      <Sidebar />

      {/* main content */}
      <div style={pageStyle}>
        {/* heading */}
        <div style={headingStyle}>Dashboard</div>

        {/* section 1 - search invoice by id */}
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>Search Invoice by ID</div>

          <div style={searchRowStyle}>
            <input
              style={inputStyle}
              type="text"
              placeholder="Enter invoice ID e.g. INVC224830"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button style={searchButtonStyle} onClick={handleSearch}>
              Search
            </button>
          </div>

          {/* search error */}
          {searchError !== "" && <div style={errorStyle}>{searchError}</div>}

          {/* searched invoice result */}
          {searchedInvoice !== null && (
            <div style={invoiceCardStyle}>
              <div style={{ marginBottom: "8px" }}>
                <strong>Invoice ID:</strong> {searchedInvoice.invoice_id}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <strong>Customer:</strong> {searchedInvoice.customer_name}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <strong>Subtotal:</strong> ₹ {searchedInvoice.subtotal}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <strong>GST:</strong> ₹ {searchedInvoice.gst_amount}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <strong>Total:</strong> ₹ {searchedInvoice.total}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <strong>Date:</strong>{" "}
                {new Date(searchedInvoice.created_at).toLocaleDateString()}
              </div>

              {/* items in this invoice */}
              {searchedInvoice.items && searchedInvoice.items.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <strong>Items:</strong>
                  {searchedInvoice.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "4px 0",
                        fontSize: "13px",
                        color: "#555",
                      }}
                    >
                      {item.item_name} x {item.quantity} = ₹{" "}
                      {item.unit_price * item.quantity}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* section 2 - filter by customer and recent invoices */}
        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <div style={sectionTitleStyle}>Recent Invoices</div>

            {/* customer filter dropdown */}
            <select
              style={selectStyle}
              value={selectedCustomerId}
              onChange={handleCustomerFilter}
            >
              <option value="">All Customers</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          {/* loading */}
          {loading && <div>Loading invoices...</div>}

          {/* invoices table */}
          {loading === false && invoices.length > 0 && (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Invoice ID</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Subtotal</th>
                  <th style={thStyle}>GST</th>
                  <th style={thStyle}>Total</th>
                  <th style={thStyle}>Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td style={tdStyle}>{invoice.invoice_id}</td>
                    <td style={tdStyle}>{invoice.customer_name}</td>
                    <td style={tdStyle}>₹ {invoice.subtotal}</td>
                    <td style={tdStyle}>₹ {invoice.gst_amount}</td>
                    <td style={tdStyle}>₹ {invoice.total}</td>
                    <td style={tdStyle}>
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* no invoices message */}
          {loading === false && invoices.length === 0 && (
            <div style={{ color: "#888", fontSize: "14px" }}>
              No invoices found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
