export interface RecordStyle {
  backgroundColor?: string
  textColor?: string
  fontWeight?: 'normal' | 'bold'
  fontStyle?: 'normal' | 'italic'
}

export interface Record {
  id: string
  employeeId: string // Reference to Employee
  date: Date
  value: string // Free text (e.g., "Ramcon", "VACACIONES", "MIGASA")
  style?: RecordStyle // Visual styling
  updatedAt: Date
  updatedBy: string // Employee ID who made the last update
  createdAt: Date
}

export type CreateRecordInput = Omit<Record, 'id' | 'createdAt' | 'updatedAt'> & {
  updatedBy: string // Required on creation
}

export type UpdateRecordInput = Partial<Omit<Record, 'id' | 'createdAt' | 'updatedAt' | 'employeeId' | 'date'>> & {
  updatedBy: string // Always required when updating
}
