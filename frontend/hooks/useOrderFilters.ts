import { useState, useCallback } from "react";

export type OrderFilterState = {
  status: string;
  search: string;
  dateFrom: string;
  dateTo: string;
  serviceId: string;
  page: number;
};

const DEFAULT_FILTERS: OrderFilterState = {
  status: "",
  search: "",
  dateFrom: "",
  dateTo: "",
  serviceId: "",
  page: 1,
};

export function useOrderFilters() {
  const [filters, setFilters] = useState<OrderFilterState>(DEFAULT_FILTERS);

  const updateFilter = useCallback(
    <K extends keyof OrderFilterState>(key: K, value: OrderFilterState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page: key === "page" ? (value as number) : 1,
      }));
    },
    []
  );

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return { filters, updateFilter, resetFilters };
}
