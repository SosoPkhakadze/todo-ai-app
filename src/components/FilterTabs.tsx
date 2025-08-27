import { Button } from "@/components/ui/button";

export type FilterType = "all" | "active" | "completed";

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

export function FilterTabs({ activeFilter, onFilterChange, taskCounts }: FilterTabsProps) {
  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "All", count: taskCounts.all },
    { key: "active", label: "Active", count: taskCounts.active },
    { key: "completed", label: "Completed", count: taskCounts.completed },
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex bg-card/50 backdrop-blur-sm rounded-xl p-1.5 border border-border/50">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key;
          
          return (
            <Button
              key={filter.key}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange(filter.key)}
              className={`relative px-6 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {filter.label}
              {filter.count > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full transition-colors duration-300 ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {filter.count}
                </span>
              )}
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/10 to-primary-glow/10 pointer-events-none" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}