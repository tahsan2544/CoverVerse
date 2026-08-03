export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_artwork: {
        Row: {
          created_at: string
          id: string
          image: string
          prompt: string
          style: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image: string
          prompt: string
          style?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image?: string
          prompt?: string
          style?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_generations: {
        Row: {
          client_key: string | null
          created_at: string
          error: string | null
          id: string
          prompt: string | null
          provider: string | null
          success: boolean
          user_id: string | null
        }
        Insert: {
          client_key?: string | null
          created_at?: string
          error?: string | null
          id?: string
          prompt?: string | null
          provider?: string | null
          success?: boolean
          user_id?: string | null
        }
        Update: {
          client_key?: string | null
          created_at?: string
          error?: string | null
          id?: string
          prompt?: string | null
          provider?: string | null
          success?: boolean
          user_id?: string | null
        }
        Relationships: []
      }
      covers: {
        Row: {
          created_at: string
          data: Json
          id: string
          is_draft: boolean
          subject: string | null
          template_id: string
          thumbnail: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          is_draft?: boolean
          subject?: string | null
          template_id: string
          thumbnail?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          is_draft?: boolean
          subject?: string | null
          template_id?: string
          thumbnail?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      custom_templates: {
        Row: {
          categories: string[]
          created_at: string
          created_by: string | null
          font_id: string | null
          id: string
          layout: string
          name: string
          orientation: string
          palette: string
          published: boolean
          slug: string
          tags: string[]
          updated_at: string
        }
        Insert: {
          categories?: string[]
          created_at?: string
          created_by?: string | null
          font_id?: string | null
          id?: string
          layout: string
          name: string
          orientation?: string
          palette: string
          published?: boolean
          slug: string
          tags?: string[]
          updated_at?: string
        }
        Update: {
          categories?: string[]
          created_at?: string
          created_by?: string | null
          font_id?: string | null
          id?: string
          layout?: string
          name?: string
          orientation?: string
          palette?: string
          published?: boolean
          slug?: string
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      export_history: {
        Row: {
          cover_id: string | null
          created_at: string
          dpi: number
          format: string
          id: string
          paper: string
          template_id: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          cover_id?: string | null
          created_at?: string
          dpi?: number
          format?: string
          id?: string
          paper?: string
          template_id?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          cover_id?: string | null
          created_at?: string
          dpi?: number
          format?: string
          id?: string
          paper?: string
          template_id?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "export_history_cover_id_fkey"
            columns: ["cover_id"]
            isOneToOne: false
            referencedRelation: "covers"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          id: string
          kind: string
          message: string
          page: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string
          message: string
          page?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          message?: string
          page?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          blocked: boolean
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          institution: string | null
          last_seen_at: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          blocked?: boolean
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          institution?: string | null
          last_seen_at?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          blocked?: boolean
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          institution?: string | null
          last_seen_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          ai_daily_limit_guest: number
          ai_daily_limit_user: number
          ai_enabled: boolean
          announcement: string
          announcement_enabled: boolean
          id: boolean
          maintenance_mode: boolean
          signups_enabled: boolean
          site_name: string
          tagline: string
          updated_at: string
        }
        Insert: {
          ai_daily_limit_guest?: number
          ai_daily_limit_user?: number
          ai_enabled?: boolean
          announcement?: string
          announcement_enabled?: boolean
          id?: boolean
          maintenance_mode?: boolean
          signups_enabled?: boolean
          site_name?: string
          tagline?: string
          updated_at?: string
        }
        Update: {
          ai_daily_limit_guest?: number
          ai_daily_limit_user?: number
          ai_enabled?: boolean
          announcement?: string
          announcement_enabled?: boolean
          id?: boolean
          maintenance_mode?: boolean
          signups_enabled?: boolean
          site_name?: string
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          accent: string | null
          created_at: string
          default_dpi: number
          default_format: string
          default_paper: string
          density: string
          email_notifications: boolean
          font_size: string
          inapp_notifications: boolean
          language: string
          sidebar_collapsed: boolean
          theme: string
          updated_at: string
          user_id: string
          watermark: boolean
        }
        Insert: {
          accent?: string | null
          created_at?: string
          default_dpi?: number
          default_format?: string
          default_paper?: string
          density?: string
          email_notifications?: boolean
          font_size?: string
          inapp_notifications?: boolean
          language?: string
          sidebar_collapsed?: boolean
          theme?: string
          updated_at?: string
          user_id: string
          watermark?: boolean
        }
        Update: {
          accent?: string | null
          created_at?: string
          default_dpi?: number
          default_format?: string
          default_paper?: string
          density?: string
          email_notifications?: boolean
          font_size?: string
          inapp_notifications?: boolean
          language?: string
          sidebar_collapsed?: boolean
          theme?: string
          updated_at?: string
          user_id?: string
          watermark?: boolean
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
