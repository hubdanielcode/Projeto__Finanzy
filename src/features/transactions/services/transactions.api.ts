import type { Transaction } from "../model/TransactionTypes";

const myAPI = "http://localhost:3500/transactions";

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await fetch(myAPI);

  if (!response.ok) {
    throw new Error("Error fetching transactions");
  }

  return response.json();
};

export const createTransaction = async (
  transaction: Transaction,
): Promise<Transaction> => {
  try {
    const response = await fetch(myAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      throw new Error("Error fetching transactions. Please try again");
    }

    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateTransaction = async (
  updatedTransaction: Transaction,
): Promise<Transaction> => {
  try {
    const response = await fetch(`${myAPI}/${updatedTransaction.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTransaction),
    });

    if (!response.ok) {
      throw new Error("Error fetching transactions. Please try again");
    }

    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${myAPI}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error fetching transactions. Please try again");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
