import { X } from "lucide-react";
import { useState } from "react";
import type { Transaction } from "../model/TransactionTypes";

interface ModalProps {
  transaction: Transaction;
  onClose: () => void;
  onSubmit: (updatedTransaction: Transaction) => void;
  ExpenseOptions: string[];
  IncomeOptions: string[];
}

const Modal: React.FC<ModalProps> = ({
  transaction,
  onClose,
  onSubmit,
  ExpenseOptions,
  IncomeOptions,
}) => {
  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState(transaction.amount);
  const [amountInput, setAmountInput] = useState(
    transaction.amount.toFixed(2).replace(".", ","),
  );
  const [category, setCategory] = useState(transaction.category);
  const [type, setType] = useState(transaction.type);
  const [date, setDate] = useState(transaction.date);
  const [isOpen, setIsOpen] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed flex inset-0 justify-center items-center bg-black/80 h-screen z-10 mx-auto">
      <div className="flex flex-col bg-white h-fit w-150 rounded-xl border-gray-500/50 border pt-2 relative">
        {/* - Título geral - */}

        <h1 className="flex w-full font-bold text-black text-xl sm:text-3xl justify-center mb-4 pt-2">
          Atualize a sua transação
        </h1>

        <button
          className="absolute top-5 right-5 bg-gray-800 hover:bg-black text-white rounded-xl p-1 cursor-pointer"
          onClick={onClose}
        >
          <X size={25} />
        </button>

        {/* - Título da transação - */}

        <div className="flex flex-col mb-6 px-10">
          <label className="flex flex-col text-gray-700 font-semibold mb-2">
            Título
          </label>
          <input
            className="bg-gray-100 px-4 py-2 border-gray-500/50 border rounded-lg w-full text-md outline-none font-normal placeholder:font-normal text-gray-700"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* - Valor da transação - */}

        <div className="flex flex-col mb-6 px-10">
          <label className="flex flex-col text-gray-700 font-semibold mb-2">
            Valor
          </label>
          <div className="bg-gray-100 px-4 py-2 border-gray-500/50 border rounded-lg w-full text-md outline-none pr-2 font-bold text-gray-700">
            R$:
            <input
              className="outline-none pl-2 font-normal placeholder:font-normal text-gray-700"
              type="text"
              value={amountInput}
              placeholder="0,00"
              required
              onChange={(e) => {
                const value = e.target.value;

                if (/^[0-9]*,?[0-9]{0,2}$/.test(value)) {
                  setAmountInput(value);
                }
              }}
            />
          </div>
        </div>

        {/* - Categoria da transação - */}

        <div className="flex flex-col mb-6 px-10">
          <label className="flex flex-col text-gray-700 font-semibold mb-2">
            Categoria
          </label>
          <input
            className="bg-gray-100 px-4 py-2 border-gray-500/50 border rounded-lg w-full text-md outline-none font-normal placeholder:font-normal text-gray-700"
            type="text"
            value={category}
            placeholder="Selecione uma Categoria..."
            readOnly
            onClick={() => setIsOpen(!isOpen)}
          />
          {isOpen &&
            (type === "Entrada" ? IncomeOptions : ExpenseOptions).map(
              (option) => (
                <li
                  key={option}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setCategory(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </li>
              ),
            )}
        </div>

        {/* - Data da transação - */}

        <div className="flex flex-col mb-6 px-10">
          <label className="flex flex-col text-gray-700 font-semibold mb-2">
            Data
          </label>
          <input
            className="bg-gray-100 px-4 py-2 border-gray-500/50 border rounded-lg w-full text-md outline-none font-normal placeholder:font-normal text-gray-700"
            type="date"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* - Botões - */}

        <div className="flex justify-around items-center mb-2 px-10">
          <button
            className="flex text-white bg-blue-600 hover:bg-blue-500 border border-gray-500/50 py-2 px-4 rounded-lg cursor-pointer mb-2"
            onClick={() =>
              onSubmit({ ...transaction, title, amount, category, type, date })
            }
          >
            Salvar
          </button>
          <button
            className="flex text-white bg-blue-600 hover:bg-blue-500 border border-gray-500/50 py-2 px-4 rounded-lg cursor-pointer mb-2"
            onClick={() => {
              setTitle(transaction.title);
              setAmount(transaction.amount);
              setCategory(transaction.category);
              setType(transaction.type);
              setDate(transaction.date);
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export { Modal };
