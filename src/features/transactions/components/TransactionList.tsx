import { UniqueTransaction } from "./UniqueTransaction";
import { ExpenseOptions, IncomeOptions } from "./TransactionForm";
import type { Transaction } from "../model/TransactionTypes";
import { Pagination } from "./Pagination";
import { useState } from "react";

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const toTimestamp = (brDate: string) => {
    const [day, month, year] = brDate.split("/");
    return new Date(`${year}-${month}-${day}`).getTime();
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    return toTimestamp(b.date) - toTimestamp(a.date);
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col">
      <div className="flex my-4">
        <h1 className="text-2xl text-black font-bold pl-4">
          Histórico de Transações
        </h1>
      </div>

      <ul>
        {paginatedTransactions.map((transaction) => (
          <UniqueTransaction
            key={transaction.id}
            transaction={transaction}
            ExpenseOptions={ExpenseOptions}
            IncomeOptions={IncomeOptions}
          />
        ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        pages={pages}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};

export { TransactionList };
