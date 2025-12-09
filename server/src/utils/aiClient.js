import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const buildFallbackAnalysis = (transactions) => {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    const byCategory = {};
    for (const t of transactions) {
        const cat = t.category || "others";
        byCategory[cat] = (byCategory[cat] || 0) + t.amount;
    }

    const sortedCats = Object.entries(byCategory)
        .sort((a, b) => b[1] - a[1])
        .map(([cat]) => cat);

    const topCategories = sortedCats.slice(0, 3);

    const summaryText =
        `Based on the recent transactions, your total spending is approximately ` +
        `₹${total.toFixed(2)}. The highest spending categories are ` +
        (topCategories.length ? topCategories.join(", ") : "not clearly identified") +
        `.`;

    const cutSuggestions =
        topCategories.length
            ? `Try reducing discretionary expenses in categories like ${topCategories.join(
                ", "
            )}, and track recurring charges such as subscriptions or frequent small purchases. `
            : `Review recurring charges and discretionary expenses and reduce non-essential spending where possible.`;

    const savingGoal = Math.round(total * 0.2);

    return {
        summaryText,
        topCategories,
        cutSuggestions,
        savingGoal,
    };
};

export const getSpendingAnalysis = async (transactions) => {
    const recent = transactions.slice(-60).map((t) => ({
        date: t.date.toISOString().split("T")[0],
        description: t.description,
        amount: t.amount,
        category: t.category,
    }));

    if (!process.env.GEMINI_API_KEY) {
        console.warn("⚠️ GEMINI_API_KEY missing, using fallback analysis.");
        return buildFallbackAnalysis(recent);
    }

    const prompt = `
You are a precise personal finance analysis system.

Given the following JSON array of user transactions, analyse the user's spending.

Transactions:
${JSON.stringify(recent, null, 2)}

You MUST respond ONLY with a valid JSON object in this exact shape:

{
  "summaryText": "2-3 sentences summarizing the spending pattern",
  "topCategories": ["category1", "category2", "category3"],
  "cutSuggestions": "short paragraph suggesting where to reduce spending",
  "savingGoal": 12345.67
}

Rules:
- Do NOT include any extra keys.
- Do NOT include any explanations or commentary outside the JSON.
- "savingGoal" must be a number (no currency symbols).
`;

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-3-pro", 
        });

        const result = await model.generateContent(prompt);
        const rawText = result.response.text().trim();

        const cleaned = rawText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleaned);

        return {
            summaryText: parsed.summaryText || "",
            topCategories: Array.isArray(parsed.topCategories)
                ? parsed.topCategories
                : [],
            cutSuggestions: parsed.cutSuggestions || "",
            savingGoal:
                typeof parsed.savingGoal === "number" && !Number.isNaN(parsed.savingGoal)
                    ? parsed.savingGoal
                    : 0,
        };
    } catch (err) {
        console.error("Gemini error, using fallback:", err?.message || err);
        return buildFallbackAnalysis(recent);
    }
};
