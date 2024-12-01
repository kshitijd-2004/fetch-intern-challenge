const express = require('express');
const router = express.Router();
const transactions = require('../utils/transactions'); // Shared transactions array

router.get('/', (req, res) => {
    // Calculate the total balance for each payer
    const balances = {};

    // Iterate through all transactions to sum points for each payer
    transactions.forEach(transaction => {
        const { payer, points } = transaction;
        if (!balances[payer]) {
            balances[payer] = 0; // Initialize payer balance if not present
        }
        balances[payer] += points; // Add points to the payer's balance
    });

    res.status(200).json(balances); // Return the balance as JSON
});

module.exports = router;

