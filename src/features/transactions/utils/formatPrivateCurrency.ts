import { formatCurrency } from "../../../shared/utils/formatCurrency";

export function formatPrivateCurrency(value: number, isPrivate: boolean) {
  return isPrivate ? "R$ *****" : formatCurrency(value);
}
