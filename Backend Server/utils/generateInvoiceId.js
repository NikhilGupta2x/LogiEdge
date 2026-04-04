const pool = require('../db/db.js');

async function generateInvoiceId(){
    const digits = Math.floor(Math.random()* 900000) + 100000;

    const newId = `INVC${digits}`;

    const result = await pool.query(
      `SELECT id FROM invoices WHERE invoice_id = '${newId}'`,
    );

    if(result.rows.length === 0){
        return newId;
    }else{
        return generateInvoiceId();
    }
}

module.exports = generateInvoiceId;