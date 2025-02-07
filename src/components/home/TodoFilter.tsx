
import { Button } from "@/components/ui/button";
import { Filter, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type FilterType = "all" | "completed" | "pending";

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function TodoFilter({ currentFilter, onFilterChange }: TodoFilterProps) {
  return (
    <div className="flex items-center gap-2">
      {["all", "completed", "pending"].map((filter) => (
        <Button
          key={filter}
          variant="ghost"
          size="sm"
          onClick={() => onFilterChange(filter as FilterType)}
          className={cn(
            "h-10 px-4 rounded-full transition-all duration-200",
            currentFilter === filter
              ? "bg-violet-500 text-white hover:bg-violet-600"
              : "bg-white text-secondary-600 hover:bg-violet-50 border border-violet-100/30"
          )}
        >
          {filter === "all" ? "All Tasks" : 
           filter === "completed" ? "Completed" : "Pending"}
        </Button>
      ))}
    </div>
  );
}
