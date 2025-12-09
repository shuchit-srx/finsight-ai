// src/components/transactions/CsvUpload.jsx
import { useState } from "react";
import api from "../../lib/api";
import Card from "../common/Card.jsx";

export default function CsvUpload() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please choose a CSV file first.");
            return;
        }

        setUploading(true);
        setMessage("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await api.post("/transactions/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage(`Uploaded ${res.data.insertedCount} transactions.`);
            setFile(null);
        } catch (err) {
            console.error(err);
            setMessage("Upload failed. Check your file format.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card className="p-5">
            <p className="text-xs uppercase text-slate-400 mb-2">
                Upload CSV Statement
            </p>

            <p className="text-xs text-slate-500 mb-4">
                CSV must contain <span className="text-slate-300">date, description, amount</span> columns.
            </p>

            <div className="flex items-center gap-4 flex-wrap">

                {/* Choose File Button */}
                <label
                    className="
                        cursor-pointer inline-flex items-center gap-2
                        px-4 py-2.5 rounded-lg text-sm font-medium
                        bg-slate-900 border border-slate-700
                        hover:bg-slate-800 hover:border-slate-600
                        text-slate-200 transition
                    "
                >
                    📁 Choose CSV File
                    <input
                        type="file"
                        accept=".csv"
                        name="file"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </label>

                {/* Upload Button */}
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="
                        px-4 py-2.5 rounded-lg text-sm font-medium
                        bg-emerald-500 text-slate-950
                        hover:bg-emerald-400
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition shadow-[0_0_15px_rgba(16,185,129,0.4)]
                    "
                >
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            </div>

            {/* Filename Preview */}
            {file && (
                <p className="text-xs text-slate-400 mt-2">
                    Selected file: <span className="text-slate-200">{file.name}</span>
                </p>
            )}

            {/* Message */}
            {message && (
                <p className="text-xs text-emerald-300 mt-3">
                    {message}
                </p>
            )}
        </Card>
    );
}
