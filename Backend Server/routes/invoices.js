const express = require('express');
const router = express.Router();
const pool = require('../db/db.js');
const generateInvoiceId = require('../utils/generateInvoiceId.js');

//get all invoices
router.get('/',async(req,res)=>{
    try{
        //get all invoice from db 
        //and get customer name by joining customer table
        const result = await pool.query(
            `SELECT invoices.*, customers.name AS customer_name
            FROM invoices
            JOIN customers ON invoices.customer_id=customers.id
            ORDER BY invoices.created_at DESC`
        );
        //send invoice to frontend
        res.json(result.rows);
    }catch(error){
        res.status(500).json({message:'Somethign went wrong'});
    }
});

//Get invoice of specific user
//URL: GET/api/invoices/customer/3
router.get('/customer/:customerId', async(req,res)=>{
    try{
        //getting customer id from url
        const customerId = req.params.customerId;
        

        //get all invoices that belongs to this customer

        const result = await pool.query(
            `SELECT invoices.* , customers.name AS customer_name
            FROM invoices
            JOIN customers ON invoices.customer_id = customers.id
            WHERE invoices.customer_id = $1
            ORDER BY invoices.created_at DESC`,
            [customerId]
        );
        res.json(result.rows);
    }catch(error){
        res.status(500).json({message:'Something went wrong'});
    }
});

//Get invoice using invoice id
//url: GET/api/invoices/INVC123456
router.get('/:invoiceId',async(req,res)=>{
    try{
        const invoiceId = req.params.invoiceId;

        const invoiceResult = await pool.query(`
            SELECT invoices.*, customers.name AS customer_name
            FROM invoices
            JOIN customers ON invoices.customer_id = customers.id
            WHERE invoices.invoice_id =$1
            ,[invoiceId]`
        );

        if(invoiceResult.rows.length===0){
            return res.status(404).json({message:'Invoice not found'});
        }

        //find all items that belongs to the particular invoice
        const itemsResult = await pool.query(`
            SELECT invoice_items.*, items.name AS item_name
            FROM  invoice_items
            JOIN items ON invoice_items.item_id = items.id
            WHERE invoice_items.invoice_id = $1
            `,[invoiceId]
        );

        const invoice = invoiceResult.rows[0];
        invoice.items = itemsResult.rows;
        res.json(invoice);
        
    }catch(error){
        res.status(500).json({message:'something went wrong'});
    }
});

//POST create a new invoice
router.post('/',async(req,res)=>{
    try{
        //get items and customer id from frontend
        const customerId = req.body.customer_id;
        const items = req.body.items;
        
        //step1
        //get customer details from database to know if gstin is null or not
        const customerResult = await pool.query(`SELECT * FROM customers WHERE id = $1`,[customerId]);

        const customer = customerResult.rows[0];
        
        //step2
        //calculate subtotal by adding all items
        let subtotal = 0;
        for(const item of items){
            const lineTotal = item.quantity * item.unit_price;
            subtotal += lineTotal;
        }
        //Step3 : check if customer is gst registered 
        let gst_amount = 0;
        if(customer.gstin === null){
            gst_amount = subtotal * 0.18;
        }

        //step4: calculate final total
        const total = subtotal + gst_amount;

        //step5: generate unique invoice id 
        const invoice_id = await generateInvoiceId();

        //step6: save invoice to invoices table
        const invoiceResult = await pool.query(
            `INSER INTO invoices
            (invoice_id , customer_id, subtotal , gst_amount, total )
            VALUES
            ($1, $2, $3, $4, $5) RETURNING *`,
            [invoice_id, customerId, subtotal, gst_amount, total]
        );

        const newInvoice = invoiceResult.rows[0];

        //step7: save each item to invoice item table
        for(const item of items){
            await pool.query(
                `INSERT INTO invoice_items
                (invoice_id, item_id, quantity, unit_price)
                VALUES($1, $2, $3, $4)
                `,[invoice_id, item.id, item.quantity, item.unit_price]
            )
        }

        res.json(newInvoice);
    }catch(error){
        res.status(500).json({message:'Something went wrong'});
    }
});

module.exports = router;
    