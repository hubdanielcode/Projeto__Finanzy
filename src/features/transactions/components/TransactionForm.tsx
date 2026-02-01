import { Plus } from "lucide-react";
import { useEffect, useRef, useState, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import type { MainContentProps } from "./MainContent";
import { ExpenseOptions, IncomeOptions } from "../model/TransactionOptions";
import type { Transaction } from "../model/TransactionTypes";
import { calculatePeriod, formatTodayString } from "../../../shared/utils/date";

const TransactionForm: React.FC<MainContentProps> = ({
  title,
  setTitle,
  amount,
  setAmount,
  date,
  setDate,
}) => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "TransactionContext must be used within a TransactionProvider",
    );
  }

  const { handleAddTransaction } = context;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formType, setFormType] = useState<"Entrada" | "Saída" | null>(null);

  const DropDownRef = useRef<HTMLDivElement>(null);
  const TypeRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        DropDownRef.current &&
        !DropDownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      if (TypeRef.current && !TypeRef.current.contains(event.target as Node)) {
        setFormType(null);
        setSelectedCategory("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleDropDown = () => setIsOpen(!isOpen);

  const handleAmountChange = (value: string) => {
    if (/^[0-9.,]*$/.test(value)) setAmount(value);
  };

  const handleSelectIncome = () => {
    setFormType("Entrada");
    setSelectedCategory("");
  };

  const handleSelectExpense = () => {
    setFormType("Saída");
    setSelectedCategory("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formType === null) {
      alert("Por favor, selecione o tipo da transação");
      return;
    }

    if (!selectedCategory) {
      alert("Por favor, selecione a categoria da sua transação");
      return;
    }

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      title,
      amount: Number(amount.replace(",", ".")),
      type: formType,
      category: selectedCategory,
      date,
      period: calculatePeriod(date),
    };

    handleAddTransaction(newTransaction);

    setTitle("");
    setAmount("");
    setDate("");
    setFormType(null);
    setSelectedCategory("");
    setIsOpen(false);
  };

  const todayString = formatTodayString();

  return (
    <div>
      <form
        className="bg-white border border-gray-500/50 rounded-xl text-black max-w-7xl ml-70 mr-10 my-8 py-2 px-8 w-110 sticky top-6"
        ref={TypeRef}
        onSubmit={handleSubmit}
      >
        {/* - Cabeçalho - */}

        <div className="w-full flex py-2 mb-4 px-4 pt-6">
          <Plus className="bg-blue-100 mr-3 h-10 w-10 rounded-xl text-blue-500 text-md hover:bg-blue-200 hover:text-blue-600" />
          <h1 className="font-bold text-black text-3xl">Nova Transação</h1>
        </div>

        {/* - Título - */}

        <div className="mb-4">
          <label className="flex flex-col text-gray-700 font-semibold mb-2">
            Título
          </label>
          <input
            className="bg-gray-100 px-4 py-2 border-gray-500/50 border rounded-lg w-full text-md outline-none font-normal placeholder:font-normal text-gray-700"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Salário, Aluguel, Supermercado..."
            required
          />
        </div>

        {/* - Valor - */}

        <div className="mb-4">
          <label className="flex flex-col text-gray-700 font-semibold mb-2">
            Valor
          </label>
          <div className="bg-gray-100 px-4 py-2 border-gray-500/50 border rounded-lg w-full text-md outline-none pr-2 font-bold text-gray-700">
            R$:
            <input
              className="outline-none pl-2 font-normal placeholder:font-normal text-gray-700"
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0,00"
              required
            />
          </div>
        </div>

        {/* - Tipo - */}

        <div className="mb-4">
          <label className="flex flex-col text-gray-700 font-semibold mb-2">
            Tipo
          </label>
          <div className="flex flex-1 gap-8 justify-center items-center mx-auto mb-4">
            <span
              className={`font-bold text-center py-2 px-4 w-45 h-12 rounded-lg border cursor-pointer ${
                formType === "Entrada"
                  ? "bg-green-100 text-green-600 border-green-600"
                  : "bg-gray-100 text-gray-600 border-gray-500/50 hover:bg-green-100 hover:text-green-600 hover:border-green-600"
              }`}
              role="button"
              onClick={handleSelectIncome}
            >
              Entrada
            </span>
            <span
              className={`font-bold text-center py-2 px-4 w-45 h-12 rounded-lg border cursor-pointer ${
                formType === "Saída"
                  ? "bg-red-100 text-red-600 border-red-600"
                  : "bg-gray-100 text-gray-600 border-gray-500/50 hover:bg-red-100 hover:text-red-600 hover:border-red-600"
              }`}
              role="button"
              onClick={handleSelectExpense}
            >
              Saída
            </span>
          </div>
        </div>

        {/* - Categoria - */}

        <div
          className="mb-4"
          ref={DropDownRef}
        >
          <label className="flex flex-col text-gray-700 font-semibold mb-2">
            Categoria
          </label>
          {isOpen && formType === "Saída" && (
            <ul>
              {ExpenseOptions.map((option) => (
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-normal placeholder:font-normal text-gray-700"
                  key={option}
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedCategory(option);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
          {isOpen && formType === "Entrada" && (
            <ul>
              {IncomeOptions.map((option) => (
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-normal placeholder:font-normal text-gray-700"
                  key={option}
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedCategory(option);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
          <input
            className="bg-gray-100 px-4 py-2 border-gray-500/50 border rounded-lg w-full text-md outline-none font-normal placeholder:font-normal text-gray-700"
            type="text"
            placeholder="Selecione uma categoria"
            value={selectedCategory}
            readOnly
            onClick={handleToggleDropDown}
            required
          />
        </div>

        {/* - Data - */}

        <div className="mb-4">
          <label className="flex flex-col text-gray-700 font-semibold mb-2">
            Data
          </label>
          <input
            className="bg-gray-100 px-4 py-2 border-gray-500/50 border rounded-lg w-full text-md outline-none font-normal placeholder:font-normal text-gray-700"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={todayString}
            min="2020-01-01"
            required
          />
        </div>

        <button className="w-full bg-blue-600 text-white font-bold border border-blue-600 hover:bg-blue-500 hover:border-blue-500 cursor-pointer rounded-lg h-12 mb-2">
          Submit
        </button>
      </form>
    </div>
  );
};

export { TransactionForm, IncomeOptions, ExpenseOptions };
