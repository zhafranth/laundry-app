import { useState, useCallback } from "react";
import type { StaffSortField, SortOrder } from "@/services/employee";

export type StaffFilterState = {
  search: string;
  isActive: boolean | undefined; // undefined = semua
  sortBy: StaffSortField;
  sortOrder: SortOrder;
  page: number;
};

const DEFAULT_FILTERS: StaffFilterState = {
  search: "",
  isActive: undefined,
  sortBy: "name",
  sortOrder: "asc",
  page: 1,
};

export function useStaffFilters() {
  const [filters, setFilters] = useState<StaffFilterState>(DEFAULT_FILTERS);

  const updateFilter = useCallback(
    <K extends keyof StaffFilterState>(key: K, value: StaffFilterState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page: key === "page" ? (value as number) : 1,
      }));
    },
    []
  );

  const toggleSort = useCallback((field: StaffSortField) => {
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
