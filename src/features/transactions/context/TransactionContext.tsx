import React, { createContext, useEffect, useState } from "react";
import type { Transaction } from "../model/TransactionTypes";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactions.api";

interface TransactionContextType {
  transactions: Transaction[];
  handleAddTransaction: (transaction: Transaction) => void;
  handleUpdateTransaction: (updatedTransaction: Transaction) => void;
  handleDeleteTransaction: (id: string) => void;
  totalIncome: number;
  totalExpense: number;
  availableMoney: number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleAddTransaction = async (transaction: Transaction) => {
    try {
      const newTransaction = await createTransaction(transaction);
      setTransactions((prev) => [...prev, newTransaction]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTransaction = async (updatedTransaction: Transaction) => {
    try {
      const myUpdatedTransaction = await updateTransaction(updatedTransaction);
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === myUpdatedTransaction.id
            ? myUpdatedTransaction
            : transaction,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      setTransactions((prev) =>
        prev.filter((transaction) => transaction.id !== id),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "Entrada")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "Saída")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const availableMoney = totalIncome - totalExpense;

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        handleAddTransaction,
        handleUpdateTransaction,
        handleDeleteTransaction,
        totalIncome,
        totalExpense,
        availableMoney,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export { TransactionContext, TransactionProvider };
