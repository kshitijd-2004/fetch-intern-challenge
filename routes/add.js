const express = require('express');
const router = express.Router();
const transactions = require('utils/transactions'); // Shared transactions array

router.post('/', (req, res) => {
    const { payer, points, timestamp } = req.body;

    // Validate input
    if (!payer || typeof points !== 'number' || !timestamp) {
        return res.status(400).send('Invalid request: Missing or incorrect fields');
    }

    // Add the new transaction as a separate entry
    transactions.push({ payer, points, timestamp });
    console.log('Current Transactions:', transactions); // Debugging log

    res.status(200).send('Points added successfully');
});

module.exports = router;

