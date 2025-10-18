export interface Team {
  id: string
  fullName: string
  displayName: string
  managerId?: string // Reference to Employee
  color: string // Hex color code (e.g., "#FF5733")
  createdAt: Date
  updatedAt?: Date
}

export type CreateTeamInput = Omit<Team, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateTeamInput = Partial<CreateTeamInput>
