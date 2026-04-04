const express = require('express');
const router = express.Router();
const pool = require('../db/db.js');

//get all items
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM items');

        res.json(result.rows);
    }catch(error){
        res.status(500).json({message: 'Something went wrong'});
    }

});

//POST create a new item
router.post('/',async(req,res)=>{
    try{
        const {name, unit_price, status} = req.body;
        const query = `INSET INTO items
                    (name, unit_price, status)
                    VALUES
                    ($1,$2,$3) RETURNING *`;

        const values = [name,unit_price, status];

        const result = await.pool(query,values);

        const newItem = result.row[0];
        res.json(newItem);
    }catch(error){
        res.status(500).json({message:'Something went wrong'});
    }
});

module.exports = router;