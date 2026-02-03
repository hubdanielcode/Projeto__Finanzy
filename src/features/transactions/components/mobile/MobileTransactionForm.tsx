import { Plus, X } from "lucide-react";
import { useEffect, useRef, useState, useContext } from "react";
import { TransactionContext } from "../../context/TransactionContext";
import {
  IncomeOptions,
  ExpenseOptions,
  TransactionTypeOptions,
} from "../../model/TransactionOptions";
import type { Transaction } from "../../model/TransactionTypes";
import {
  calculatePeriod,
  formatTodayString,
} from "../../../../shared/utils/date";

export interface TransactionFormProps {
  title: string;
  setTitle: (title: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  date: string;
  setDate: (date: string) => void;
  isMobileFormOpen: boolean;
  setIsMobileFormOpen: (isMobileFormOpen: boolean) => void;
}

const MobileTransactionForm: React.FC<TransactionFormProps> = ({
  title,
  setTitle,
  amount,
  setAmount,
  date,
  setDate,
  isMobileFormOpen,
  setIsMobileFormOpen,
}) => {
  const context = useContext(TransactionContext);
  if (!context)
    throw new Error(
      "TransactionContext must be used within a TransactionProvider",
    );

  const { handleAddTransaction } = context;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formType, setFormType] = useState<"Entrada" | "Saída" | null>(null);

  const DropDownRef = useRef<HTMLDivElement>(null);
  const FormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isMobileFormOpen) {
      setFormType(null);
      setSelectedCategory("");
      setIsOpen(false);
    }
  }, [isMobileFormOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        DropDownRef.current &&
        !DropDownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAmountChange = (value: string) => {
    if (/^[0-9.,]*$/.test(value)) setAmount(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formType) {
      alert("Selecione o tipo da transação");
      return;
    }

    if (!selectedCategory) {
      alert("Selecione a categoria da transação");
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
    setIsMobileFormOpen(false);
  };

  const todayString = formatTodayString();

  return (
    <div className="fixed inset-0 z-10 sm:hidden bg-white">
      <form
        className="flex flex-col gap-4 h-full overflow-y-auto px-4 py-6 w-screen"
        ref={FormRef}
        onSubmit={handleSubmit}
      >
        {/* - Cabeçalho - */}

        <div className="flex items-center gap-3 mb-4">
          <Plus className="bg-blue-100 h-8 w-8 rounded-xl text-blue-500 p-1" />
          <h1 className="font-bold text-2xl text-black">Nova Transação</h1>
          <button
            className="ml-auto bg-black h-8 w-8 rounded-xl flex items-center justify-center text-white"
            type="button"
            onClick={() => setIsMobileFormOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* - Título - */}

        <div>
          <label className="text-gray-700 font-semibold mb-1 block">
            Título
          </label>
          <input
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 border-gray-500/50"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Salário, Aluguel..."
            required
          />
        </div>

        {/* - Valor - */}

        <div>
          <label className="text-gray-700 font-semibold mb-1 block">
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

        <div>
          <label className="text-gray-700 font-semibold mb-1 block">Tipo</label>
          <div className="flex gap-4">
            {TransactionTypeOptions.map((type) => (
              <button
                className={`flex-1 py-2 rounded-lg border font-bold transition outline-none focus:outline-none ${
                  formType === type
                    ? type === "Entrada"
                      ? "bg-green-100 border-green-600 text-green-600"
                      : "bg-red-100 border-red-600 text-red-600"
                    : "bg-gray-100 border-gray-500/50 text-gray-700"
                }`}
                key={type}
                type="button"
                onClick={() => {
                  setFormType(type);
                  setSelectedCategory("");
                  setIsOpen(false);
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* - Categoria - */}

        <div ref={DropDownRef}>
          <label className="text-gray-700 font-semibold mb-1 block">
            Categoria
          </label>
          {isOpen && formType && (
            <ul className="bg-white shadow-sm">
              {(formType === "Entrada" ? IncomeOptions : ExpenseOptions).map(
                (option) => (
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
                ),
              )}
            </ul>
          )}
          <input
            className="w-full px-4 py-2 rounded-lg border border-gray-500/50 bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
            type="text"
            value={selectedCategory}
            readOnly
            disabled={!formType}
            placeholder={
              formType ? "Selecione uma categoria" : "Selecione o tipo primeiro"
            }
            onClick={() => formType && setIsOpen(true)}
            required
          />
        </div>

        {/* - Data - */}

        <div>
          <label className="text-gray-700 font-semibold mb-1 block">Data</label>
          <input
            className="w-full px-4 py-2 border border-gray-500/50 rounded-lg bg-gray-100"
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={todayString}
            min="2020-01-01"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export { MobileTransactionForm };
