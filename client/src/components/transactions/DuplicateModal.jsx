export default function DuplicateModal({ duplicates, onRepeat, onSkip }) {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-slate-900 border border-slate-700 p-5 rounded-xl w-96">
                <h3 className="text-lg font-semibold text-slate-100">Duplicate Transactions</h3>
                <p className="text-sm text-slate-400 mt-2">
                    These records already exist. What do you want to do?
                </p>

                <div className="max-h-40 overflow-auto mt-3 text-xs text-slate-300 border border-slate-700 p-2 rounded-lg">
                    {duplicates.map((d, i) => (
                        <p key={i}>{d.date} — {d.description} — ₹{d.amount}</p>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onSkip}
                        className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                    >Skip duplicates</button>

                    <button
                        onClick={onRepeat}
                        className="px-3 py-1.5 rounded bg-emerald-500 text-slate-900"
                    >Add anyway</button>
                </div>
            </div>
        </div>
    );
}
