import Card from "../common/Card";

const statusText = {
    within: "Within budget",
    close: "Close to limit",
    over: "Over budget",
    "no-budget": "No budget set",
};

const statusColor = {
    within: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
    close: "bg-amber-500/10 text-amber-300 border-amber-500/40",
    over: "bg-rose-500/10 text-rose-300 border-rose-500/40",
    "no-budget": "bg-slate-700/40 text-slate-300 border-slate-600",
};

export default function SummaryCards({
    totalSpent,
    totalStatus,
    savingGoal,
    monthLabel,
    perCategoryStatus = {},
}) {
    const alertCategories = Object.entries(perCategoryStatus).filter(
        ([, status]) => status === "over" || status === "close"
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total spending card */}
            <Card className="p-5">
                <p className="text-xs uppercase text-slate-400">
                    This month ({monthLabel})
                </p>
                <p className="text-3xl font-semibold mt-2">
                    ₹{totalSpent.toFixed(2)}
                </p>
                <div className="mt-3">
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] border ${statusColor[totalStatus]}`}
                    >
                        {statusText[totalStatus] || "No budget set"}
                    </span>
                </div>
            </Card>

            {/* Saving goal card */}
            <Card className="p-5">
                <p className="text-xs uppercase text-slate-400">
                    Suggested monthly saving
                </p>
                <p className="text-3xl font-semibold mt-2">
                    {savingGoal ? `₹${savingGoal.toFixed(2)}` : "—"}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                    Based on your recent spending pattern.
                </p>
            </Card>

            {/* Alerts & signals card (replaces quick tips) */}
            <Card className="p-5">
                <p className="text-xs uppercase text-slate-400">Alerts & signals</p>

                <div className="mt-3 space-y-2 text-xs">
                    <div
                        className={`inline-flex items-center px-2 py-1 rounded-full border ${statusColor[totalStatus]}`}
                    >
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                        <span className="capitalize">
                            {statusText[totalStatus] || "No budget set"}
                        </span>
                    </div>

                    {alertCategories.length > 0 ? (
                        <div className="space-y-1 mt-2">
                            <p className="text-slate-400">
                                Watch these categories:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {alertCategories.map(([cat, status]) => (
                                    <span
                                        key={cat}
                                        className={`px-2 py-1 rounded-full border text-[11px] ${status === "over"
                                                ? "bg-rose-500/10 text-rose-300 border-rose-500/40"
                                                : "bg-amber-500/10 text-amber-300 border-amber-500/40"
                                            }`}
                                    >
                                        {cat}: {status === "over" ? "over" : "near limit"}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-400 mt-2">
                            No categories are in the danger zone right now. Keep it steady.
                        </p>
                    )}
                </div>
            </Card>
        </div>
    );
}
