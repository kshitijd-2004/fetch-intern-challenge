const express = require('express');
const router = express.Router();
const transactions = require('../utils/transactions'); // Shared transactions array

router.post('/', (req, res) => {
    const { payer, points, timestamp } = req.body;

    // Validate input
    if (!payer || typeof points !== 'number' || !timestamp) {
        return res.status(400).send('Invalid request: Missing or incorrect fields');
    }

    // Calculate the payer's current balance from existing transactions
    const payerBalance = transactions
        .filter(transaction => transaction.payer === payer)
        .reduce((sum, transaction) => sum + transaction.points, 0);

    // Check if adding this transaction would make the payer's balance negative
    if (payerBalance + points < 0) {
        return res.status(400).send(`Transaction denied: Adding this transaction would cause ${payer}'s balance to go negative.`);
    }

    // Add the new transaction if validation passes
    transactions.push({ payer, points, timestamp });
    console.log('Current Transactions:', transactions); // Debugging log

    res.status(200).send('Points added successfully');
});

module.exports = router;
