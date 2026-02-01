import { ArrowDownCircle, ArrowUpCircle, DollarSign } from "lucide-react";
import { useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { formatPrivateCurrency } from "../utils/formatPrivateCurrency";

const TransactionCards: React.FC<{ isPrivate: boolean }> = ({ isPrivate }) => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("TransactionContext must be used within a contextProvider");
  }

  const { totalIncome, totalExpense, availableMoney } = context;

  return (
    <div>
      <div className="flex flex-1 gap-4 mt-4">
        <div className="bg-white/20 border border-gray-50/50 backdrop-blur-sm rounded-xl w-110 h-35 flex px-6">
          <ArrowUpCircle className="text-green-300 bg-green-600/50 rounded-xl h-12 w-15 mt-6 p-2" />
          <div className="flex flex-col w-full pl-4">
            <h1 className="text-white font-semibold text-2xl mt-8 mb-4">
              Entradas
            </h1>
            <p className="flex flex-1 text-white text-4xl font-bold">
              {formatPrivateCurrency(totalIncome, isPrivate)}
            </p>
          </div>
        </div>

        <div className="bg-white/20 border border-gray-50/50 backdrop-blur-sm rounded-xl w-110 h-35 flex px-6">
          <ArrowDownCircle className="text-red-300 bg-red-600/50 rounded-xl h-12 w-15 mt-6 p-2" />
          <div className="flex flex-col w-full pl-4">
            <h1 className="text-white font-semibold text-2xl mt-8 mb-4">
              Saídas
            </h1>
            <p className="text-white text-4xl font-bold">
              {formatPrivateCurrency(totalExpense, isPrivate)}
            </p>
          </div>
        </div>

        <div className="bg-white/20 border border-gray-50/50 backdrop-blur-sm rounded-xl w-110 h-35 flex px-6">
          <DollarSign className="text-blue-300 bg-blue-600/50 rounded-xl h-12 w-15 mt-6 p-2" />
          <div className="flex flex-col w-full pl-4">
            <h1 className="text-white font-semibold text-2xl mt-8 mb-4">
              Saldo
            </h1>
            <p className="text-green-300 text-4xl font-bold">
              {formatPrivateCurrency(availableMoney, isPrivate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TransactionCards };
