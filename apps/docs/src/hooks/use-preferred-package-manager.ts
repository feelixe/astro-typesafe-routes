import { useEffect, useState } from "react";

const STORAGE_KEY = "preferredPackageManager";

export function usePreferredPackageManager() {
  const [internalValue, setInternalValue] = useState("npm");

  useEffect(() => {
    const preferredPackageManager = localStorage.getItem(STORAGE_KEY);
    if (preferredPackageManager) {
      setInternalValue(preferredPackageManager);
    }
  }, []);

  const setValue = (value: string) => {
    localStorage.setItem(STORAGE_KEY, value);
    setInternalValue(value);
  };

  return { value: internalValue, setValue };
}
