// Auto-generated from the Supabase schema via `generate_typescript_types`.
// Regenerate after every migration — do not hand-edit.

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
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          company_id: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          company_id: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          company_id?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      boq_items: {
        Row: {
          accommodation: number
          company_id: string
          contingency: number
          created_at: string
          description: string
          freight: number
          gross_profit: number
          id: string
          import_costs: number
          insurance: number
          labour: number
          markup_percent: number
          net_profit: number
          overheads: number
          product_id: string | null
          quantity: number
          risk: number
          selling_price: number
          sort_order: number
          supplier_cost: number
          support: number
          tender_id: string
          travel: number
          unit: string | null
          updated_at: string
          vat_percent: number
          warranty: number
        }
        Insert: {
          accommodation?: number
          company_id: string
          contingency?: number
          created_at?: string
          description: string
          freight?: number
          gross_profit?: number
          id?: string
          import_costs?: number
          insurance?: number
          labour?: number
          markup_percent?: number
          net_profit?: number
          overheads?: number
          product_id?: string | null
          quantity?: number
          risk?: number
          selling_price?: number
          sort_order?: number
          supplier_cost?: number
          support?: number
          tender_id: string
          travel?: number
          unit?: string | null
          updated_at?: string
          vat_percent?: number
          warranty?: number
        }
        Update: {
          accommodation?: number
          company_id?: string
          contingency?: number
          created_at?: string
          description?: string
          freight?: number
          gross_profit?: number
          id?: string
          import_costs?: number
          insurance?: number
          labour?: number
          markup_percent?: number
          net_profit?: number
          overheads?: number
          product_id?: string | null
          quantity?: number
          risk?: number
          selling_price?: number
          sort_order?: number
          supplier_cost?: number
          support?: number
          tender_id?: string
          travel?: number
          unit?: string | null
          updated_at?: string
          vat_percent?: number
          warranty?: number
        }
        Relationships: [
          {
            foreignKeyName: "boq_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boq_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boq_items_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          id: string
          name: string
          settings: Json
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          settings?: Json
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          settings?: Json
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      crm_contacts: {
        Row: {
          company_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          organization: string | null
          phone: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          organization?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          organization?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: Database["public"]["Enums"]["document_category"]
          company_id: string
          created_at: string
          file_size: number | null
          id: string
          mime_type: string | null
          name: string
          storage_path: string
          supplier_id: string | null
          tender_id: string | null
          uploaded_by: string | null
          version: number
        }
        Insert: {
          category: Database["public"]["Enums"]["document_category"]
          company_id: string
          created_at?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name: string
          storage_path: string
          supplier_id?: string | null
          tender_id?: string | null
          uploaded_by?: string | null
          version?: number
        }
        Update: {
          category?: Database["public"]["Enums"]["document_category"]
          company_id?: string
          created_at?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name?: string
          storage_path?: string
          supplier_id?: string | null
          tender_id?: string | null
          uploaded_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          company_id: string
          created_at: string
          id: string
          is_read: boolean
          profile_id: string
          related_tender_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          body?: string | null
          company_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          profile_id: string
          related_tender_id?: string | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          body?: string | null
          company_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          profile_id?: string
          related_tender_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_tender_id_fkey"
            columns: ["related_tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          availability: string | null
          category: string | null
          company_id: string
          cost: number | null
          created_at: string
          currency: string
          description: string
          id: string
          manufacturer: string | null
          sku: string | null
          source_document_id: string | null
          supplier_id: string | null
          updated_at: string
          version: number
        }
        Insert: {
          availability?: string | null
          category?: string | null
          company_id: string
          cost?: number | null
          created_at?: string
          currency?: string
          description: string
          id?: string
          manufacturer?: string | null
          sku?: string | null
          source_document_id?: string | null
          supplier_id?: string | null
          updated_at?: string
          version?: number
        }
        Update: {
          availability?: string | null
          category?: string | null
          company_id?: string
          cost?: number | null
          created_at?: string
          currency?: string
          description?: string
          id?: string
          manufacturer?: string | null
          sku?: string | null
          source_document_id?: string | null
          supplier_id?: string | null
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_source_document_id_fkey"
            columns: ["source_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string
          created_at: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_id: string
          created_at?: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string
          created_at?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          company_id: string
          created_at: string
          end_date: string | null
          id: string
          name: string
          notes: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          tender_id: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          name: string
          notes?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          tender_id?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          tender_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_contacts: {
        Row: {
          company_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          role: string | null
          supplier_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          role?: string | null
          supplier_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          role?: string | null
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_contacts_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          company_id: string
          created_at: string
          credit_terms: string | null
          id: string
          lead_time_days: number | null
          name: string
          notes: string | null
          performance_rating: number | null
          registration_number: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          credit_terms?: string | null
          id?: string
          lead_time_days?: number | null
          name: string
          notes?: string | null
          performance_rating?: number | null
          registration_number?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          credit_terms?: string | null
          id?: string
          lead_time_days?: number | null
          name?: string
          notes?: string | null
          performance_rating?: number | null
          registration_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_checklist_items: {
        Row: {
          company_id: string
          created_at: string
          id: string
          is_complete: boolean
          is_mandatory: boolean
          label: string
          tender_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          is_complete?: boolean
          is_mandatory?: boolean
          label: string
          tender_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          is_complete?: boolean
          is_mandatory?: boolean
          label?: string
          tender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_checklist_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tender_checklist_items_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_contacts: {
        Row: {
          company_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          role: string | null
          tender_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          role?: string | null
          tender_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          role?: string | null
          tender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tender_contacts_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_notes: {
        Row: {
          author_id: string | null
          body: string
          company_id: string
          created_at: string
          id: string
          tender_id: string
        }
        Insert: {
          author_id?: string | null
          body: string
          company_id: string
          created_at?: string
          id?: string
          tender_id: string
        }
        Update: {
          author_id?: string | null
          body?: string
          company_id?: string
          created_at?: string
          id?: string
          tender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tender_notes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tender_notes_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_submissions: {
        Row: {
          company_id: string
          created_at: string
          id: string
          method: string | null
          notes: string | null
          reference_number: string | null
          submitted_at: string | null
          tender_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          method?: string | null
          notes?: string | null
          reference_number?: string | null
          submitted_at?: string | null
          tender_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          method?: string | null
          notes?: string | null
          reference_number?: string | null
          submitted_at?: string | null
          tender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_submissions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tender_submissions_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_suppliers: {
        Row: {
          company_id: string
          created_at: string
          id: string
          notes: string | null
          status: string | null
          supplier_id: string
          tender_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: string | null
          supplier_id: string
          tender_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          status?: string | null
          supplier_id?: string
          tender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_suppliers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tender_suppliers_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tender_suppliers_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_tasks: {
        Row: {
          assignee_id: string | null
          company_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          status: string
          tender_id: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          company_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string
          tender_id: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          company_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string
          tender_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tender_tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tender_tasks_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_timeline_events: {
        Row: {
          company_id: string
          created_by: string | null
          description: string | null
          event_type: string
          id: string
          occurred_at: string
          tender_id: string
        }
        Insert: {
          company_id: string
          created_by?: string | null
          description?: string | null
          event_type: string
          id?: string
          occurred_at?: string
          tender_id: string
        }
        Update: {
          company_id?: string
          created_by?: string | null
          description?: string | null
          event_type?: string
          id?: string
          occurred_at?: string
          tender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_timeline_events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tender_timeline_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tender_timeline_events_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tenders: {
        Row: {
          briefing_date: string | null
          client: string | null
          closing_date: string | null
          company_id: string
          created_at: string
          created_by: string | null
          department: string | null
          evaluation_method: string | null
          id: string
          is_briefing_compulsory: boolean
          preference_points: string | null
          questions: string | null
          recommendations: string | null
          risks: string | null
          status: Database["public"]["Enums"]["tender_status"]
          submission_method: string | null
          tender_number: string | null
          title: string
          updated_at: string
          warranty_requirements: string | null
        }
        Insert: {
          briefing_date?: string | null
          client?: string | null
          closing_date?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          department?: string | null
          evaluation_method?: string | null
          id?: string
          is_briefing_compulsory?: boolean
          preference_points?: string | null
          questions?: string | null
          recommendations?: string | null
          risks?: string | null
          status?: Database["public"]["Enums"]["tender_status"]
          submission_method?: string | null
          tender_number?: string | null
          title: string
          updated_at?: string
          warranty_requirements?: string | null
        }
        Update: {
          briefing_date?: string | null
          client?: string | null
          closing_date?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          department?: string | null
          evaluation_method?: string | null
          id?: string
          is_briefing_compulsory?: boolean
          preference_points?: string | null
          questions?: string | null
          recommendations?: string | null
          risks?: string | null
          status?: Database["public"]["Enums"]["tender_status"]
          submission_method?: string | null
          tender_number?: string | null
          title?: string
          updated_at?: string
          warranty_requirements?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_company_id: { Args: never; Returns: string }
    }
    Enums: {
      document_category:
        | "tender_mandatory"
        | "tender_technical"
        | "tender_submission"
        | "tender_other"
        | "company_profile"
        | "supplier_agreement"
        | "pricing_policy"
        | "proposal_template"
        | "reference_letter"
        | "technical_document"
        | "past_winning_tender"
        | "certificate"
        | "supplier_price_list"
        | "other"
      notification_type:
        | "closing_date_reminder"
        | "briefing_reminder"
        | "task_due"
        | "tender_status_change"
        | "document_uploaded"
        | "general"
      project_status: "active" | "on_hold" | "completed" | "cancelled"
      subscription_tier: "starter" | "professional" | "business" | "enterprise"
      tender_status:
        | "discovered"
        | "in_progress"
        | "submitted"
        | "won"
        | "lost"
        | "archived"
      user_role: "owner" | "admin" | "member"
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
      document_category: [
        "tender_mandatory",
        "tender_technical",
        "tender_submission",
        "tender_other",
        "company_profile",
        "supplier_agreement",
        "pricing_policy",
        "proposal_template",
        "reference_letter",
        "technical_document",
        "past_winning_tender",
        "certificate",
        "supplier_price_list",
        "other",
      ],
      notification_type: [
        "closing_date_reminder",
        "briefing_reminder",
        "task_due",
        "tender_status_change",
        "document_uploaded",
        "general",
      ],
      project_status: ["active", "on_hold", "completed", "cancelled"],
      subscription_tier: ["starter", "professional", "business", "enterprise"],
      tender_status: [
        "discovered",
        "in_progress",
        "submitted",
        "won",
        "lost",
        "archived",
      ],
      user_role: ["owner", "admin", "member"],
    },
  },
} as const
