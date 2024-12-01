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

    let pointsToSpend = points;
    const spendLog = [];

    for (const transaction of transactions) {
        if (pointsToSpend <= 0) break;

        // Spendable points from this transaction
        const spendablePoints = Math.min(transaction.points, pointsToSpend);

        // Add this transaction's impact to the log
        if (spendablePoints > 0) {
            spendLog.push({ payer: transaction.payer, points: -spendablePoints });
            transaction.points -= spendablePoints; // Deduct points
            pointsToSpend -= spendablePoints;
        } else if (transaction.points < 0) {
            // If transaction is negative, adjust the remaining points to spend
            pointsToSpend += Math.abs(transaction.points);
			transaction.points -= spendablePoints;
        }
    }

    // If we couldn't spend the full points, throw an error
    if (pointsToSpend > 0) {
        return res.status(400).send('Unable to spend all points.');
    }

    res.status(200).json(spendLog);
});

module.exports = router;

