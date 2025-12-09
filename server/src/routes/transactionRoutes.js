import express from "express";
import multer from "multer";
import csv from "csv-parser";
import { Readable } from "stream";
import { auth } from "../middleware/auth.js";
import { Transaction } from "../models/Transaction.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Smart category guesser
const guessCategory = (text = "") => {
  const t = text.toLowerCase();
  if (/uber|ola|bus|train|cab|metro|fuel/.test(t)) return "transport";
  if (/zomato|swiggy|restaurant|cafe|food|pizza|burger/.test(t)) return "food";
  if (/rent|landlord|room/.test(t)) return "rent";
  if (/netflix|spotify|prime|subscription/.test(t)) return "subscriptions";
  if (/amazon|flipkart|myntra|shopping|store/.test(t)) return "shopping";
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
    console.error("Single transaction error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all transactions
router.get("/", auth, async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    const query = { user: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (category && category !== "all") {
      query.category = category;
    }

    const list = await Transaction.find(query).sort({ date: -1 });
    res.json(list);

  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// CSV Upload
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const csvRows = [];
    const stream = Readable.from(req.file.buffer);

    stream
      .pipe(csv())
      .on("data", (row) => csvRows.push(row))
      .on("end", async () => {
        try {
          const docs = csvRows.map((r) => ({
            user: req.user._id,
            date: new Date(r.date),
            description: r.description,
            amount: parseFloat(r.amount),
            category: guessCategory(r.description),
          }));

          const result = await Transaction.insertMany(docs, { ordered: false });

          res.json({
            insertedCount: result.length,
            message: "CSV uploaded successfully",
          });

        } catch (err) {
          console.error("CSV insert error:", err);
          res.status(500).json({ message: "Insert failed" });
        }
      });

  } catch (err) {
    console.error("CSV upload error:", err);
    res.status(500).json({ message: "CSV upload failed" });
  }
});

export default router;
