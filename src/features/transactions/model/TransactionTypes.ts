export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType | null;
  date: string;
  period: Period | null;
  category: string;
}
export type TransactionType = "Entrada" | "Saída";

export type Period =
  | "Hoje"
  | "Última Semana"
  | "Último Mês"
  | "Último Bimestre"
  | "Último Trimestre"
  | "Último Quadrimestre"
  | "Último Semestre"
  | "Último Ano"
  | "Mais de um ano";
