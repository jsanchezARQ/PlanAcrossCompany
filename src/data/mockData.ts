import type { Tenant, Team, Employee, Record } from '@/types'

export const mockTenant: Tenant = {
  id: 'tenant-1',
  name: 'Acme Corporation',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-15'),
}

export const mockTeams: Team[] = [
  {
    id: 'team-1',
    fullName: 'Technical Team Barcelona',
    displayName: 'TEC-BCN',
    color: '#D97706', // Orange
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'team-2',
    fullName: 'Technical Team Madrid',
    displayName: 'TEC-MAD',
    color: '#2563EB', // Blue
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'team-3',
    fullName: 'Sales Team',
    displayName: 'SALES',
    color: '#16A34A', // Green
    createdAt: new Date('2025-01-01'),
  },
]

export const mockEmployees: Employee[] = [
  {
    id: 'emp-1',
    fullName: 'Marcos García',
    displayName: 'Marcos',
    teamId: 'team-1',
    canEdit: true,
    email: 'marcos@acme.com',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'emp-2',
    fullName: 'Juan Sanchez',
    displayName: 'Juan Sanchez',
    teamId: 'team-1',
    canEdit: true,
    email: 'juan@acme.com',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'emp-3',
    fullName: 'Brian López',
    displayName: 'Brian',
    teamId: 'team-1',
    canEdit: false,
    email: 'brian@acme.com',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'emp-4',
    fullName: 'Eduard Martinez',
    displayName: 'Eduard Martinez',
    teamId: 'team-1',
    canEdit: true,
    email: 'eduardo@acme.com',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'emp-5',
    fullName: 'Fariha Zafar',
    displayName: 'Fariha Zafar',
    teamId: 'team-1',
    canEdit: true,
    email: 'fariha@acme.com',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'emp-6',
    fullName: 'Nil Carmona',
    displayName: 'Nil Carmona',
    teamId: 'team-2',
    canEdit: true,
    email: 'nil@acme.com',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'emp-7',
    fullName: 'Joel Gonzalez',
    displayName: 'Joel Gonzalez',
    teamId: 'team-2',
    canEdit: true,
    email: 'joel@acme.com',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'emp-8',
    fullName: 'Dylan Osorio',
    displayName: 'Dylan Osorio',
    teamId: 'team-2',
    canEdit: false,
    email: 'dylan@acme.com',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'emp-9',
    fullName: 'Eric de la Mata',
    displayName: 'Eric de la Mata',
    teamId: 'team-3',
    canEdit: true,
    email: 'eric@acme.com',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: 'emp-10',
    fullName: 'Xavier Porras',
    displayName: 'Xavier Porras',
    teamId: 'team-3',
    canEdit: true,
    email: 'xavier@acme.com',
    createdAt: new Date('2025-01-01'),
  },
]

export const mockRecords: Record[] = [
  // October 13, 2025
  {
    id: 'rec-1',
    employeeId: 'emp-3',
    date: new Date('2025-10-13'),
    value: 'Ramcon',
    createdAt: new Date('2025-10-13'),
    updatedAt: new Date('2025-10-13'),
    updatedBy: 'emp-3',
  },
  {
    id: 'rec-2',
    employeeId: 'emp-4',
    date: new Date('2025-10-13'),
    value: 'Veolia/Infinver',
    createdAt: new Date('2025-10-13'),
    updatedAt: new Date('2025-10-13'),
    updatedBy: 'emp-4',
  },
  {
    id: 'rec-3',
    employeeId: 'emp-5',
    date: new Date('2025-10-13'),
    value: 'Soporte',
    createdAt: new Date('2025-10-13'),
    updatedAt: new Date('2025-10-13'),
    updatedBy: 'emp-5',
  },
  {
    id: 'rec-4',
    employeeId: 'emp-6',
    date: new Date('2025-10-13'),
    value: 'WALDEMAR',
    createdAt: new Date('2025-10-13'),
    updatedAt: new Date('2025-10-13'),
    updatedBy: 'emp-6',
  },
  {
    id: 'rec-5',
    employeeId: 'emp-7',
    date: new Date('2025-10-13'),
    value: 'MR Wonderful',
    createdAt: new Date('2025-10-13'),
    updatedAt: new Date('2025-10-13'),
    updatedBy: 'emp-7',
  },
  {
    id: 'rec-6',
    employeeId: 'emp-8',
    date: new Date('2025-10-13'),
    value: 'MIGASA',
    createdAt: new Date('2025-10-13'),
    updatedAt: new Date('2025-10-13'),
    updatedBy: 'emp-8',
  },
  {
    id: 'rec-7',
    employeeId: 'emp-3',
    date: new Date('2025-10-14'),
    value: 'Ramcon',
    createdAt: new Date('2025-10-14'),
    updatedAt: new Date('2025-10-14'),
    updatedBy: 'emp-3',
  },
  {
    id: 'rec-8',
    employeeId: 'emp-7',
    date: new Date('2025-10-31'),
    value: 'VACACIONES',
    style: {
      backgroundColor: '#FFFF00',
      fontWeight: 'bold',
    },
    createdAt: new Date('2025-10-31'),
    updatedAt: new Date('2025-10-31'),
    updatedBy: 'emp-7',
  },
  {
    id: 'rec-9',
    employeeId: 'emp-8',
    date: new Date('2025-11-02'),
    value: 'VACACIONES',
    style: {
      backgroundColor: '#FFFF00',
      fontWeight: 'bold',
    },
    createdAt: new Date('2025-11-02'),
    updatedAt: new Date('2025-11-02'),
    updatedBy: 'emp-8',
  },
]

// Helper function to get team by ID
export const getTeamById = (teamId: string): Team | undefined => {
  return mockTeams.find(team => team.id === teamId)
}

// Helper function to get employees by team
export const getEmployeesByTeam = (teamId: string): Employee[] => {
  return mockEmployees.filter(emp => emp.teamId === teamId)
}

// Helper function to get records by employee and date range
export const getRecordsByEmployeeAndDateRange = (
  employeeId: string,
  startDate: Date,
  endDate: Date
): Record[] => {
  return mockRecords.filter(
    record =>
      record.employeeId === employeeId &&
      record.date >= startDate &&
      record.date <= endDate
  )
}
