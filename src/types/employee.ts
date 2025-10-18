export interface Employee {
  id: string
  fullName: string
  displayName: string
  teamId: string // Reference to Team
  canEdit: boolean // Permission: can edit vs view only
  userId?: string // Link to Firebase Auth user
  email?: string
  createdAt: Date
  updatedAt?: Date
}

export type CreateEmployeeInput = Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>
