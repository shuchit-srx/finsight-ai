// src/components/transactions/CsvUpload.jsx
import { useState } from "react";
import { useTransactions } from "../../context/TransactionContext";

export default function CsvUpload() {
  const { uploadCSV } = useTransactions();

  const [file, setFile] = useState(null);
  const [duplicateMode, setDuplicateMode] = useState("skip"); // skip | allow
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setResult("Please select a CSV file first.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await uploadCSV(file, duplicateMode);
      setResult(`Uploaded: ${res.insertedCount} transactions`);
    } catch (err) {
      console.error(err);
      setResult("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 mt-4 rounded-xl border border-slate-800 bg-slate-900/70">
      <p className="text-sm text-slate-300 mb-2">Upload CSV bank statement</p>

      {/* File picker */}
      <div className="flex items-center gap-3 mb-4">
        <label
          className="
            px-4 py-2 rounded-lg cursor-pointer bg-slate-800 
            border border-slate-700 text-slate-200 text-sm hover:bg-slate-700
          "
        >
          Choose File
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <span className="text-xs text-slate-400">
          {file ? file.name : "No file selected"}
        </span>
      </div>

      {/* Duplicate mode */}
      <div className="mb-3 text-xs text-slate-400">
        <label className="mr-3">
          <input
            type="radio"
            value="skip"
            checked={duplicateMode === "skip"}
            onChange={() => setDuplicateMode("skip")}
            className="mr-1"
          />
          Skip duplicate transactions
        </label>

        <label>
          <input
            type="radio"
            value="allow"
            checked={duplicateMode === "allow"}
            onChange={() => setDuplicateMode("allow")}
            className="mr-1"
          />
          Allow duplicates
        </label>
      </div>

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="
          px-4 py-2 rounded-lg text-sm font-medium 
          bg-emerald-500 text-slate-950
          hover:bg-emerald-400 transition
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>

      {result && (
        <p className="mt-3 text-xs text-slate-300">{result}</p>
      )}
    </div>
  );
}
