"use client";

import { Button } from "../components/ui/button";
import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSyncExternalStore } from "react";
import clsx from "clsx";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={clsx(
        "relative rounded-full transition-all duration-300",
        "hover:scale-105 active:scale-95",
        "shadow-[0_0_12px_rgba(251,191,36,0.4)]",
        "dark:shadow-[0_0_12px_rgba(147,197,253,0.4)]",
        "hover:rotate-180",
      )}
    >
      {resolvedTheme === "dark" ? (
        <FaMoon className="h-5 w-5" />
      ) : (
        <FaSun className="h-5 w-5" />
      )}
    </Button>
  );
}
