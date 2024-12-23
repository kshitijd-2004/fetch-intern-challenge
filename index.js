const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8000;

app.use(bodyParser.json());

const addRoute = require('./fetch-intern-challenge/node_modules/routes/add'); 
const spendRoute = require('./fetch-intern-challenge/node_modules/routes/spend');
const balanceRoute = require('./fetch-intern-challenge/node_modules/routes/balance');

app.use('/add', addRoute); 
app.use('/spend', spendRoute);
app.use('/balance', balanceRoute);
app.listen(8000, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
