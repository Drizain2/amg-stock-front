import { UserRole } from "../common/enums";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  is_active: boolean;
  role: {
    id: number
    name: UserRole
    label: string
    level: number
  }
  // Relations chargées (peuvent être null si non eager-loaded)
  company?: {
    id: number
    name: string
    email?: string
  } | null
  branch?: {
    id: number
    name: string
    code: string
  } | null
  created_at: string
  updated_at: string
  email_verified_at?: string | null
}

export interface UserFormData {
  email: string
  password: string
  password_confirmation: string
  first_name: string
  last_name: string
  role_id?: number
  company_id?: number | null
  branch_id: number | null
  is_active?: boolean
}
export interface CreatedUserRequest {
  email: string
  password: string
  password_confirmation: string
  first_name: string
  last_name: string
  role_id?: number
  company_id?: number | null
  branch_id: number | null
}
export interface UpdateUserRequest {
  email?: string
  password?: string
  password_confirmation: string
  first_name?: string
  last_name?: string
  role_id?: number
  company_id?: number | null
  branch_id?: number | null
  is_active?: boolean
}

export interface UserOption {
  value: number
  label: string
  email: string
  role: string

}