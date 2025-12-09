import mongoose from "mongoose";

const monthlySummarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    summaryText: {
      type: String,
      default: "",
    },
    cutSuggestions: {
      type: String,
      default: "",
    },
    topCategories: {
      type: [String],
      default: [],
    },
    savingGoal: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

monthlySummarySchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

export const MonthlySummary = mongoose.model(
  "MonthlySummary",
  monthlySummarySchema
);
