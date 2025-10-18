export interface AuthUser {
  uid: string
  email: string | null
  displayName?: string | null
  tenantId: string
  canEdit: boolean
  employeeId?: string
}

export interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, tenantId: string, employeeId?: string) => Promise<void>
  signOut: () => Promise<void>
}

export interface CustomClaims {
  tenantId: string
  canEdit: boolean
  employeeId?: string
}
