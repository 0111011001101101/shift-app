
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Tag } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GoalTag {
  id: string;
  name: string;
  color?: string;
}

interface GoalTagsProps {
  goalId?: string;
  tags?: string[]; // Support for direct tags array
  onTagsChange?: () => void;
  readOnly?: boolean;
}

export function GoalTags({ goalId, tags: directTags, onTagsChange, readOnly = false }: GoalTagsProps) {
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tags, isLoading } = useQuery({
    queryKey: ["goalTags", goalId, directTags],
    queryFn: async () => {
      // If we have direct tags or no goalId, don't fetch from the database
      if (directTags || !goalId) {
        return directTags?.map(tag => ({
          id: tag,
          name: tag
        })) || [];
      }

      const { data: goalTags, error } = await supabase
        .from("goals_tags")
        .select(`
          tag_id,
          goal_tags (
            id,
            name,
            color
          )
        `)
        .eq("goal_id", goalId);

      if (error) throw error;
      return goalTags.map((gt: any) => gt.goal_tags) as GoalTag[];
    },
    enabled: !!goalId || !!directTags,
  });

  const addTagMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!goalId) return;
      
      // First, create or get the tag
      const { data: existingTags, error: searchError } = await supabase
        .from("goal_tags")
        .select("*")
        .eq("name", name)
        .limit(1);

      if (searchError) throw searchError;

      let tagId;
      if (existingTags?.length === 0) {
        const { data: newTag, error: createError } = await supabase
          .from("goal_tags")
          .insert({ name })
          .select()
          .single();

        if (createError) throw createError;
        tagId = newTag.id;
      } else {
        tagId = existingTags[0].id;
      }

      // Then, associate it with the goal
      const { error: linkError } = await supabase
        .from("goals_tags")
        .insert({ goal_id: goalId, tag_id: tagId });

      if (linkError) throw linkError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goalTags", goalId] });
      setNewTagName("");
      setShowAddTag(false);
      onTagsChange?.();
      toast({
        title: "Tag added",
        description: "The tag has been added to your goal.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding tag",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeTagMutation = useMutation({
    mutationFn: async (tagId: string) => {
      if (!goalId) return;
      
      const { error } = await supabase
        .from("goals_tags")
        .delete()
        .eq("goal_id", goalId)
        .eq("tag_id", tagId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goalTags", goalId] });
      onTagsChange?.();
      toast({
        title: "Tag removed",
        description: "The tag has been removed from your goal.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing tag",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    addTagMutation.mutate(newTagName.trim());
  };

  if (isLoading) {
    return <div className="animate-pulse h-6 bg-muted rounded" />;
  }

  if (!tags?.length && readOnly) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags?.map((tag) => (
          <Badge
            key={tag.id}
            variant="outline"
            className="flex items-center gap-1 px-2 py-0.5 text-xs bg-primary-50/50 text-primary-700 border-primary-100"
          >
            <Tag className="w-2.5 h-2.5" />
            {tag.name}
            {!readOnly && goalId && (
              <Button
                variant="ghost"
                size="sm"
                className="h-3.5 w-3.5 p-0 ml-0.5 hover:bg-transparent"
                onClick={() => removeTagMutation.mutate(tag.id)}
              >
                <X className="h-2.5 w-2.5" />
              </Button>
            )}
          </Badge>
        ))}
        {!readOnly && goalId && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-primary-600 hover:bg-primary-50/50"
            onClick={() => setShowAddTag(true)}
          >
            <Plus className="h-2.5 w-2.5 mr-1" />
            Add Tag
          </Button>
        )}
      </div>
      {showAddTag && goalId && (
        <div className="flex items-center gap-2">
          <Input
            placeholder="Enter tag name..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="h-7 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTag();
              } else if (e.key === "Escape") {
                setShowAddTag(false);
              }
            }}
          />
          <Button
            size="sm"
            className="h-7"
            onClick={handleAddTag}
            disabled={!newTagName.trim()}
          >
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
