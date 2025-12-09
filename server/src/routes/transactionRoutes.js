import express from "express";
import multer from "multer";
import csv from "csv-parser";
import { Readable } from "stream";
import { auth } from "../middleware/auth.js";
import { Transaction } from "../models/Transaction.js";
import { checkDuplicate } from "../utils/checkDuplicate.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const guessCategory = (description = "") => {
    const desc = description.toLowerCase();
    if (/uber|ola|bus|train|cab|metro|fuel/.test(desc)) return "transport";
    if (/zomato|swiggy|restaurant|cafe|food|pizza|burger/.test(desc)) return "food";
    if (/rent|landlord|room/.test(desc)) return "rent";
    if (/netflix|spotify|prime|subscription|subscr/.test(desc)) return "subscriptions";
    if (/amazon|flipkart|myntra|shopping|store/.test(desc)) return "shopping";
    return "others";
};

// SINGLE TRANSACTION
router.post("/", auth, async (req, res) => {
    try {
        const { date, description, amount, category, forceRepeat } = req.body;

        if (!date || !description || amount == null) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const duplicate = await checkDuplicate(
            Transaction,
            req.user._id,
            new Date(date),
            description,
            Number(amount)
        );

        if (duplicate && !forceRepeat) {
            return res.status(409).json({
                message: "Duplicate transaction detected",
                duplicate
            });
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

// CSV UPLOAD
router.post("/upload", auth, upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const skip = req.query.skip === "true";
    const force = req.query.force === "true";

    try {
        const csvData = [];
        const stream = Readable.from(req.file.buffer);

        stream
            .pipe(csv())
            .on("data", (row) => csvData.push(row))
            .on("end", async () => {
                const duplicates = [];
                const valid = [];

                for (const r of csvData) {
                    const date = new Date(r.date);
                    const description = r.description;
                    const amount = parseFloat(r.amount);

                    const duplicate = await checkDuplicate(
                        Transaction,
                        req.user._id,
                        date,
                        description,
                        amount
                    );

                    if (duplicate && !force && !skip) {
                        duplicates.push(r);
                    } else {
                        valid.push({
                            user: req.user._id,
                            date,
                            description,
                            amount,
                            category: guessCategory(description),
                        });
                    }
                }

                if (duplicates.length && !force && !skip) {
                    return res.status(409).json({
                        message: "Duplicates detected",
                        duplicates,
                    });
                }

                const inserted = await Transaction.insertMany(valid);

                return res.json({
                    insertedCount: inserted.length,
                    duplicatesSkipped: duplicates.length,
                });
            })
            .on("error", (err) => {
                console.error(err);
                res.status(500).json({ message: "CSV parse error" });
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Upload failed" });
    }
});

export default router;
