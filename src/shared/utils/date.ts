export type PeriodType =
  | "Hoje"
  | "Última Semana"
  | "Último Mês"
  | "Último Bimestre"
  | "Último Trimestre"
  | "Último Quadrimestre"
  | "Último Semestre"
  | "Último Ano"
  | "Mais de um ano";

export const formatTodayString = (): string => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const calculatePeriod = (transactionDate: string): PeriodType => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(transactionDate);
  date.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));

  if (diffDays === 0) return "Hoje";
  if (diffDays <= 7) return "Última Semana";
  if (diffDays <= 30) return "Último Mês";
  if (diffDays <= 60) return "Último Bimestre";
  if (diffDays <= 90) return "Último Trimestre";
  if (diffDays <= 120) return "Último Quadrimestre";
  if (diffDays <= 180) return "Último Semestre";
  if (diffDays <= 365) return "Último Ano";
  return "Mais de um ano";
};
