import { useContext, useMemo, useState } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { TransactionForm } from "./TransactionForm";
import { Filter } from "./Filter";
import { TransactionList } from "./TransactionList";

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
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
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
  isModalOpen,
  setIsModalOpen,
}) => {
  const { transactions } = useContext(TransactionContext)!;

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
    <div className="flex">
      <TransactionForm
        title={title}
        setTitle={setTitle}
        amount={amount}
        setAmount={setAmount}
        date={date}
        setDate={setDate}
        type={type}
        setType={setType}
        category={category}
        setCategory={setCategory}
        period={period}
        setPeriod={setPeriod}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      <div className="flex flex-col">
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
  );
};

export { MainContent };
