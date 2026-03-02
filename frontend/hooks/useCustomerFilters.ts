import { useState, useCallback } from "react";
import type { CustomerSortField, SortOrder } from "@/services/customer";

export type CustomerFilterState = {
  search: string;
  sortBy: CustomerSortField;
  sortOrder: SortOrder;
  page: number;
};

const DEFAULT_FILTERS: CustomerFilterState = {
  search: "",
  sortBy: "name",
  sortOrder: "asc",
  page: 1,
};

export function useCustomerFilters() {
  const [filters, setFilters] = useState<CustomerFilterState>(DEFAULT_FILTERS);

  const updateFilter = useCallback(
    <K extends keyof CustomerFilterState>(
      key: K,
      value: CustomerFilterState[K]
    ) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page: key === "page" ? (value as number) : 1,
      }));
    },
    []
  );

  const toggleSort = useCallback((field: CustomerSortField) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return { filters, updateFilter, toggleSort, resetFilters };
}
