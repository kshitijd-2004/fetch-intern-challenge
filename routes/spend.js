const express = require('express');
const router = express.Router();
const transactions = require('../utils/transactions'); // Shared transactions array

router.post('/', (req, res) => {
    const { points } = req.body;

    // Validate input
    if (typeof points !== 'number' || points <= 0) {
        return res.status(400).send('Invalid request: Points must be a positive number.');
    }

    // Ensure there are transactions to process
    if (!transactions || transactions.length === 0) {
        return res.status(400).send('No transactions available to spend points.');
    }

    // Calculate total available points
    const totalPoints = transactions.reduce((sum, t) => sum + t.points, 0);
    if (points > totalPoints) {
        return res.status(400).send('Insufficient points.');
    }

    // Sort transactions by timestamp (oldest first)
    transactions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    let pointsToSpend = points; // Remaining points to spend
    const spendLog = []; // Log of points spent, grouped by payer
    const payerBalances = {}; // Track the current balance of each payer

    // Initialize payerBalances with existing transactions
    transactions.forEach(transaction => {
        const { payer, points } = transaction;
        if (!payerBalances[payer]) {
            payerBalances[payer] = 0; // Initialize balance for the payer
        }
        payerBalances[payer] += points; // Update payer's balance
    });

    for (const transaction of transactions) {
        if (pointsToSpend <= 0) break; // Stop if all points are spent

        const { payer, points: transactionPoints } = transaction;

        // Determine how many points can be spent from this transaction
        const spendablePoints = Math.min(transactionPoints, pointsToSpend, payerBalances[payer]);

        if (spendablePoints > 0) {
            // Deduct points and log the spend
            addToSpendLog(payer, -spendablePoints)
            transaction.points -= spendablePoints;
            payerBalances[payer] -= spendablePoints; // Update payer balance
            pointsToSpend -= spendablePoints;
        } else if (transaction.points < 0) {
            // If transaction is negative, adjust the remaining points to spend
            pointsToSpend += Math.abs(transaction.points);
			transaction.points -= spendablePoints;
            addToSpendLog(payer, -spendablePoints)
        }

    }

    // Final check to ensure no payer went negative
    const negativeBalance = Object.values(payerBalances).some(balance => balance < 0);
    if (negativeBalance) {
        return res.status(500).send('Error: A payer balance went negative, which is not allowed.');
    }

    // If we couldn't spend the full points, throw an error
    if (pointsToSpend > 0) {
        return res.status(400).send('Unable to spend all points.');
    }

    res.status(200).json(spendLog);

    function addToSpendLog(payer, points) {
        // Check if the payer already exists in the spendLog
        const existingEntry = spendLog.find(entry => entry.payer === payer);
    
        if (existingEntry) {
            // If the payer exists, update the points
            existingEntry.points += points;
        } else {
            // If the payer does not exist, add a new entry
            spendLog.push({ payer, points });
        }
    }
});



module.exports = router;
