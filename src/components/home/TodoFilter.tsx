import { Button } from "@/components/ui/button";
import { Filter, Check } from "lucide-react";
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
          className="h-8 border-primary-100/30 bg-white/95 hover:bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-200"
        >
          <Filter className="w-4 h-4 mr-2 text-primary-600/70" />
          <span className="text-sm font-medium text-secondary-700">
            {currentFilter === "all" ? "All Tasks" : 
             currentFilter === "completed" ? "Completed" : "Pending"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 bg-white/95 backdrop-blur-sm border-primary-100/30 shadow-lg">
        <DropdownMenuItem 
          onClick={() => onFilterChange("all")}
          className="focus:bg-primary-50 cursor-pointer"
        >
          <div className="flex items-center justify-between w-full py-0.5">
            <span className="text-sm font-medium text-secondary-700">All Tasks</span>
            {currentFilter === "all" && <Check className="w-4 h-4 text-primary-600" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onFilterChange("completed")}
          className="focus:bg-primary-50 cursor-pointer"
        >
          <div className="flex items-center justify-between w-full py-0.5">
            <span className="text-sm font-medium text-secondary-700">Completed</span>
            {currentFilter === "completed" && <Check className="w-4 h-4 text-primary-600" />}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onFilterChange("pending")}
          className="focus:bg-primary-50 cursor-pointer"
        >
          <div className="flex items-center justify-between w-full py-0.5">
            <span className="text-sm font-medium text-secondary-700">Pending</span>
            {currentFilter === "pending" && <Check className="w-4 h-4 text-primary-600" />}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}