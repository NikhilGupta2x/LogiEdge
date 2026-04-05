import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { getAllCustomers, getAllItems, createInvoice } from "../services/api";

const Billing = () => {
  // ── state variables ──────────────────
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);

  // ── load customers and items on page open ──
  const loadData = async () => {
    try {
      const customersResponse = await getAllCustomers();
      setCustomers(customersResponse.data);

      const itemsResponse = await getAllItems();
      setItems(itemsResponse.data);
    } catch (error) {
      console.log("Error loading data", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── handle customer selection ────────
  const handleCustomerChange = (e) => {
    const customerId = e.target.value;

    if (customerId === "") {
      setSelectedCustomer(null);
      return;
    }

    // find the full customer object
    const customer = customers.find((c) => c.id === parseInt(customerId));
    setSelectedCustomer(customer);

    // clear cart when customer changes
    setCart([]);
  };

  // ── add item to cart ─────────────────
  const handleAddItem = () => {
    if (selectedItemId === "") {
      alert("Please select an item");
      return;
    }

    if (quantity <= 0) {
      alert("Quantity must be at least 1");
      return;
    }

    // find the full item object
    const item = items.find((i) => i.id === parseInt(selectedItemId));

    // check if item already in cart
    const itemAlreadyInCart = cart.find((c) => c.item_id === item.id);

    if (itemAlreadyInCart) {
      alert("Item already added. Remove it first to change quantity.");
      return;
    }

    // create cart item
    const cartItem = {
      item_id: item.id,
      item_name: item.name,
      unit_price: parseFloat(item.unit_price),
      quantity: parseInt(quantity),
      line_total: parseFloat(item.unit_price) * parseInt(quantity),
    };

    // add to cart
    setCart([...cart, cartItem]);

    // reset selection
    setSelectedItemId("");
    setQuantity(1);
  };

  // ── remove item from cart ────────────
  const handleRemoveItem = (itemId) => {
    const updatedCart = cart.filter((c) => c.item_id !== itemId);
    setCart(updatedCart);
  };

  // ── calculate subtotal ───────────────
  const calculateSubtotal = () => {
    let subtotal = 0;
    for (const item of cart) {
      subtotal = subtotal + item.line_total;
    }
    return subtotal;
  };

  // ── calculate gst ────────────────────
  const calculateGst = () => {
    if (selectedCustomer === null) {
      return 0;
    }

    // if customer has gstin they are gst registered - no gst
    if (selectedCustomer.gstin !== null && selectedCustomer.gstin !== "") {
      return 0;
    }

    // not gst registered - apply 18%
    return calculateSubtotal() * 0.18;
  };

  // ── calculate total ──────────────────
  const calculateTotal = () => {
    return calculateSubtotal() + calculateGst();
  };

  // ── generate invoice ─────────────────
  const handleGenerateInvoice = async () => {
    if (selectedCustomer === null) {
      alert("Please select a customer");
      return;
    }

    if (cart.length === 0) {
      alert("Please add at least one item");
      return;
    }

    try {
      // prepare invoice data
      const invoiceData = {
        customer_id: selectedCustomer.id,
        items: cart,
      };

      // call api to create invoice
      const response = await createInvoice(invoiceData);

      // show success with invoice id
      alert(
        "Invoice generated successfully! Invoice ID: " +
          response.data.invoice_id,
      );

      // reset everything
      setSelectedCustomer(null);
      setCart([]);
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

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "25px",
    border: "1px solid #e0e0e0",
    marginBottom: "20px",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    color: "#555",
    marginBottom: "6px",
  };

  const selectStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    backgroundColor: "white",
    outline: "none",
    color:'#333',
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
  };

  const rowStyle = {
    display: "flex",
    gap: "20px",
    alignItems: "flex-end",
  };

  const fieldStyle = {
    flex: 1,
  };

  const addButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#4a90e2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
    whiteSpace: "nowrap",
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
  };

  const removeButtonStyle = {
    padding: "4px 10px",
    backgroundColor: "#fce8e6",
    color: "#c62828",
    border: "none",
    borderRadius: "4px",
    fontSize: "12px",
    cursor: "pointer",
  };

  const summaryRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    fontSize: "14px",
    color: "#333",
  };

  const totalRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    borderTop: "2px solid #eee",
    marginTop: "8px",
  };

  const generateButtonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4a90e2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
  };

  const gstInfoStyle = {
    fontSize: "12px",
    color: "#888",
    marginTop: "6px",
  };

  return (
    <div>
      {/* sidebar */}
      <Sidebar />

      {/* main content */}
      <div style={pageStyle}>
        {/* heading */}
        <div style={headingStyle}>Billing</div>

        {/* step 1 - select customer */}
        <div style={cardStyle}>
          <label style={labelStyle}>Select Customer</label>
          <select
            style={selectStyle}
            value={selectedCustomer ? selectedCustomer.id : ""}
            onChange={handleCustomerChange}
          >
            <option value="">-- Select a customer --</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>

          {/* show gst info when customer is selected */}
          {selectedCustomer && (
            <div style={gstInfoStyle}>
              {selectedCustomer.gstin !== null && selectedCustomer.gstin !== ""
                ? "GST Registered - No GST will be applied"
                : "Not GST Registered - 18% GST will be applied"}
            </div>
          )}
        </div>

        {/* step 2 - add items */}
        {selectedCustomer && (
          <div style={cardStyle}>
            <div style={rowStyle}>
              {/* item dropdown */}
              <div style={fieldStyle}>
                <label style={labelStyle}>Select Item</label>
                <select
                  style={selectStyle}
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                >
                  <option value="">-- Select an item --</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} - ₹{item.unit_price}
                    </option>
                  ))}
                </select>
              </div>

              {/* quantity input */}
              <div style={{ width: "120px" }}>
                <label style={labelStyle}>Quantity</label>
                <input
                  style={inputStyle}
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              {/* add button */}
              <button style={addButtonStyle} onClick={handleAddItem}>
                Add Item
              </button>
            </div>

            {/* cart table */}
            {cart.length > 0 && (
              <table style={{ ...tableStyle, marginTop: "20px" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Item</th>
                    <th style={thStyle}>Price</th>
                    <th style={thStyle}>Qty</th>
                    <th style={thStyle}>Total</th>
                    <th style={thStyle}></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((cartItem) => (
                    <tr key={cartItem.item_id}>
                      <td style={tdStyle}>{cartItem.item_name}</td>
                      <td style={tdStyle}>₹ {cartItem.unit_price}</td>
                      <td style={tdStyle}>{cartItem.quantity}</td>
                      <td style={tdStyle}>₹ {cartItem.line_total}</td>
                      <td style={tdStyle}>
                        <button
                          style={removeButtonStyle}
                          onClick={() => handleRemoveItem(cartItem.item_id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* invoice summary */}
            {cart.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <div style={summaryRowStyle}>
                  <span>Subtotal</span>
                  <span>₹ {calculateSubtotal().toFixed(2)}</span>
                </div>

                <div style={summaryRowStyle}>
                  <span>GST (18%)</span>
                  <span>₹ {calculateGst().toFixed(2)}</span>
                </div>

                <div style={totalRowStyle}>
                  <span>Total</span>
                  <span>₹ {calculateTotal().toFixed(2)}</span>
                </div>

                <button
                  style={generateButtonStyle}
                  onClick={handleGenerateInvoice}
                >
                  Generate Invoice
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
