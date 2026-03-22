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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      action_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      custom_pricing_config: {
        Row: {
          created_at: string
          effective_from: string
          effective_to: string | null
          guardrail_ack_at: string | null
          guardrail_ack_by: string | null
          id: string
          is_current: boolean
          is_enabled: boolean
          max_token: number
          metadata: Json
          min_token: number
          recommended_price_per_token: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          guardrail_ack_at?: string | null
          guardrail_ack_by?: string | null
          id?: string
          is_current?: boolean
          is_enabled?: boolean
          max_token: number
          metadata?: Json
          min_token: number
          recommended_price_per_token: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          guardrail_ack_at?: string | null
          guardrail_ack_by?: string | null
          id?: string
          is_current?: boolean
          is_enabled?: boolean
          max_token?: number
          metadata?: Json
          min_token?: number
          recommended_price_per_token?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      custom_pricing_tier: {
        Row: {
          config_id: string
          created_at: string
          discount_pct: number
          from_token: number
          id: string
          to_token: number
          updated_at: string
        }
        Insert: {
          config_id: string
          created_at?: string
          discount_pct: number
          from_token: number
          id?: string
          to_token: number
          updated_at?: string
        }
        Update: {
          config_id?: string
          created_at?: string
          discount_pct?: number
          from_token?: number
          id?: string
          to_token?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_pricing_tier_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "custom_pricing_config"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_redemptions: {
        Row: {
          applied_at: string
          applies_to_type: string
          code_snapshot: string
          discount_amount: number
          discount_id: string
          final_amount: number
          id: string
          plan_snapshot: string | null
          reverse_reason: string | null
          reversed_at: string | null
          status: string
          subtotal_amount: number
          transaction_id: string | null
          user_id: string
          user_name: string | null
        }
        Insert: {
          applied_at?: string
          applies_to_type: string
          code_snapshot: string
          discount_amount?: number
          discount_id: string
          final_amount?: number
          id?: string
          plan_snapshot?: string | null
          reverse_reason?: string | null
          reversed_at?: string | null
          status?: string
          subtotal_amount?: number
          transaction_id?: string | null
          user_id: string
          user_name?: string | null
        }
        Update: {
          applied_at?: string
          applies_to_type?: string
          code_snapshot?: string
          discount_amount?: number
          discount_id?: string
          final_amount?: number
          id?: string
          plan_snapshot?: string | null
          reverse_reason?: string | null
          reversed_at?: string | null
          status?: string
          subtotal_amount?: number
          transaction_id?: string | null
          user_id?: string
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discount_redemptions_discount_id_fkey"
            columns: ["discount_id"]
            isOneToOne: false
            referencedRelation: "discounts"
            referencedColumns: ["id"]
          },
        ]
      }
      discounts: {
        Row: {
          applies_to: string
          code: string
          created_at: string
          created_by: string | null
          current_redemptions: number
          description: string | null
          discount_type: string
          ends_at: string | null
          id: string
          max_discount_amount: number | null
          max_redemptions_per_user: number | null
          max_total_redemptions: number | null
          membership_plan_targets: string[] | null
          min_purchase_amount: number | null
          name: string
          priority: number
          stackable: boolean
          starts_at: string | null
          status: string
          topup_targets: string[] | null
          updated_at: string
          updated_by: string | null
          value: number
        }
        Insert: {
          applies_to?: string
          code: string
          created_at?: string
          created_by?: string | null
          current_redemptions?: number
          description?: string | null
          discount_type?: string
          ends_at?: string | null
          id?: string
          max_discount_amount?: number | null
          max_redemptions_per_user?: number | null
          max_total_redemptions?: number | null
          membership_plan_targets?: string[] | null
          min_purchase_amount?: number | null
          name: string
          priority?: number
          stackable?: boolean
          starts_at?: string | null
          status?: string
          topup_targets?: string[] | null
          updated_at?: string
          updated_by?: string | null
          value?: number
        }
        Update: {
          applies_to?: string
          code?: string
          created_at?: string
          created_by?: string | null
          current_redemptions?: number
          description?: string | null
          discount_type?: string
          ends_at?: string | null
          id?: string
          max_discount_amount?: number | null
          max_redemptions_per_user?: number | null
          max_total_redemptions?: number | null
          membership_plan_targets?: string[] | null
          min_purchase_amount?: number | null
          name?: string
          priority?: number
          stackable?: boolean
          starts_at?: string | null
          status?: string
          topup_targets?: string[] | null
          updated_at?: string
          updated_by?: string | null
          value?: number
        }
        Relationships: []
      }
      duration_access_mappings: {
        Row: {
          category: string | null
          created_at: string | null
          entitlement_id: string
          entitlement_key: string
          entitlement_name: string
          id: string
          plan_duration_id: string
          status: string
          usage_quota: number
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          entitlement_id: string
          entitlement_key: string
          entitlement_name: string
          id?: string
          plan_duration_id: string
          status?: string
          usage_quota?: number
        }
        Update: {
          category?: string | null
          created_at?: string | null
          entitlement_id?: string
          entitlement_key?: string
          entitlement_name?: string
          id?: string
          plan_duration_id?: string
          status?: string
          usage_quota?: number
        }
        Relationships: [
          {
            foreignKeyName: "duration_access_mappings_entitlement_id_fkey"
            columns: ["entitlement_id"]
            isOneToOne: false
            referencedRelation: "entitlements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duration_access_mappings_plan_duration_id_fkey"
            columns: ["plan_duration_id"]
            isOneToOne: false
            referencedRelation: "plan_durations"
            referencedColumns: ["id"]
          },
        ]
      }
      entitlements: {
        Row: {
          action_category_id: string
          created_at: string | null
          description: string | null
          feature_id: string
          id: string
          key: string
          level: string
          name: string
          restriction_type: string
          status: string
          sub_feature_id: string | null
          token_cost: number | null
          updated_at: string | null
        }
        Insert: {
          action_category_id: string
          created_at?: string | null
          description?: string | null
          feature_id: string
          id?: string
          key: string
          level?: string
          name: string
          restriction_type?: string
          status?: string
          sub_feature_id?: string | null
          token_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          action_category_id?: string
          created_at?: string | null
          description?: string | null
          feature_id?: string
          id?: string
          key?: string
          level?: string
          name?: string
          restriction_type?: string
          status?: string
          sub_feature_id?: string | null
          token_cost?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entitlements_action_category_id_fkey"
            columns: ["action_category_id"]
            isOneToOne: false
            referencedRelation: "action_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlements_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlements_sub_feature_id_fkey"
            columns: ["sub_feature_id"]
            isOneToOne: false
            referencedRelation: "sub_features"
            referencedColumns: ["id"]
          },
        ]
      }
      features: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          prefix: string
          slug: string
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          prefix: string
          slug: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          prefix?: string
          slug?: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      invoice_settings: {
        Row: {
          base_invoice_url: string | null
          company_address: string | null
          company_name: string
          default_due_days: number
          email_footer_text: string | null
          footer_text: string
          id: string
          invoice_prefix: string
          invoice_reset_rule: string
          invoice_title: string | null
          logo_url: string | null
          notes: string[] | null
          terms_content: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          base_invoice_url?: string | null
          company_address?: string | null
          company_name?: string
          default_due_days?: number
          email_footer_text?: string | null
          footer_text?: string
          id?: string
          invoice_prefix?: string
          invoice_reset_rule?: string
          invoice_title?: string | null
          logo_url?: string | null
          notes?: string[] | null
          terms_content?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          base_invoice_url?: string | null
          company_address?: string | null
          company_name?: string
          default_due_days?: number
          email_footer_text?: string | null
          footer_text?: string
          id?: string
          invoice_prefix?: string
          invoice_reset_rule?: string
          invoice_title?: string | null
          logo_url?: string | null
          notes?: string[] | null
          terms_content?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      membership_notification_settings: {
        Row: {
          email_body_template: string
          email_subject_template: string
          id: string
          is_enabled: boolean
          triggers: string[]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          email_body_template?: string
          email_subject_template?: string
          id?: string
          is_enabled?: boolean
          triggers?: string[]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          email_body_template?: string
          email_subject_template?: string
          id?: string
          is_enabled?: boolean
          triggers?: string[]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      membership_plans: {
        Row: {
          active_users: number | null
          base_price_1m: number | null
          base_token_1m: number | null
          benefits: Json | null
          bonus_token_12m: number | null
          bonus_token_3m: number | null
          bonus_token_6m: number | null
          category: string
          created_at: string | null
          description: string | null
          discount_12m: number | null
          discount_3m: number | null
          discount_6m: number | null
          duration_mode: string | null
          emblem_key: string
          id: string
          name: string
          pricing_mode: string | null
          status: string
          tier_label: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          active_users?: number | null
          base_price_1m?: number | null
          base_token_1m?: number | null
          benefits?: Json | null
          bonus_token_12m?: number | null
          bonus_token_3m?: number | null
          bonus_token_6m?: number | null
          category?: string
          created_at?: string | null
          description?: string | null
          discount_12m?: number | null
          discount_3m?: number | null
          discount_6m?: number | null
          duration_mode?: string | null
          emblem_key?: string
          id: string
          name: string
          pricing_mode?: string | null
          status?: string
          tier_label?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          active_users?: number | null
          base_price_1m?: number | null
          base_token_1m?: number | null
          benefits?: Json | null
          bonus_token_12m?: number | null
          bonus_token_3m?: number | null
          bonus_token_6m?: number | null
          category?: string
          created_at?: string | null
          description?: string | null
          discount_12m?: number | null
          discount_3m?: number | null
          discount_6m?: number | null
          duration_mode?: string | null
          emblem_key?: string
          id?: string
          name?: string
          pricing_mode?: string | null
          status?: string
          tier_label?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      membership_transactions: {
        Row: {
          cancel_note: string | null
          cancel_reason: string | null
          canceled_at: string | null
          change_type: string
          created_at: string
          discount: number
          expires_at: string | null
          from_duration_months: number | null
          from_plan: string | null
          id: string
          invoice_document_url: string | null
          items: Json | null
          paid_at: string | null
          payment_method: string | null
          payment_provider: string | null
          payment_status_display: string | null
          payment_status_raw: string | null
          payment_url: string | null
          primary_status: string
          promo_code: string | null
          subtotal: number
          to_duration_months: number | null
          to_plan: string
          total: number
          transaction_id: string
          user_email: string
          user_id: string
          user_name: string
          xendit_invoice_id: string | null
        }
        Insert: {
          cancel_note?: string | null
          cancel_reason?: string | null
          canceled_at?: string | null
          change_type?: string
          created_at?: string
          discount?: number
          expires_at?: string | null
          from_duration_months?: number | null
          from_plan?: string | null
          id?: string
          invoice_document_url?: string | null
          items?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          payment_provider?: string | null
          payment_status_display?: string | null
          payment_status_raw?: string | null
          payment_url?: string | null
          primary_status?: string
          promo_code?: string | null
          subtotal?: number
          to_duration_months?: number | null
          to_plan?: string
          total?: number
          transaction_id: string
          user_email: string
          user_id: string
          user_name: string
          xendit_invoice_id?: string | null
        }
        Update: {
          cancel_note?: string | null
          cancel_reason?: string | null
          canceled_at?: string | null
          change_type?: string
          created_at?: string
          discount?: number
          expires_at?: string | null
          from_duration_months?: number | null
          from_plan?: string | null
          id?: string
          invoice_document_url?: string | null
          items?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          payment_provider?: string | null
          payment_status_display?: string | null
          payment_status_raw?: string | null
          payment_url?: string | null
          primary_status?: string
          promo_code?: string | null
          subtotal?: number
          to_duration_months?: number | null
          to_plan?: string
          total?: number
          transaction_id?: string
          user_email?: string
          user_id?: string
          user_name?: string
          xendit_invoice_id?: string | null
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          cancel_note: string | null
          cancel_reason: string | null
          canceled_at: string | null
          change_type: string
          created_at: string
          discount_amount: number
          duration_credit: number
          duration_id: string | null
          expires_at: string | null
          from_duration_months: number | null
          from_plan: string | null
          id: string
          items: Json | null
          membership_id: string | null
          merchant_ref: string | null
          paid_at: string | null
          pay_code: string | null
          payment_callback_data: Json | null
          payment_external_id: string | null
          payment_method: string | null
          payment_provider: string | null
          payment_status: string
          payment_url: string | null
          plan_id: string | null
          primary_status: string | null
          promo_code: string | null
          subtotal_amount: number
          to_duration_months: number
          to_plan: string
          total_amount: number
          transaction_id: string
          updated_at: string
          user_email: string | null
          user_id: string
          user_name: string | null
        }
        Insert: {
          cancel_note?: string | null
          cancel_reason?: string | null
          canceled_at?: string | null
          change_type?: string
          created_at?: string
          discount_amount?: number
          duration_credit?: number
          duration_id?: string | null
          expires_at?: string | null
          from_duration_months?: number | null
          from_plan?: string | null
          id?: string
          items?: Json | null
          membership_id?: string | null
          merchant_ref?: string | null
          paid_at?: string | null
          pay_code?: string | null
          payment_callback_data?: Json | null
          payment_external_id?: string | null
          payment_method?: string | null
          payment_provider?: string | null
          payment_status?: string
          payment_url?: string | null
          plan_id?: string | null
          primary_status?: string | null
          promo_code?: string | null
          subtotal_amount?: number
          to_duration_months?: number
          to_plan?: string
          total_amount?: number
          transaction_id: string
          updated_at?: string
          user_email?: string | null
          user_id: string
          user_name?: string | null
        }
        Update: {
          cancel_note?: string | null
          cancel_reason?: string | null
          canceled_at?: string | null
          change_type?: string
          created_at?: string
          discount_amount?: number
          duration_credit?: number
          duration_id?: string | null
          expires_at?: string | null
          from_duration_months?: number | null
          from_plan?: string | null
          id?: string
          items?: Json | null
          membership_id?: string | null
          merchant_ref?: string | null
          paid_at?: string | null
          pay_code?: string | null
          payment_callback_data?: Json | null
          payment_external_id?: string | null
          payment_method?: string | null
          payment_provider?: string | null
          payment_status?: string
          payment_url?: string | null
          plan_id?: string | null
          primary_status?: string | null
          promo_code?: string | null
          subtotal_amount?: number
          to_duration_months?: number
          to_plan?: string
          total_amount?: number
          transaction_id?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string
          user_name?: string | null
        }
        Relationships: []
      }
      plan_durations: {
        Row: {
          bonus_points: number | null
          bonus_token: number | null
          created_at: string | null
          discount_percent: number | null
          duration_months: number
          duration_price: number | null
          final_price: number | null
          id: string
          is_active: boolean | null
          plan_id: string
          points_active: boolean | null
          points_value: number | null
          price: number | null
          token_amount: number | null
        }
        Insert: {
          bonus_points?: number | null
          bonus_token?: number | null
          created_at?: string | null
          discount_percent?: number | null
          duration_months: number
          duration_price?: number | null
          final_price?: number | null
          id?: string
          is_active?: boolean | null
          plan_id: string
          points_active?: boolean | null
          points_value?: number | null
          price?: number | null
          token_amount?: number | null
        }
        Update: {
          bonus_points?: number | null
          bonus_token?: number | null
          created_at?: string | null
          discount_percent?: number | null
          duration_months?: number
          duration_price?: number | null
          final_price?: number | null
          id?: string
          is_active?: boolean | null
          plan_id?: string
          points_active?: boolean | null
          points_value?: number | null
          price?: number | null
          token_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_durations_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      poin_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          mutation_type: string
          reference_id: string | null
          source: string
          user_membership_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          mutation_type?: string
          reference_id?: string | null
          source?: string
          user_membership_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          mutation_type?: string
          reference_id?: string | null
          source?: string
          user_membership_id?: string
        }
        Relationships: []
      }
      points_ledger: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          mutation_type: string
          reference_id: string | null
          source: string
          user_membership_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          mutation_type?: string
          reference_id?: string | null
          source?: string
          user_membership_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          mutation_type?: string
          reference_id?: string | null
          source?: string
          user_membership_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_ledger_user_membership_id_fkey"
            columns: ["user_membership_id"]
            isOneToOne: false
            referencedRelation: "user_memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_features: {
        Row: {
          created_at: string | null
          description: string | null
          feature_id: string
          id: string
          name: string
          slug: string
          status: string
          tipe_akses: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          feature_id: string
          id?: string
          name: string
          slug: string
          status?: string
          tipe_akses?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          feature_id?: string
          id?: string
          name?: string
          slug?: string
          status?: string
          tipe_akses?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_cycles: {
        Row: {
          amount_paid: number
          category: string
          created_at: string
          cycle_number: number
          duration_months: number
          end_date: string | null
          id: string
          membership_id: string | null
          payment_channel: string | null
          plan: string
          plan_duration_id: string | null
          start_date: string
          status: string
          transaction_id: string | null
          user_membership_id: string
        }
        Insert: {
          amount_paid?: number
          category: string
          created_at?: string
          cycle_number?: number
          duration_months?: number
          end_date?: string | null
          id?: string
          membership_id?: string | null
          payment_channel?: string | null
          plan: string
          plan_duration_id?: string | null
          start_date: string
          status?: string
          transaction_id?: string | null
          user_membership_id: string
        }
        Update: {
          amount_paid?: number
          category?: string
          created_at?: string
          cycle_number?: number
          duration_months?: number
          end_date?: string | null
          id?: string
          membership_id?: string | null
          payment_channel?: string | null
          plan?: string
          plan_duration_id?: string | null
          start_date?: string
          status?: string
          transaction_id?: string | null
          user_membership_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_cycles_user_membership_id_fkey"
            columns: ["user_membership_id"]
            isOneToOne: false
            referencedRelation: "user_memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      token_bundle_package: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          label: string | null
          name: string
          price_rp: number
          token_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          label?: string | null
          name: string
          price_rp: number
          token_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          label?: string | null
          name?: string
          price_rp?: number
          token_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      token_ledger: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          mutation_type: string
          reference_id: string | null
          source: string
          user_membership_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          mutation_type?: string
          reference_id?: string | null
          source?: string
          user_membership_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          mutation_type?: string
          reference_id?: string | null
          source?: string
          user_membership_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_ledger_user_membership_id_fkey"
            columns: ["user_membership_id"]
            isOneToOne: false
            referencedRelation: "user_memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      token_system_ledger: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string
          description: string
          direction: Database["public"]["Enums"]["token_direction"]
          id: string
          metadata: Json
          occurred_at: string
          operator_id: string | null
          reference_id: string | null
          source_id: string | null
          source_type: Database["public"]["Enums"]["token_source_type"]
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string
          description: string
          direction: Database["public"]["Enums"]["token_direction"]
          id?: string
          metadata?: Json
          occurred_at?: string
          operator_id?: string | null
          reference_id?: string | null
          source_id?: string | null
          source_type: Database["public"]["Enums"]["token_source_type"]
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string
          description?: string
          direction?: Database["public"]["Enums"]["token_direction"]
          id?: string
          metadata?: Json
          occurred_at?: string
          operator_id?: string | null
          reference_id?: string | null
          source_id?: string | null
          source_type?: Database["public"]["Enums"]["token_source_type"]
          user_id?: string
        }
        Relationships: []
      }
      token_usage_history: {
        Row: {
          created_at: string
          entitlement_key: string
          entitlement_name: string
          error_message: string | null
          id: string
          reference_id: string | null
          result: string
          token_cost: number
          user_membership_id: string
        }
        Insert: {
          created_at?: string
          entitlement_key: string
          entitlement_name: string
          error_message?: string | null
          id?: string
          reference_id?: string | null
          result?: string
          token_cost?: number
          user_membership_id: string
        }
        Update: {
          created_at?: string
          entitlement_key?: string
          entitlement_name?: string
          error_message?: string | null
          id?: string
          reference_id?: string | null
          result?: string
          token_cost?: number
          user_membership_id?: string
        }
        Relationships: []
      }
      token_wallet: {
        Row: {
          balance: number
          last_ledger_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          last_ledger_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          last_ledger_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_wallet_last_ledger"
            columns: ["last_ledger_id"]
            isOneToOne: false
            referencedRelation: "token_system_ledger"
            referencedColumns: ["id"]
          },
        ]
      }
      topup_transaction: {
        Row: {
          bundle_package_id: string | null
          created_at: string
          expired_at: string | null
          id: string
          invoice_id: string
          ledger_id: string | null
          metadata: Json
          paid_at: string | null
          provider: string | null
          status: Database["public"]["Enums"]["topup_status"]
          token_amount: number
          total_price_rp: number
          type: Database["public"]["Enums"]["topup_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          bundle_package_id?: string | null
          created_at?: string
          expired_at?: string | null
          id?: string
          invoice_id: string
          ledger_id?: string | null
          metadata?: Json
          paid_at?: string | null
          provider?: string | null
          status?: Database["public"]["Enums"]["topup_status"]
          token_amount: number
          total_price_rp: number
          type: Database["public"]["Enums"]["topup_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          bundle_package_id?: string | null
          created_at?: string
          expired_at?: string | null
          id?: string
          invoice_id?: string
          ledger_id?: string | null
          metadata?: Json
          paid_at?: string | null
          provider?: string | null
          status?: Database["public"]["Enums"]["topup_status"]
          token_amount?: number
          total_price_rp?: number
          type?: Database["public"]["Enums"]["topup_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topup_transaction_bundle_package_id_fkey"
            columns: ["bundle_package_id"]
            isOneToOne: false
            referencedRelation: "token_bundle_package"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topup_transaction_ledger_id_fkey"
            columns: ["ledger_id"]
            isOneToOne: false
            referencedRelation: "token_system_ledger"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_id_settings: {
        Row: {
          id: string
          trx_pattern: string
          trx_prefix: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          trx_pattern?: string
          trx_prefix?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          trx_pattern?: string
          trx_prefix?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      usage_logs: {
        Row: {
          created_at: string
          entitlement_key: string
          entitlement_name: string
          error_message: string | null
          id: string
          reference_id: string | null
          result: string
          user_membership_id: string
        }
        Insert: {
          created_at?: string
          entitlement_key: string
          entitlement_name: string
          error_message?: string | null
          id?: string
          reference_id?: string | null
          result?: string
          user_membership_id: string
        }
        Update: {
          created_at?: string
          entitlement_key?: string
          entitlement_name?: string
          error_message?: string | null
          id?: string
          reference_id?: string | null
          result?: string
          user_membership_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_logs_user_membership_id_fkey"
            columns: ["user_membership_id"]
            isOneToOne: false
            referencedRelation: "user_memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      user_memberships: {
        Row: {
          auto_renew: boolean
          category: string
          created_at: string
          current_poin_balance: number
          current_token_balance: number
          duration_id: string | null
          duration_months: number | null
          end_date: string | null
          entitlement_count: number
          expired_at: string | null
          id: string
          is_active: boolean
          paid_cycle_count: number
          plan_id: string | null
          plan_label: string | null
          plan_name: string | null
          points_balance: number
          remaining_days: number
          start_date: string | null
          started_at: string | null
          tier: string
          token_balance: number
          updated_at: string
          user_email: string
          user_id: string
          user_name: string
          user_type: string
        }
        Insert: {
          auto_renew?: boolean
          category?: string
          created_at?: string
          current_poin_balance?: number
          current_token_balance?: number
          duration_id?: string | null
          duration_months?: number | null
          end_date?: string | null
          entitlement_count?: number
          expired_at?: string | null
          id?: string
          is_active?: boolean
          paid_cycle_count?: number
          plan_id?: string | null
          plan_label?: string | null
          plan_name?: string | null
          points_balance?: number
          remaining_days?: number
          start_date?: string | null
          started_at?: string | null
          tier?: string
          token_balance?: number
          updated_at?: string
          user_email: string
          user_id: string
          user_name: string
          user_type?: string
        }
        Update: {
          auto_renew?: boolean
          category?: string
          created_at?: string
          current_poin_balance?: number
          current_token_balance?: number
          duration_id?: string | null
          duration_months?: number | null
          end_date?: string | null
          entitlement_count?: number
          expired_at?: string | null
          id?: string
          is_active?: boolean
          paid_cycle_count?: number
          plan_id?: string | null
          plan_label?: string | null
          plan_name?: string | null
          points_balance?: number
          remaining_days?: number
          start_date?: string | null
          started_at?: string | null
          tier?: string
          token_balance?: number
          updated_at?: string
          user_email?: string
          user_id?: string
          user_name?: string
          user_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_membership_grant: {
        Args: {
          p_membership_source_id?: string
          p_operator_id?: string
          p_reference_id: string
          p_token_amount: number
          p_user_id: string
        }
        Returns: string
      }
      apply_topup_success: {
        Args: { p_operator_id?: string; p_topup_id: string }
        Returns: string
      }
      apply_usage_spend: {
        Args: {
          p_allow_negative?: boolean
          p_entitlement_key: string
          p_reference_id: string
          p_token_cost: number
          p_usage_source_id?: string
          p_user_id: string
        }
        Returns: string
      }
      check_user_can_export_database: { Args: never; Returns: boolean }
      export_accessible_data_sql: { Args: never; Returns: string }
      export_all_tables_sql: { Args: never; Returns: string }
      save_custom_pricing_version: {
        Args: {
          p_guardrail_ack: boolean
          p_is_enabled: boolean
          p_max_token: number
          p_min_token: number
          p_recommended_price_per_token: number
          p_tiers: Json
          p_updated_by: string
        }
        Returns: string
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      token_direction: "IN" | "OUT"
      token_source_type:
        | "TOPUP"
        | "MEMBERSHIP"
        | "USAGE"
        | "ADJUSTMENT"
        | "REFUND"
        | "EXPIRED"
      topup_status: "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED" | "REFUNDED"
      topup_type: "BUNDLE" | "CUSTOM"
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
      token_direction: ["IN", "OUT"],
      token_source_type: [
        "TOPUP",
        "MEMBERSHIP",
        "USAGE",
        "ADJUSTMENT",
        "REFUND",
        "EXPIRED",
      ],
      topup_status: ["PENDING", "SUCCESS", "FAILED", "EXPIRED", "REFUNDED"],
      topup_type: ["BUNDLE", "CUSTOM"],
    },
  },
} as const
