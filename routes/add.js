const express = require('express');
const router = express.Router();
const transactions = require('../utils/transactions'); // Shared transactions array

router.post('/', (req, res) => {
    const { payer, points, timestamp } = req.body;

    // Validate input
    if (!payer || typeof points !== 'number' || !timestamp) {
        return res.status(400).send('Invalid request: Missing or incorrect fields');
    }

    // Include the new transaction temporarily to validate the balance
    const tempTransactions = [...transactions, { payer, points, timestamp }];

    // Filter and sort transactions for the payer by timestamp (oldest first)
    const payerTransactions = tempTransactions
        .filter(transaction => transaction.payer === payer)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Validate that the balance never goes negative during the payer's transaction history
    let runningBalance = 0;
    for (const transaction of payerTransactions) {
        runningBalance += transaction.points;
        if (runningBalance < 0) {
            return res.status(400).send(
                `Transaction denied: Adding this transaction would cause ${payer}'s balance to go negative at some point in time.`
            );
        }
    }

    // Add the new transaction if validation passes
    transactions.push({ payer, points, timestamp });
    res.status(200).send('Points added successfully');
});

module.exports = router;
