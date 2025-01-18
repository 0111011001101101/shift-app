import { useQuery } from "@tanstack/react-query";
import { PageContainer } from "@/components/layout/PageContainer";
import { ModuleCard } from "@/components/learn/ModuleCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

export default function Learn() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: modules, isLoading } = useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      const { data: modules, error } = await supabase
        .from('modules')
        .select(`
          *,
          module_sections(id),
          module_progress(completed)
        `);

      if (error) throw error;

      return modules.map(module => ({
        ...module,
        progress: module.module_progress?.length 
          ? (module.module_progress.filter(p => p.completed).length / module.module_sections.length) * 100
          : 0
      }));
    }
  });

  const filteredModules = modules?.filter(module =>
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer className="max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Learn & Grow
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Explore curated content designed to help you overcome challenges and achieve your goals
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search modules..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-[180px] w-full" />
            <Skeleton className="h-[180px] w-full" />
            <Skeleton className="h-[180px] w-full" />
            <Skeleton className="h-[180px] w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModules?.map((module) => (
              <ModuleCard
                key={module.id}
                id={module.id}
                title={module.title}
                description={module.description}
                estimatedMinutes={module.estimated_minutes}
                progress={Math.round(module.progress)}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}