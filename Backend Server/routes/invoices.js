const express = require('express');
const router = express.Router();
const pool = require('../db/db.js');
const generateInvoiceId = require('../utils/generateInvoiceId.js');

//get all invoices
router.get('/',async(req,res)=>{
    try{
        //get all invoice from db 
        //also get customer name by joining customer table
        const result = await pool.query(
            `SELECT inovices.*, customers.name AS customer_name
            FROM invoices
            JOIN customers ON invoices.customer_id=customers.id
            ORDER BY invoices.created_at DESC`
        );
        //send invoice to frontend
        res.json(result.rows;
    }catch(error){}
})
    