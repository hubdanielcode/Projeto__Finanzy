import { useContext, useMemo, useState } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { TransactionForm } from "./TransactionForm";
import { Filter } from "./Filter";
import { TransactionList } from "./TransactionList";
import { MobileTransactionForm } from "./mobile/MobileTransactionForm";
import { MobileFilter } from "./mobile/MobileFilter";
import { MobileActionsBar } from "./mobile/MobileActionBar";

export interface MainContentProps {
  title: string;
  setTitle: (title: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  date: string;
  setDate: (date: string) => void;
  type: "Entrada" | "Saída" | null;
  setType: (type: "Entrada" | "Saída" | null) => void;
  category: string;
  setCategory: (category: string) => void;
  period:
    | "Hoje"
    | "Última Semana"
    | "Último Mês"
    | "Último Bimestre"
    | "Último Trimestre"
    | "Último Quadrimestre"
    | "Último Semestre"
    | "Último Ano"
    | "Mais de um ano"
    | null;
  setPeriod: (period: MainContentProps["period"]) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  title,
  setTitle,
  amount,
  setAmount,
  date,
  setDate,
  type,
  setType,
  period,
  setPeriod,
  category,
  setCategory,
}) => {
  const { transactions } = useContext(TransactionContext)!;

  const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = useMemo(() => {
    let data = [...transactions];

    if (searchQuery.trim()) {
      data = data.filter((transaction) =>
        transaction.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (type) {
      data = data.filter((transaction) => transaction.type === type);
    }

    if (period) {
      data = data.filter((transaction) => transaction.period === period);
    }

    if (category) {
      data = data.filter((transaction) => transaction.category === category);
    }

    return data;
  }, [transactions, searchQuery, type, period, category]);

  return (
    <>
      <MobileActionsBar
        OpenForm={() => setIsMobileFormOpen(true)}
        OpenTransactionList={() => setIsMobileFilterOpen(true)}
      />

      <div className="flex gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* - Layout Desktop - */}

        <TransactionForm
          title={title}
          setTitle={setTitle}
          amount={amount}
          setAmount={setAmount}
          date={date}
          setDate={setDate}
        />

        <div className="flex flex-col flex-1">
          <Filter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredTransactions={filteredTransactions}
            type={type}
            setType={setType}
            period={period}
            setPeriod={setPeriod}
            category={category}
            setCategory={setCategory}
          />

          <TransactionList transactions={filteredTransactions} />
        </div>
      </div>

      <div className="flex flex-col flex-1">
        {/* - Layout Mobile - */}

        {isMobileFormOpen && (
          <MobileTransactionForm
            title={title}
            setTitle={setTitle}
            amount={amount}
            setAmount={setAmount}
            date={date}
            setDate={setDate}
            isMobileFormOpen={isMobileFormOpen}
            setIsMobileFormOpen={setIsMobileFormOpen}
          />
        )}

        {isMobileFilterOpen && (
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
            isMobileFilterOpen={isMobileFilterOpen}
            setIsMobileFilterOpen={setIsMobileFilterOpen}
          />
        )}
      </div>
    </>
  );
};

export { MainContent };
