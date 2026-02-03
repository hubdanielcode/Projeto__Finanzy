import { Plus } from "lucide-react";
import { useEffect, useRef, useState, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { ExpenseOptions, IncomeOptions } from "../model/TransactionOptions";
import type { Transaction } from "../model/TransactionTypes";
import { calculatePeriod, formatTodayString } from "../../../shared/utils/date";

export interface TransactionFormProps {
  title: string;
  setTitle: (title: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  date: string;
  setDate: (date: string) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
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

  const DropDownRef = useRef<HTMLDivElement | null>(null);
  const TypeRef = useRef<HTMLFormElement | null>(null);

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
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAmountChange = (value: string) => {
    if (/^[0-9.,]*$/.test(value)) setAmount(value);
  };

  const handleSelectIncome = () => {
    setFormType("Entrada");
    setSelectedCategory("");
    setIsOpen(false);
  };

  const handleSelectExpense = () => {
    setFormType("Saída");
    setSelectedCategory("");
    setIsOpen(false);
  };

  const handleToggleDropDown = () => {
    if (!formType) return;
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formType) {
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
        className="hidden sm:block mx-auto bg-white border border-gray-500/50 rounded-xl text-black max-w-7xl my-8 py-2 px-8 w-99 sticky top-6"
        ref={TypeRef}
        onSubmit={handleSubmit}
      >
        {/* - Cabeçalho - */}

        <div className="w-full flex py-2 mb-4 px-4 pt-6">
          <Plus className="bg-blue-100 mr-3 h-8 w-8 rounded-xl text-blue-500" />
          <h1 className="font-bold text-black text-2xl">Nova Transação</h1>
        </div>

        {/* - Título - */}

        <div className="mb-4">
          <label className="text-gray-700 font-semibold mb-2 block">
            Título
          </label>
          <input
            className="bg-gray-100 px-4 py-2 border border-gray-500/50 rounded-lg w-full"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Salário, Aluguel, Supermercado..."
            required
          />
        </div>

        {/* - Valor - */}

        <div className="mb-4">
          <label className="text-gray-700 font-semibold mb-2 block">
            Valor
          </label>
          <div className="flex items-center bg-gray-100 border rounded-lg px-4 py-2 border-gray-500/50">
            <span className="font-bold text-gray-700">R$</span>
            <input
              className="pl-2 outline-none w-full bg-transparent"
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
          <label className="text-gray-700 font-semibold mb-2 block">Tipo</label>
          <div className="flex gap-8 justify-center mb-4">
            <button
              className={`font-bold py-2 px-4 w-45 h-12 rounded-lg border ${
                formType === "Entrada"
                  ? "bg-green-100 text-green-600 border-green-600"
                  : "bg-gray-100 text-gray-700 border-gray-500/50 hover:bg-green-100 hover:text-green-600 hover:border-green-600"
              }`}
              type="button"
              onClick={handleSelectIncome}
            >
              Entrada
            </button>

            <button
              className={`font-bold py-2 px-4 w-45 h-12 rounded-lg border ${
                formType === "Saída"
                  ? "bg-red-100 text-red-600 border-red-600"
                  : "bg-gray-100 text-gray-700 border-gray-500/50 hover:bg-red-100 hover:text-red-600 hover:border-red-600"
              }`}
              type="button"
              onClick={handleSelectExpense}
            >
              Saída
            </button>
          </div>
        </div>

        {/* - Categoria - */}

        <div
          className="mb-4"
          ref={DropDownRef}
        >
          <label className="text-gray-700 font-semibold mb-2 block">
            Categoria
          </label>

          {isOpen && formType === "Saída" && (
            <ul>
              {ExpenseOptions.map((option) => (
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  key={option}
                  onClick={() => {
                    setSelectedCategory(option);
                    setIsOpen(false);
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
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  key={option}
                  onClick={() => {
                    setSelectedCategory(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}

          <input
            className="bg-gray-100 px-4 py-2 border border-gray-500/50 rounded-lg w-full disabled:opacity-60"
            type="text"
            value={selectedCategory}
            readOnly
            disabled={!formType}
            onClick={handleToggleDropDown}
            placeholder={
              formType ? "Selecione uma categoria" : "Selecione o tipo primeiro"
            }
            required
          />
        </div>

        {/* - Data - */}

        <div className="mb-4">
          <label className="text-gray-700 font-semibold mb-2 block">Data</label>
          <input
            className="bg-gray-100 px-4 py-2 border border-gray-500/50 rounded-lg w-full"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={todayString}
            min="2020-01-01"
            required
          />
        </div>

        <button className="w-full bg-blue-600 text-white font-bold rounded-lg h-12 mb-3">
          Submit
        </button>
      </form>
    </div>
  );
};

export { TransactionForm };
