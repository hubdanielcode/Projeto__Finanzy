import { TransactionCards } from "../../features/transactions/components/TransactionCards";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSetPrivacy = () => {
    setIsPrivate(!isPrivate);
  };
  return (
    <header className="w-full h-70 bg-linear-to-r from-blue-600 to-purple-600">
      <div className="max-w-screen mx-70 text-white">
        <div className="flex items-center gap-4 max-w-screen">
          <div className="backdrop-blur-sm rounded-xl items-center justify-center w-fit h-20 flex">
            <img
              className="h-18 w-18 rounded-xl mt-4"
              src="./src/assets/images/FinanzyLogo.png"
              alt="Logo"
            />

            <div className="pl-4 pt-4">
              <h1 className="text-3xl font-bold mb-2">Controle Financeiro</h1>
              <p className="text-md opacity-90 flex flex-col">
                Gerencie suas finanças pessoais
              </p>
            </div>
          </div>
          <div className="text-white font-semibold flex items-center justify-center bg-white/20 border border-gray-50/50 backdrop-blur-sm rounded-xl py-2 px-4 ml-auto">
            {isPrivate ? (
              <EyeClosed
                className="mr-3 h-8 w-8 cursor-pointer"
                role="button"
                onClick={handleSetPrivacy}
              />
            ) : (
              <Eye
                className="mr-3 h-8 w-8 cursor-pointer"
                role="button"
                onClick={handleSetPrivacy}
              />
            )}
            <span className="text-white text-sm hidden sm:inline">
              {isPrivate ? "Mostrar" : "Ocultar"}
            </span>
          </div>
        </div>

        <div className="flex gap-6 max-w-full mt-3">
          <TransactionCards isPrivate={isPrivate} />
        </div>
      </div>
    </header>
  );
};

export { Header };
