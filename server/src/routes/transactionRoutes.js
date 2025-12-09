import express from "express";
import multer from "multer";
import csv from "csv-parser";
import { Readable } from "stream";
import { auth } from "../middleware/auth.js";
import { Transaction } from "../models/Transaction.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Category guesser
const guessCategory = (description = "") => {
    const desc = description.toLowerCase();
    if (/uber|ola|bus|train|cab|metro|fuel/.test(desc)) return "transport";
    if (/zomato|swiggy|restaurant|cafe|food|pizza|burger/.test(desc)) return "food";
    if (/rent|landlord|room/.test(desc)) return "rent";
    if (/netflix|spotify|prime|subscription|subscr/.test(desc)) return "subscriptions";
    if (/amazon|flipkart|myntra|shopping|store/.test(desc)) return "shopping";
    return "others";
};

// Add single transaction
router.post("/", auth, async (req, res) => {
    try {
        const { date, description, amount, category } = req.body;
        if (!date || !description || amount == null) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const txn = await Transaction.create({
            user: req.user._id,
            date,
            description,
            amount,
            category: category || guessCategory(description),
        });

        res.status(201).json(txn);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Fetch transactions
router.get("/", auth, async (req, res) => {
    try {
        const { startDate, endDate, category } = req.query;

        const query = { user: req.user._id };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        if (category && category !== "all") query.category = category;

        const transactions = await Transaction.find(query).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// CSV UPLOAD 
router.post("/upload", auth, upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        const csvData = [];
        const stream = Readable.from(req.file.buffer);

        stream
            .pipe(csv())
            .on("data", (row) => {
                csvData.push(row);
            })
            .on("end", async () => {
                try {
                    const docs = csvData.map((r) => ({
                        user: req.user._id,
                        date: new Date(r.date),
                        description: r.description,
                        amount: parseFloat(r.amount),
                        category: guessCategory(r.description),
                    }));

                    const inserted = await Transaction.insertMany(docs);
                    return res.json({
                        insertedCount: inserted.length,
                        message: "CSV uploaded successfully",
                    });
                } catch (err) {
                    console.error("Insert error:", err);
                    return res.status(500).json({ message: "DB insert error" });
                }
            })
            .on("error", (err) => {
                console.error("CSV parse error:", err);
                return res.status(500).json({ message: "CSV parse error" });
            });
    } catch (err) {
        console.error("Upload handler error:", err);
        return res.status(500).json({ message: "Upload failed" });
    }
});

export default router;
