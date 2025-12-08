import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        month: { type: Number, required: true }, // 1-12
        year: { type: Number, required: true },
        total: { type: Number, required: true },
        perCategory: {
            type: Map,
            of: Number, // { "food": 10000, "rent": 15000, ... }
            default: {},
        },
    },
    { timestamps: true }
);

budgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

export const Budget = mongoose.model("Budget", budgetSchema);
