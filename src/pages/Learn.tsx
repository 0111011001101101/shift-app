import { useQuery } from "@tanstack/react-query";
import { PageContainer } from "@/components/layout/PageContainer";
import { ModuleCard } from "@/components/learn/ModuleCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function Learn() {
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

  return (
    <PageContainer>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Learn</h1>
          <p className="text-sm text-muted-foreground">
            Explore curated content to help you grow and overcome challenges
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[140px] w-full" />
            <Skeleton className="h-[140px] w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {modules?.map((module) => (
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