import { useState } from "react";
import { Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";

export type DemoState = "data" | "loading" | "empty" | "empty-filter" | "error";

interface Props {
  currentState: DemoState;
  onStateChange: (state: DemoState) => void;
}

export function DemoStateFAB({ currentState, onStateChange }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="h-12 w-12 rounded-full shadow-lg">
            <Bug className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" className="w-48">
          <DropdownMenuLabel className="text-xs">Demo State Override</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {([
            ["data", "Data (Default)"],
            ["loading", "Loading / Skeleton"],
            ["empty", "Empty State"],
            ["empty-filter", "Empty Filter Result"],
            ["error", "Error State"],
          ] as [DemoState, string][]).map(([key, label]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => onStateChange(key)}
              className={currentState === key ? "bg-primary/10 text-primary font-medium" : ""}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
