"use client";

import React from "react";
import { MoonStar, SunMedium } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, hasMounted } = useTheme();

  if (!hasMounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      aria-label={isDark ? "ใช้ธีมสว่าง" : "ใช้ธีมมืด"}
      onClick={toggleTheme}
      className="rounded-full border border-border/60 bg-card/80 text-foreground shadow-sm transition hover:border-primary/40 hover:bg-primary/10"
    >
      {isDark ? (
        <SunMedium className="h-4 w-4 text-amber-400" />
      ) : (
        <MoonStar className="h-4 w-4 text-indigo-500" />
      )}
    </Button>
  );
};

