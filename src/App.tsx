import { useState } from "react";
import { TransactionProvider } from "./features/transactions/context/TransactionContext";
import { Header } from "./shared/components/Header";
import { MainContent } from "./features/transactions/components/MainContent";
import { Footer } from "./shared/components/Footer";

const App = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"Entrada" | "Saída" | null>(null);

  const [category, setCategory] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);
  const [isMobileTransactionListOpen, setIsMobileTransactionListOpen] =
    useState(false);

  const [period, setPeriod] = useState<
    | "Hoje"
    | "Última Semana"
    | "Último Mês"
    | "Último Bimestre"
    | "Último Trimestre"
    | "Último Quadrimestre"
    | "Último Semestre"
    | "Último Ano"
    | "Mais de um ano"
    | null
  >(null);

  return (
    <div className="bg-gray-100 min-h-screen mx-auto select-none scroll-smooth">
      <TransactionProvider>
        <Header />
        <MainContent
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
        />
      </TransactionProvider>
    </div>
  );
};

export default App;
