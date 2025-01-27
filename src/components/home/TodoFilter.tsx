import { Button } from "@/components/ui/button";
import { Check, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FilterType = "all" | "completed" | "pending";

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function TodoFilter({ currentFilter, onFilterChange }: TodoFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 border-dashed bg-background/50 backdrop-blur-sm"
        >
          <Filter className="w-4 h-4 mr-2" />
          {currentFilter === "all" ? "All Tasks" : 
           currentFilter === "completed" ? "Completed" : "Pending"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => onFilterChange("all")}>
          <div className="flex items-center justify-between w-full">
            All Tasks
            {currentFilter === "all" && <Check className="w-4 h-4" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFilterChange("completed")}>
          <div className="flex items-center justify-between w-full">
            Completed
            {currentFilter === "completed" && <Check className="w-4 h-4" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFilterChange("pending")}>
          <div className="flex items-center justify-between w-full">
            Pending
            {currentFilter === "pending" && <Check className="w-4 h-4" />}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}