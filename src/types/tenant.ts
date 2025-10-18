export interface Tenant {
  id: string
  name: string
  createdAt: Date
  updatedAt?: Date
}

export type CreateTenantInput = Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>
