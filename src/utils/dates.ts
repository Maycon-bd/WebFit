export interface MonthReference {
  label: string;
  month: number;
  year: number;
}

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const getRollingMonths = (referenceDate = new Date(), count = 13): MonthReference[] => {
  if (!Number.isInteger(count) || count <= 0) return [];

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - count + 1 + index, 1);
    return {
      label: `${MONTH_NAMES[date.getMonth()]}/${date.getFullYear().toString().slice(-2)}`,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  });
};
