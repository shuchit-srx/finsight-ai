import { createContext, useContext, useState } from "react";
import api from "../lib/api";

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);

    const fetchTransactions = async (params = {}) => {
        const res = await api.get("/transactions", { params });
        setTransactions(res.data);
        return res.data;
    };

    const addTransaction = async (txn) => {
        const res = await api.post("/transactions", txn);
        setTransactions((prev) => [res.data, ...prev]);
        return res.data;
    };

    const uploadCSV = async (file, duplicateMode = "skip") => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("duplicateMode", duplicateMode);

        const res = await api.post("/transactions/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        await fetchTransactions();
        return res.data;
    };

    return (
        <TransactionsContext.Provider
            value={{ transactions, fetchTransactions, addTransaction, uploadCSV }}
        >
            {children}
        </TransactionsContext.Provider>
    );
};

export const useTransactions = () => useContext(TransactionsContext);
