export interface ViewFilters {
  dateRange?: {
    start: Date
    end: Date
  }
  teamIds?: string[]
  employeeIds?: string[]
}

export interface View {
  id: string
  ownerId: string // Employee ID who owns this view
  name: string
  filters: ViewFilters
  sharedWith: string[] // Array of Employee IDs
  color?: string // Optional color for the view
  isDefault?: boolean // Whether this is the user's default view
  createdAt: Date
  updatedAt?: Date
}

export type CreateViewInput = Omit<View, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateViewInput = Partial<Omit<CreateViewInput, 'ownerId'>>
