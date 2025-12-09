import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";


dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/summaries", summaryRoutes);
app.use("/api/transactions", transactionRoutes);

app.listen(process.env.PORT || 5000, () =>
    console.log("Server running on port", process.env.PORT)
);
