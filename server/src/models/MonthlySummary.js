import mongoose from "mongoose";

const monthlySummarySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    summaryText: { type: String, required: true },
    topCategories: [{ type: String }],
    cutSuggestions: { type: String },
    savingGoal: { type: Number }, // suggested monthly saving goal
  },
  { timestamps: true }
);

monthlySummarySchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

export const MonthlySummary = mongoose.model(
  "MonthlySummary",
  monthlySummarySchema
);
