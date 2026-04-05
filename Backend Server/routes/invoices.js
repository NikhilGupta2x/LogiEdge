const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const generateInvoiceId = require("../utils/generateInvoiceId");

// GET all recent invoices
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT invoices.*, customers.name AS customer_name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.log("Invoices GET error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// GET invoices by customer
router.get("/customer/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const result = await pool.query(
      `
      SELECT invoices.*, customers.name AS customer_name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.customer_id = $1
      ORDER BY invoices.created_at DESC
    `,
      [customerId],
    );

    res.json(result.rows);
  } catch (error) {
    console.log("Invoices by customer error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// GET one invoice by invoice id
router.get("/:invoiceId", async (req, res) => {
  try {
    const invoiceId = req.params.invoiceId;

    const invoiceResult = await pool.query(
      `
      SELECT invoices.*, customers.name AS customer_name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.invoice_id = $1
    `,
      [invoiceId],
    );

    if (invoiceResult.rowCount === 0) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const itemsResult = await pool.query(
      `
      SELECT invoice_items.*, items.name AS item_name
      FROM invoice_items
      JOIN items ON invoice_items.item_id = items.id
      WHERE invoice_items.invoice_id = $1
    `,
      [invoiceId],
    );

    const invoice = invoiceResult.rows[0];
    invoice.items = itemsResult.rows;

    res.json(invoice);
  } catch (error) {
    console.log("Invoice by ID error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// POST create new invoice
router.post("/", async (req, res) => {
  try {
    const customer_id = req.body.customer_id;
    const items = req.body.items;

    // Step 1 - get customer
    const customerResult = await pool.query(
      "SELECT * FROM customers WHERE id = $1",
      [customer_id],
    );
    const customer = customerResult.rows[0];

    // Step 2 - calculate subtotal
    let subtotal = 0;
    for (const item of items) {
      const lineTotal = item.quantity * item.unit_price;
      subtotal = subtotal + lineTotal;
    }

    // Step 3 - calculate gst
    let gst_amount = 0;
    if (customer.gstin === null || customer.gstin === "") {
      gst_amount = subtotal * 0.18;
    }

    // Step 4 - calculate total
    const total = subtotal + gst_amount;

    // Step 5 - generate invoice id
    const invoice_id = await generateInvoiceId();

    // Step 6 - save invoice
    const invoiceResult = await pool.query(
      `
      INSERT INTO invoices
        (invoice_id, customer_id, subtotal, gst_amount, total)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *
    `,
      [invoice_id, customer_id, subtotal, gst_amount, total],
    );

    const newInvoice = invoiceResult.rows[0];

    // Step 7 - save invoice items
    for (const item of items) {
      await pool.query(
        `
        INSERT INTO invoice_items
          (invoice_id, item_id, quantity, unit_price)
        VALUES
          ($1, $2, $3, $4)
      `,
        [invoice_id, item.item_id, item.quantity, item.unit_price],
      );
    }

    // Step 8 - send response
    res.json(newInvoice);
  } catch (error) {
    console.log("Invoice POST error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
