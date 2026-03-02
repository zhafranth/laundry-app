"use client";

import { useCallback, useState } from "react";

type UseToggleReturn = [boolean, () => void, (value: boolean) => void];

export function useToggle(initialValue = false): UseToggleReturn {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle, setValue];
}
