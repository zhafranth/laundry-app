import { useState, useCallback } from "react";

// ── Income Filters ──

export type IncomeFilterState = {
  dateFrom: string;
  dateTo: string;
  paymentMethod: string;
  serviceId: string;
  page: number;
};

const DEFAULT_INCOME_FILTERS: IncomeFilterState = {
  dateFrom: "",
  dateTo: "",
  paymentMethod: "",
  serviceId: "",
  page: 1,
};

export function useIncomeFilters() {
  const [filters, setFilters] = useState<IncomeFilterState>(
    DEFAULT_INCOME_FILTERS
  );

  const updateFilter = useCallback(
    <K extends keyof IncomeFilterState>(
      key: K,
      value: IncomeFilterState[K]
    ) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page: key === "page" ? (value as number) : 1,
      }));
    },
    []
  );

  const resetFilters = useCallback(
    () => setFilters(DEFAULT_INCOME_FILTERS),
    []
  );

  return { filters, updateFilter, resetFilters };
}

// ── Expense Filters ──

export type ExpenseFilterState = {
  categoryId: string;
  dateFrom: string;
  dateTo: string;
  search: string;
  page: number;
};

const DEFAULT_EXPENSE_FILTERS: ExpenseFilterState = {
  categoryId: "",
  dateFrom: "",
  dateTo: "",
  search: "",
  page: 1,
};

export function useExpenseFilters() {
  const [filters, setFilters] = useState<ExpenseFilterState>(
    DEFAULT_EXPENSE_FILTERS
  );

  const updateFilter = useCallback(
    <K extends keyof ExpenseFilterState>(
      key: K,
      value: ExpenseFilterState[K]
    ) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page: key === "page" ? (value as number) : 1,
      }));
    },
    []
  );

  const resetFilters = useCallback(
    () => setFilters(DEFAULT_EXPENSE_FILTERS),
    []
  );

  return { filters, updateFilter, resetFilters };
}
