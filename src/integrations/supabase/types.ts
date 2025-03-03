export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      goal_tags: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goal_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          category: string | null
          completed: boolean | null
          created_at: string
          deadline: string | null
          id: string
          last_reminder_sent: string | null
          position: number | null
          reminder_enabled: boolean | null
          reminder_frequency: string | null
          timeframe: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          completed?: boolean | null
          created_at?: string
          deadline?: string | null
          id?: string
          last_reminder_sent?: string | null
          position?: number | null
          reminder_enabled?: boolean | null
          reminder_frequency?: string | null
          timeframe?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          completed?: boolean | null
          created_at?: string
          deadline?: string | null
          id?: string
          last_reminder_sent?: string | null
          position?: number | null
          reminder_enabled?: boolean | null
          reminder_frequency?: string | null
          timeframe?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goals_tags: {
        Row: {
          goal_id: string
          tag_id: string
        }
        Insert: {
          goal_id: string
          tag_id: string
        }
        Update: {
          goal_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_tags_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "goal_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      hurdle_history: {
        Row: {
          created_at: string
          hurdle_id: string | null
          id: string
          notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hurdle_id?: string | null
          id?: string
          notes?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hurdle_id?: string | null
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hurdle_history_hurdle_id_fkey"
            columns: ["hurdle_id"]
            isOneToOne: false
            referencedRelation: "hurdles"
            referencedColumns: ["id"]
          },
        ]
      }
      hurdle_suggestions: {
        Row: {
          created_at: string
          hurdle_id: string | null
          id: string
          is_implemented: boolean | null
          suggestion: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hurdle_id?: string | null
          id?: string
          is_implemented?: boolean | null
          suggestion: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hurdle_id?: string | null
          id?: string
          is_implemented?: boolean | null
          suggestion?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hurdle_suggestions_hurdle_id_fkey"
            columns: ["hurdle_id"]
            isOneToOne: false
            referencedRelation: "hurdles"
            referencedColumns: ["id"]
          },
        ]
      }
      hurdles: {
        Row: {
          category: string | null
          completed: boolean | null
          created_at: string
          id: string
          position: number | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          completed?: boolean | null
          created_at?: string
          id?: string
          position?: number | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          completed?: boolean | null
          created_at?: string
          id?: string
          position?: number | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hurdles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      module_progress: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          module_id: string
          section_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          module_id: string
          section_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          module_id?: string
          section_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_progress_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "module_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      module_sections: {
        Row: {
          content: string
          created_at: string
          id: string
          module_id: string
          position: number
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          module_id: string
          position?: number
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          module_id?: string
          position?: number
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_sections_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          created_at: string
          description: string
          estimated_minutes: number
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          estimated_minutes?: number
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          estimated_minutes?: number
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ai_preferences: Json | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          last_stand_up: string | null
          onboarding_completed: boolean | null
          preferences: Json | null
          stand_up_time: string | null
          streak: number | null
          updated_at: string
          view_mode: string | null
        }
        Insert: {
          ai_preferences?: Json | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          last_stand_up?: string | null
          onboarding_completed?: boolean | null
          preferences?: Json | null
          stand_up_time?: string | null
          streak?: number | null
          updated_at?: string
          view_mode?: string | null
        }
        Update: {
          ai_preferences?: Json | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          last_stand_up?: string | null
          onboarding_completed?: boolean | null
          preferences?: Json | null
          stand_up_time?: string | null
          streak?: number | null
          updated_at?: string
          view_mode?: string | null
        }
        Relationships: []
      }
      solutions: {
        Row: {
          completed: boolean | null
          created_at: string
          frequency: string | null
          hurdle_id: string | null
          id: string
          position: number | null
          title: string
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          frequency?: string | null
          hurdle_id?: string | null
          id?: string
          position?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          frequency?: string | null
          hurdle_id?: string | null
          id?: string
          position?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "solutions_hurdle_id_fkey"
            columns: ["hurdle_id"]
            isOneToOne: false
            referencedRelation: "hurdles"
            referencedColumns: ["id"]
          },
        ]
      }
      stand_ups: {
        Row: {
          completed: boolean | null
          created_at: string
          draft_focus: string | null
          draft_hurdles: string | null
          draft_wins: string | null
          focus: string | null
          hurdles: string | null
          id: string
          last_edited_at: string | null
          mental_health: number | null
          user_id: string | null
          wins: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          draft_focus?: string | null
          draft_hurdles?: string | null
          draft_wins?: string | null
          focus?: string | null
          hurdles?: string | null
          id?: string
          last_edited_at?: string | null
          mental_health?: number | null
          user_id?: string | null
          wins?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          draft_focus?: string | null
          draft_hurdles?: string | null
          draft_wins?: string | null
          focus?: string | null
          hurdles?: string | null
          id?: string
          last_edited_at?: string | null
          mental_health?: number | null
          user_id?: string | null
          wins?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stand_ups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_goals: {
        Row: {
          category: string | null
          completed: boolean | null
          created_at: string
          due_date: string | null
          frequency: string | null
          goal_id: string | null
          id: string
          importance: number | null
          notes: string | null
          position: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          completed?: boolean | null
          created_at?: string
          due_date?: string | null
          frequency?: string | null
          goal_id?: string | null
          id?: string
          importance?: number | null
          notes?: string | null
          position?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          completed?: boolean | null
          created_at?: string
          due_date?: string | null
          frequency?: string | null
          goal_id?: string | null
          id?: string
          importance?: number | null
          notes?: string | null
          position?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_goals_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      todos: {
        Row: {
          completed: boolean | null
          created_at: string
          frequency: string | null
          goal_id: string | null
          id: string
          text: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          frequency?: string | null
          goal_id?: string | null
          id?: string
          text: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          frequency?: string | null
          goal_id?: string | null
          id?: string
          text?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "todos_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
