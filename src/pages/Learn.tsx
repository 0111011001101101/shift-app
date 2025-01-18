import { useQuery } from "@tanstack/react-query";
import { PageContainer } from "@/components/layout/PageContainer";
import { ModuleCard } from "@/components/learn/ModuleCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, GraduationCap, Brain } from "lucide-react";

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
      <div className="space-y-8 animate-fadeIn">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-secondary blur-md opacity-75" />
              <div className="relative bg-white dark:bg-gray-800 rounded-full p-4">
                <Brain className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2">
            <GraduationCap className="h-8 w-8" />
            Learn & Grow
          </h1>
          <p className="text-base text-muted-foreground max-w-md mx-auto">
            Explore curated content designed to help you overcome challenges and achieve your goals
          </p>
        </div>

        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search modules..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 animate-pulse">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
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