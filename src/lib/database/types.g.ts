export type Json =
  | { [key: string]: Json | undefined } |
  boolean |
  Json[] |
  null |
  number |
  string

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1'
  }
  graphql_public: {
    CompositeTypes: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Returns: Json
        Args: {
          query?: string
          variables?: Json
          extensions?: Json
          operationName?: string
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
  }
  public: {
    CompositeTypes: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      sex: 'female' | 'male'
    }
    Tables: {
      coaching_relationships: {
        Relationships: [
          {
            columns: ['athlete_id']
            foreignKeyName: 'coaching_relationships_athlete_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'athletes'
          },
          {
            columns: ['athlete_id']
            foreignKeyName: 'coaching_relationships_athlete_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'current_athlete'
          },
          {
            columns: ['coach_id']
            foreignKeyName: 'coaching_relationships_coach_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'athletes'
          },
          {
            columns: ['coach_id']
            foreignKeyName: 'coaching_relationships_coach_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'current_athlete'
          }
        ]
        Row: {
          accepted_at: null | string
          athlete_id: string
          created_at: string
          id: string
          coach_id: string
        }
        Insert: {
          athlete_id: string
          coach_id: string
          accepted_at?: null | string
          created_at?: string
          id?: string
        }
        Update: {
          accepted_at?: null | string
          athlete_id?: string
          created_at?: string
          id?: string
          coach_id?: string
        }
      }
      athletes: {
        Relationships: []
        Row: {
          avatar_url: null | string
          created_at: string
          email: string
          ftp: null | number
          full_name: null | string
          height_cm: null | number
          hr_max: null | number
          hr_rest: null | number
          id: string
          max_carb_intake_g_per_hr: null | number
          sex: Database['public']['Enums']['sex'] | null
          updated_at: string
          weight_kg: null | number
          hr_zones: Json | null
          power_zones: Json | null
        }
        Insert: {
          email: string
          id: string
          avatar_url?: null | string
          created_at?: string
          ftp?: null | number
          full_name?: null | string
          height_cm?: null | number
          hr_max?: null | number
          hr_rest?: null | number
          max_carb_intake_g_per_hr?: null | number
          sex?: Database['public']['Enums']['sex'] | null
          updated_at?: string
          weight_kg?: null | number
          hr_zones?: Json | null
          power_zones?: Json | null
        }
        Update: {
          avatar_url?: null | string
          created_at?: string
          email?: string
          ftp?: null | number
          full_name?: null | string
          height_cm?: null | number
          hr_max?: null | number
          hr_rest?: null | number
          id?: string
          max_carb_intake_g_per_hr?: null | number
          sex?: Database['public']['Enums']['sex'] | null
          updated_at?: string
          weight_kg?: null | number
          hr_zones?: Json | null
          power_zones?: Json | null
        }
      }
    }
    Views: {
      current_athlete: {
        Relationships: []
        Row: {
          avatar_url: null | string
          created_at: null | string
          email: null | string
          ftp: null | number
          full_name: null | string
          height_cm: null | number
          hr_max: null | number
          hr_rest: null | number
          id: null | string
          max_carb_intake_g_per_hr: null | number
          sex: Database['public']['Enums']['sex'] | null
          updated_at: null | string
          weight_kg: null | number
          hr_zones: Json | null
          power_zones: Json | null
        }
        Insert: {
          avatar_url?: null | string
          created_at?: null | string
          email?: null | string
          ftp?: null | number
          full_name?: null | string
          height_cm?: null | number
          hr_max?: null | number
          hr_rest?: null | number
          id?: null | string
          max_carb_intake_g_per_hr?: null | number
          sex?: Database['public']['Enums']['sex'] | null
          updated_at?: null | string
          weight_kg?: null | number
          hr_zones?: Json | null
          power_zones?: Json | null
        }
        Update: {
          avatar_url?: null | string
          created_at?: null | string
          email?: null | string
          ftp?: null | number
          full_name?: null | string
          height_cm?: null | number
          hr_max?: null | number
          hr_rest?: null | number
          id?: null | string
          max_carb_intake_g_per_hr?: null | number
          sex?: Database['public']['Enums']['sex'] | null
          updated_at?: null | string
          weight_kg?: null | number
          hr_zones?: Json | null
          power_zones?: Json | null
        }
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | { schema: keyof DatabaseWithoutInternals } |
  keyof (DefaultSchema['Tables'] & DefaultSchema['Views']),
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
      ? R
      : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
    DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
      DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
        ? R
        : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | { schema: keyof DatabaseWithoutInternals } |
  keyof DefaultSchema['Tables'],
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I
  }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | { schema: keyof DatabaseWithoutInternals } |
  keyof DefaultSchema['Tables'],
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U
  }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | { schema: keyof DatabaseWithoutInternals } |
  keyof DefaultSchema['Enums'],
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | { schema: keyof DatabaseWithoutInternals } |
  keyof DefaultSchema['CompositeTypes'],
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {}
  },
  public: {
    Enums: {
      sex: ['male', 'female']
    }
  }
} as const
