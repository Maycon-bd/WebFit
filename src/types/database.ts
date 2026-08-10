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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      anthropometry_entries: {
        Row: {
          body_fat_percentage: number | null
          clinic_id: string
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          height_cm: number | null
          id: string
          measured_at: string
          measurements: Json
          patient_id: string
          recorded_by: string
          updated_at: string
          updated_by: string | null
          weight_kg: number | null
        }
        Insert: {
          body_fat_percentage?: number | null
          clinic_id: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          height_cm?: number | null
          id?: string
          measured_at?: string
          measurements?: Json
          patient_id: string
          recorded_by: string
          updated_at?: string
          updated_by?: string | null
          weight_kg?: number | null
        }
        Update: {
          body_fat_percentage?: number | null
          clinic_id?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          height_cm?: number | null
          id?: string
          measured_at?: string
          measurements?: Json
          patient_id?: string
          recorded_by?: string
          updated_at?: string
          updated_by?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "anthropometry_entries_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anthropometry_entries_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          clinic_id: string
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          duration_minutes: number
          id: string
          mode: Database["public"]["Enums"]["appointment_mode"]
          notes: string | null
          patient_id: string
          professional_id: string
          starts_at: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          clinic_id: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          duration_minutes?: number
          id?: string
          mode?: Database["public"]["Enums"]["appointment_mode"]
          notes?: string | null
          patient_id: string
          professional_id: string
          starts_at: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          clinic_id?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          duration_minutes?: number
          id?: string
          mode?: Database["public"]["Enums"]["appointment_mode"]
          notes?: string | null
          patient_id?: string
          professional_id?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          clinic_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: number
          metadata: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          clinic_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: never
          metadata?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          clinic_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: never
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_members: {
        Row: {
          active: boolean
          clinic_id: string
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          role: Database["public"]["Enums"]["clinic_member_role"]
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          active?: boolean
          clinic_id: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          role?: Database["public"]["Enums"]["clinic_member_role"]
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          active?: boolean
          clinic_id?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          role?: Database["public"]["Enums"]["clinic_member_role"]
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinic_members_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      clinics: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          name: string
          owner_id: string
          slug: string
          timezone: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          name: string
          owner_id: string
          slug: string
          timezone?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          name?: string
          owner_id?: string
          slug?: string
          timezone?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          clinic_id: string
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          patient_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          clinic_id: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          patient_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          clinic_id?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          patient_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          amount: number
          client_name: string
          clinic_id: string
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          paid_at: string | null
          patient_id: string | null
          payment_method: string
          status: Database["public"]["Enums"]["financial_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          amount: number
          client_name: string
          clinic_id: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          paid_at?: string | null
          patient_id?: string | null
          payment_method: string
          status?: Database["public"]["Enums"]["financial_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          amount?: number
          client_name?: string
          clinic_id?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          paid_at?: string | null
          patient_id?: string | null
          payment_method?: string
          status?: Database["public"]["Enums"]["financial_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          clinic_id: string
          conversation_id: string
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          read_at: string | null
          sender_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body: string
          clinic_id: string
          conversation_id: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          read_at?: string | null
          sender_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body?: string
          clinic_id?: string
          conversation_id?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          read_at?: string | null
          sender_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          clinic_id: string
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          payload: Json
          read_at: string | null
          recipient_id: string
          title: string
          type: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body?: string | null
          clinic_id: string
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          payload?: Json
          read_at?: string | null
          recipient_id: string
          title: string
          type: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body?: string | null
          clinic_id?: string
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          payload?: Json
          read_at?: string | null
          recipient_id?: string
          title?: string
          type?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          birth_date: string | null
          clinic_id: string
          clinical_notes: string | null
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          document_number: string | null
          email: string | null
          full_name: string
          gender: string | null
          id: string
          phone: string | null
          preferred_name: string | null
          status: string
          tags: string[]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          birth_date?: string | null
          clinic_id: string
          clinical_notes?: string | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          document_number?: string | null
          email?: string | null
          full_name: string
          gender?: string | null
          id?: string
          phone?: string | null
          preferred_name?: string | null
          status?: string
          tags?: string[]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          birth_date?: string | null
          clinic_id?: string
          clinical_notes?: string | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          document_number?: string | null
          email?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          phone?: string | null
          preferred_name?: string | null
          status?: string
          tags?: string[]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      planner_tasks: {
        Row: {
          assignee_id: string
          clinic_id: string
          completed_at: string | null
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          due_date: string
          id: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          assignee_id: string
          clinic_id: string
          completed_at?: string | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          due_date: string
          id?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          assignee_id?: string
          clinic_id?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          due_date?: string
          id?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "planner_tasks_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          author_id: string
          clinic_id: string
          content: Json
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          issued_at: string
          patient_id: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          author_id: string
          clinic_id: string
          content?: Json
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          issued_at?: string
          patient_id: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          author_id?: string
          clinic_id?: string
          content?: Json
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          issued_at?: string
          patient_id?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_clinic_id_fkey"
            columns: ["clinic_id"]
            isOneToOne: false
            referencedRelation: "clinics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_path: string | null
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          display_name: string
          id: string
          phone: string | null
          professional_license: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          display_name?: string
          id: string
          phone?: string | null
          professional_license?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          avatar_path?: string | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          display_name?: string
          id?: string
          phone?: string | null
          professional_license?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      appointment_mode: "in_person" | "online"
      appointment_status:
        | "scheduled"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "no_show"
      clinic_member_role: "owner" | "nutritionist" | "assistant"
      financial_status: "pending" | "paid" | "cancelled" | "refunded"
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
      appointment_mode: ["in_person", "online"],
      appointment_status: [
        "scheduled",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
      ],
      clinic_member_role: ["owner", "nutritionist", "assistant"],
      financial_status: ["pending", "paid", "cancelled", "refunded"],
    },
  },
} as const

