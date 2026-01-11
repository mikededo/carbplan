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
      generate_slug: { Args: { input: string }, Returns: string }
    }
    Enums: {
      sex: 'female' | 'male'
      product_form:
        | 'bar' |
        'capsule' |
        'chew' |
        'drink_mix' |
        'gel' |
        'liquid' |
        'powder' |
        'solid'
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
      favorite_brands: {
        Relationships: [
          {
            columns: ['athlete_id']
            foreignKeyName: 'favorite_brands_athlete_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'athletes'
          },
          {
            columns: ['athlete_id']
            foreignKeyName: 'favorite_brands_athlete_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'current_athlete'
          },
          {
            columns: ['brand_id']
            foreignKeyName: 'favorite_brands_brand_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'brands'
          },
          {
            columns: ['brand_id']
            foreignKeyName: 'favorite_brands_brand_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'catalog_brands'
          }
        ]
        Row: {
          athlete_id: string
          brand_id: string
          created_at: string
        }
        Insert: {
          athlete_id: string
          brand_id: string
          created_at?: string
        }
        Update: {
          athlete_id?: string
          brand_id?: string
          created_at?: string
        }
      }
      favorite_products: {
        Relationships: [
          {
            columns: ['athlete_id']
            foreignKeyName: 'favorite_products_athlete_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'athletes'
          },
          {
            columns: ['athlete_id']
            foreignKeyName: 'favorite_products_athlete_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'current_athlete'
          },
          {
            columns: ['product_id']
            foreignKeyName: 'favorite_products_product_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'catalog_products'
          },
          {
            columns: ['product_id']
            foreignKeyName: 'favorite_products_product_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'products'
          }
        ]
        Row: {
          athlete_id: string
          created_at: string
          product_id: string
        }
        Insert: {
          athlete_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          athlete_id?: string
          created_at?: string
          product_id?: string
        }
      }
      products: {
        Relationships: [
          {
            columns: ['brand_id']
            foreignKeyName: 'products_brand_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'brands'
          },
          {
            columns: ['brand_id']
            foreignKeyName: 'products_brand_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'catalog_brands'
          }
        ]
        Row: {
          brand_id: string
          caffeine_mg: null | number
          carbs_g: null | number
          created_at: string
          fat_g: null | number
          id: string
          is_active: boolean
          name: string
          serving_size: number
          serving_unit: string
          servings_per_package: null | number
          slug: string
          sugar_g: null | number
          updated_at: string
          calories: null | number
          flavor: null | string
          form: Database['public']['Enums']['product_form']
          notes: null | string
          protein_g: null | number
          sodium_mg: null | number
        }
        Insert: {
          brand_id: string
          name: string
          serving_size: number
          slug: string
          form: Database['public']['Enums']['product_form']
          caffeine_mg?: null | number
          carbs_g?: null | number
          created_at?: string
          fat_g?: null | number
          id?: string
          is_active?: boolean
          serving_unit?: string
          servings_per_package?: null | number
          sugar_g?: null | number
          updated_at?: string
          calories?: null | number
          flavor?: null | string
          notes?: null | string
          protein_g?: null | number
          sodium_mg?: null | number
        }
        Update: {
          brand_id?: string
          caffeine_mg?: null | number
          carbs_g?: null | number
          created_at?: string
          fat_g?: null | number
          id?: string
          is_active?: boolean
          name?: string
          serving_size?: number
          serving_unit?: string
          servings_per_package?: null | number
          slug?: string
          sugar_g?: null | number
          updated_at?: string
          calories?: null | number
          flavor?: null | string
          form?: Database['public']['Enums']['product_form']
          notes?: null | string
          protein_g?: null | number
          sodium_mg?: null | number
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
          is_admin: boolean
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
          is_admin?: boolean
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
          is_admin?: boolean
          max_carb_intake_g_per_hr?: null | number
          sex?: Database['public']['Enums']['sex'] | null
          updated_at?: string
          weight_kg?: null | number
          hr_zones?: Json | null
          power_zones?: Json | null
        }
      }
      brands: {
        Relationships: []
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
          website: null | string
          description: null | string
          logo_url: null | string
        }
        Insert: {
          name: string
          slug: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          website?: null | string
          description?: null | string
          logo_url?: null | string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
          website?: null | string
          description?: null | string
          logo_url?: null | string
        }
      }
    }
    Views: {
      catalog_brands: {
        Relationships: []
        Row: {
          created_at: null | string
          id: null | string
          is_active: boolean | null
          name: null | string
          slug: null | string
          updated_at: null | string
          website: null | string
          description: null | string
          is_favorite: boolean | null
          logo_url: null | string
          product_count: null | number
        }
        Insert: {
          created_at?: null | string
          id?: null | string
          is_active?: boolean | null
          name?: null | string
          slug?: null | string
          updated_at?: null | string
          website?: null | string
          description?: null | string
          is_favorite?: never
          logo_url?: null | string
          product_count?: never
        }
        Update: {
          created_at?: null | string
          id?: null | string
          is_active?: boolean | null
          name?: null | string
          slug?: null | string
          updated_at?: null | string
          website?: null | string
          description?: null | string
          is_favorite?: never
          logo_url?: null | string
          product_count?: never
        }
      }
      catalog_products: {
        Relationships: [
          {
            columns: ['brand_id']
            foreignKeyName: 'products_brand_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'brands'
          },
          {
            columns: ['brand_id']
            foreignKeyName: 'products_brand_id_fkey'
            isOneToOne: false
            referencedColumns: ['id']
            referencedRelation: 'catalog_brands'
          }
        ]
        Row: {
          brand_id: null | string
          brand_name: null | string
          brand_slug: null | string
          caffeine_mg: null | number
          carbs_g: null | number
          created_at: null | string
          fat_g: null | number
          id: null | string
          is_active: boolean | null
          name: null | string
          serving_size: null | number
          serving_unit: null | string
          servings_per_package: null | number
          slug: null | string
          sugar_g: null | number
          updated_at: null | string
          brand_logo_url: null | string
          calories: null | number
          flavor: null | string
          form: Database['public']['Enums']['product_form'] | null
          is_favorite: boolean | null
          notes: null | string
          protein_g: null | number
          sodium_mg: null | number
        }
      }
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
          is_admin: boolean | null
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
          is_admin?: boolean | null
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
          is_admin?: boolean | null
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
      product_form: [
        'gel',
        'bar',
        'chew',
        'drink_mix',
        'powder',
        'capsule',
        'liquid',
        'solid'
      ],
      sex: ['male', 'female']
    }
  }
} as const

/** Auto-generated table types */
export type Athlete = Tables<'athletes'>
export type AthleteInsert = TablesInsert<'athletes'>
export type AthleteUpdate = TablesUpdate<'athletes'>

export type Brand = Tables<'brands'>
export type BrandInsert = TablesInsert<'brands'>
export type BrandUpdate = TablesUpdate<'brands'>

export type CoachingRelationship = Tables<'coaching_relationships'>
export type CoachingRelationshipInsert = TablesInsert<'coaching_relationships'>
export type CoachingRelationshipUpdate = TablesUpdate<'coaching_relationships'>

export type FavoriteBrand = Tables<'favorite_brands'>
export type FavoriteBrandInsert = TablesInsert<'favorite_brands'>
export type FavoriteBrandUpdate = TablesUpdate<'favorite_brands'>

export type FavoriteProduct = Tables<'favorite_products'>
export type FavoriteProductInsert = TablesInsert<'favorite_products'>
export type FavoriteProductUpdate = TablesUpdate<'favorite_products'>

export type Product = Tables<'products'>
export type ProductInsert = TablesInsert<'products'>
export type ProductUpdate = TablesUpdate<'products'>

export type CatalogBrand = Tables<'catalog_brands'>

export type CatalogProduct = Tables<'catalog_products'>

export type CurrentAthlete = Tables<'current_athlete'>

export enum ProductForm {
  Bar = 'bar',
  Capsule = 'capsule',
  Chew = 'chew',
  DrinkMix = 'drink_mix',
  Gel = 'gel',
  Liquid = 'liquid',
  Powder = 'powder',
  Solid = 'solid'
}
export type ProductFormType = Enums<'product_form'>

export enum Sex {
  Female = 'female',
  Male = 'male'
}
export type SexType = Enums<'sex'>
