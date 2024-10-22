const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./expense-tracker.db');

router.post('/', (req, res) => {
    const { type, category, amount, date, description } = req.body;
    db.run(INSERT INTO transactions (type, category, amount, date, description) VALUES (?, ?, ?, ?, ?), 
        [type, category, amount, date, description], 
        function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID });
        }
    );
});

router.get('/', (req, res) => {
    db.all(SELECT * FROM transactions, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

router.get('/:id', (req, res) => {
    db.get(SELECT * FROM transactions WHERE id = ?, [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.json(row);
    });
});

router.put('/:id', (req, res) => {
    const { type, category, amount, date, description } = req.body;
    db.run(UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?,
        [type, category, amount, date, description, req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: "Transaction not found" });
            }
            res.json({ message: "Transaction updated successfully" });
        }
    );
});

router.delete('/:id', (req, res) => {
    db.run(DELETE FROM transactions WHERE id = ?, [req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.json({ message: "Transaction deleted" });
    });
});

router.get('/summary', (req, res) => {
    db.get(`SELECT 
        (SELECT IFNULL(SUM(amount), 0) FROM transactions WHERE type = 'income') AS totalIncome,
        (SELECT IFNULL(SUM(amount), 0) FROM transactions WHERE type = 'expense') AS totalExpenses`, 
        [], 
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const balance = row.totalIncome - row.totalExpenses;
            res.json({ totalIncome: row.totalIncome, totalExpenses: row.totalExpenses, balance });
        }
    );
});

module.exports = router;
