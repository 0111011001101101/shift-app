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
          className="h-8 border-dashed bg-white/95 hover:bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-200"
        >
          <Filter className="w-4 h-4 mr-2 text-primary/70" />
          <span className="text-sm font-medium">
            {currentFilter === "all" ? "All Tasks" : 
             currentFilter === "completed" ? "Completed" : "Pending"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 bg-white/95 backdrop-blur-sm border border-gray-100 shadow-lg">
        <DropdownMenuItem 
          onClick={() => onFilterChange("all")}
          className="focus:bg-primary/5 cursor-pointer"
        >
          <div className="flex items-center justify-between w-full py-0.5">
            <span className="text-sm font-medium">All Tasks</span>
            {currentFilter === "all" && <Check className="w-4 h-4 text-primary" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onFilterChange("completed")}
          className="focus:bg-primary/5 cursor-pointer"
        >
          <div className="flex items-center justify-between w-full py-0.5">
            <span className="text-sm font-medium">Completed</span>
            {currentFilter === "completed" && <Check className="w-4 h-4 text-primary" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onFilterChange("pending")}
          className="focus:bg-primary/5 cursor-pointer"
        >
          <div className="flex items-center justify-between w-full py-0.5">
            <span className="text-sm font-medium">Pending</span>
            {currentFilter === "pending" && <Check className="w-4 h-4 text-primary" />}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}