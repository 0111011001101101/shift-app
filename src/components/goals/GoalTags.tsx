
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
  color: string;
}

interface GoalTagsProps {
  goalId?: string;
  tags?: string[]; // Add support for direct tags array
  onTagsChange?: () => void;
}

export function GoalTags({ goalId, tags: directTags, onTagsChange }: GoalTagsProps) {
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tags, isLoading } = useQuery({
    queryKey: ["goalTags", goalId],
    queryFn: async () => {
      // If we have direct tags or no goalId, don't fetch from the database
      if (directTags || !goalId) {
        return directTags?.map(tag => ({
          id: tag,
          name: tag,
          color: ""
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
    return <div className="animate-pulse h-8 bg-muted rounded" />;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags?.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            <Tag className="w-3 h-3" />
            {tag.name}
            {goalId && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeTagMutation.mutate(tag.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </Badge>
        ))}
        {goalId && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setShowAddTag(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
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
            className="h-8 text-sm"
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
            className="h-8"
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
