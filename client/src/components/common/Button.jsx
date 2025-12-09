export default function Button({
    children,
    className = "",
    variant = "primary",
    ...props
}) {
    const base =
        "inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-emerald-500 text-slate-950 hover:bg-emerald-400",
        outline:
            "border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-slate-50",
        ghost: "text-slate-300 hover:bg-slate-800/60",
    };
    return (
        <button className={`cursor-pointer ${base} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
}
