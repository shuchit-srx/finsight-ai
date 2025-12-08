export default function Card({ children, className = "" }) {
    return (
        <div
            className={`rounded-2xl border border-slate-800 bg-slate-950/70 backdrop-blur-xl ${className}`}
        >
            {children}
        </div>
    );
}
