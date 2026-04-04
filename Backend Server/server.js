const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express(); //server created

app.use(cors());//allowing frontend to talk with backend
app.use(express.json());//json data ->js object

app.use('/api/customers',require('./routes/customers.js'));
app.use('/api/items',require('./routes/items.js'));
app.use('/api/invoices',require('./routes/invoices.js'));

const PORT =  process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
}