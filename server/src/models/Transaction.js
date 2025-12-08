import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: Date, required: true },
        description: { type: String, required: true },
        amount: { type: Number, required: true }, // negative for expense
        category: {
            type: String,
            enum: [
                "food",
                "rent",
                "transport",
                "shopping",
                "subscriptions",
                "others",
            ],
            default: "others",
        },
    },
    { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
