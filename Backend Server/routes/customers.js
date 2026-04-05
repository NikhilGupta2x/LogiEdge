const express = require("express");
const router = express.Router();
const pool = require("../db/db");

// GET all customers
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers");
    res.json(result.rows);
  } catch (error) {
    console.log("Customers GET error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// POST create new customer
router.post("/", async (req, res) => {
  try {
    const name = req.body.name;
    const address = req.body.address;
    const pan_number = req.body.pan_number;
    const gstin = req.body.gstin;
    const status = req.body.status;

    const query = `
      INSERT INTO customers (name, address, pan_number, gstin, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [name, address, pan_number, gstin, status];
    const result = await pool.query(query, values);
    const newCustomer = result.rows[0];

    res.json(newCustomer);
  } catch (error) {
    console.log("Customers POST error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
