import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: Date, required: true },
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        category: {
            type: String, enum: [
                "food",
                "rent",
                "transport",
                "shopping",
                "subscriptions",
                "others",
            ], default: "others"
        }
    },
    { timestamps: true }
);

// used for duplicate detection
TransactionSchema.statics.findDuplicate = function (user, date, description, amount) {
    return this.findOne({ user, date, description, amount });
};

export const Transaction = mongoose.model("Transaction", TransactionSchema);



