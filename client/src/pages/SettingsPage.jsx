import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import Card from "../components/common/Card.jsx";
import Loader from "../components/common/Loader.jsx";

const DEFAULT_CATEGORIES = [
    "food",
    "rent",
    "transport",
    "shopping",
    "subscriptions",
    "others",
];

const getMonthYear = () => {
    const now = new Date();
    return { month: now.getMonth() + 1, year: now.getFullYear() };
};

export default function SettingsPage() {
    const navigate = useNavigate();
    const [{ month, year }] = useState(getMonthYear());

    const [total, setTotal] = useState("");
    const [perCategory, setPerCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const loadBudgets = async () => {
        setLoading(true);
        try {
            const res = await api.get("/budgets", {
                params: { month, year },
            });

            const { budget } = res.data || {};

            if (budget) {
                setTotal(typeof budget.total === "number" ? budget.total : "");
                setPerCategory(budget.perCategory || {});
            } else {
                setTotal("");
                setPerCategory({});
            }
        } catch (err) {
            console.error("Failed to load budgets", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBudgets();
    }, [month, year]);

    const handleCategoryChange = (cat, value) => {
        setPerCategory((prev) => ({
            ...prev,
            [cat]: value === "" ? "" : Number(value),
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            await api.post("/budgets", {
                month,
                year,
                total: total === "" ? null : Number(total),
                perCategory,
            });

            setMessage("Budgets updated for this month.");

            window.location.href = "/";
        } catch (err) {
            console.error("Failed to save budgets", err);
            setMessage("Failed to save budgets. Try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader />;

    const monthLabel = new Date(year, month - 1).toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className="max-w-4xl mx-auto mt-6 space-y-6">
            <header>
                <h1 className="text-2xl font-semibold tracking-tight">Set Budget</h1>
                <p className="text-sm text-slate-400 mt-1">
                    Configure your monthly budgets and category limits for{" "}
                    <span className="text-slate-100">{monthLabel}</span>.
                </p>
            </header>

            <form onSubmit={handleSave} className="space-y-4">
                {/* Total budget */}
                <Card className="p-5">
                    <p className="text-xs uppercase text-slate-400 mb-2">
                        Overall monthly budget
                    </p>
                    <p className="text-xs text-slate-500 mb-3">
                        This is your target total spending limit for this month. It&apos;s
                        used to determine whether you&apos;re within, close to, or over
                        budget.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                        <div className="flex items-center gap-2 flex-1 max-w-xs">
                            <span className="text-sm text-slate-400">₹</span>
                            <input
                                type="number"
                                min="0"
                                value={total}
                                onChange={(e) => setTotal(e.target.value)}
                                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="e.g. 40000"
                            />
                        </div>
                        <p className="text-[11px] text-slate-500">
                            Leave empty or 0 if you don&apos;t want a global limit.
                        </p>
                    </div>
                </Card>

                {/* Per-category budgets */}
                <Card className="p-5">
                    <p className="text-xs uppercase text-slate-400 mb-2">
                        Per-category limits
                    </p>
                    <p className="text-xs text-slate-500 mb-4">
                        These optional limits help the dashboard highlight specific areas
                        where you&apos;re close to or over budget.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {DEFAULT_CATEGORIES.map((cat) => (
                            <div key={cat} className="space-y-1">
                                <label className="block text-xs font-medium text-slate-300 capitalize">
                                    {cat}
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">₹</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={
                                            perCategory[cat] === undefined ? "" : perCategory[cat]
                                        }
                                        onChange={(e) =>
                                            handleCategoryChange(cat, e.target.value)
                                        }
                                        className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="No limit"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="
              px-4 py-2.5 rounded-lg text-sm font-medium
              bg-emerald-500 text-slate-950
              hover:bg-emerald-400
              disabled:opacity-60 disabled:cursor-not-allowed
              transition shadow-[0_0_18px_rgba(16,185,129,0.6)]
            "
                    >
                        {saving ? "Saving..." : "Save changes"}
                    </button>
                    {message && (
                        <p className="text-xs text-slate-300">{message}</p>
                    )}
                </div>
            </form>
        </div>
    );
}
