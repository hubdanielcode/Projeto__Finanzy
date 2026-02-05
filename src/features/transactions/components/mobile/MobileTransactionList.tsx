import { UniqueTransaction } from "../UniqueTransaction";
import { ExpenseOptions, IncomeOptions } from "../../model/TransactionOptions";
import type { Transaction } from "../../model/TransactionTypes";
import { Pagination } from "../Pagination";
import { useState } from "react";
import { MobileFilter } from "./MobileFilter";

interface FilterProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filteredTransactions: Transaction[];
  type: "Entrada" | "Saída" | null;
  setType: (type: "Entrada" | "Saída" | null) => void;
  period: Transaction["period"] | null;
  setPeriod: (period: Transaction["period"] | null) => void;
  category: string;
  setCategory: (category: string) => void;
  isMobileTransactionListOpen: boolean;
  setIsMobileTransactionListOpen: (value: boolean) => void;
}

interface TransactionListProps extends FilterProps {
  transactions: Transaction[];
}

const MobileTransactionList: React.FC<TransactionListProps> = ({
  transactions,
  searchQuery,
  setSearchQuery,
  filteredTransactions,
  type,
  setType,
  period,
  setPeriod,
  category,
  setCategory,
  isMobileTransactionListOpen,
  setIsMobileTransactionListOpen,
}) => {
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
    <div className="fixed inset-0 z-1 sm:hidden bg-white overflow-y-auto">
      <MobileFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredTransactions={filteredTransactions}
        type={type}
        setType={setType}
        period={period}
        setPeriod={setPeriod}
        category={category}
        setCategory={setCategory}
        isMobileTransactionListOpen={isMobileTransactionListOpen}
        setIsMobileTransactionListOpen={setIsMobileTransactionListOpen}
      />

      <div className="flex flex-col sm:hidden ml-8">
        <div className="flex sm:my-4 mb-2">
          <h1 className=" text-xl sm:text-2xl text-black font-bold pl-4">
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
    </div>
  );
};

export { MobileTransactionList };
