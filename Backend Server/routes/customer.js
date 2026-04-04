const express = require('express');
const router = express.Router();
const pool = require('../db/db.js');

//get all customers
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM invoices');
        res.json(result.rows);
    }catch(error){
        res.status(500).json({message: 'Something went wrong'});
    }
});

router.post('/', async (req, res) => {
    try{
        const {name, address, pan_number, gstin , status }= req.body;
        const result = await.pool.query('INSERT INTO customers(name, address, pan_number, gstin, status) VALUES($1, $2, $3, $4, $5) RETURNING *', [name, address, pan_number, gstin, status]);
    
        res.json(result.rows[0]);
    }catch(error){
        res.status(500).json({message: 'Something went wrong'});
    }
});

module.exports = router;
