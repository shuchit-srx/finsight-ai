import Card from "../common/Card";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    LineChart,
    Line,
    CartesianGrid,
    Cell,
} from "recharts";

const COLORS = [
    "#6366F1", // indigo
    "#10B981", // emerald
    "#F59E0B", // amber
    "#EF4444", // red
    "#3B82F6", // blue
    "#EC4899", // pink
    "#84CC16", // lime
];

export default function SpendingCharts({ byCategory, timeline }) {
    const categoryData = Object.entries(byCategory || {}).map(
        ([category, amount]) => ({
            category,
            amount,
        })
    );

    const timelineData = Array.isArray(timeline) ? timeline : [];

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            {/* Category bar chart */}
            <Card className="p-4 md:col-span-2 h-72">
                <p className="text-sm font-medium text-slate-100 mb-2">
                    Spending by category
                </p>
                <div className="w-full h-[85%]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData}>
                            <XAxis dataKey="category" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#020617",
                                    border: "1px solid #1e293b",
                                    borderRadius: "0.5rem",
                                    fontSize: "12px",
                                }}
                                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                            />
                            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                                {categoryData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Timeline line chart */}
            <Card className="p-4 md:col-span-3 h-72">
                <p className="text-sm font-medium text-slate-100 mb-2">
                    Activity over time
                </p>
                <div className="w-full h-[85%]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timelineData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                            <XAxis dataKey="date" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#020617",
                                    border: "1px solid #1e293b",
                                    borderRadius: "0.5rem",
                                    fontSize: "12px",
                                }}
                                cursor={{ stroke: "#334155" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#22c55e"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}
