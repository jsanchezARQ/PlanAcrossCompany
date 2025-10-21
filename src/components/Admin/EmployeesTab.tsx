import { useState } from 'react'
import { Plus, Trash2, Users, Mail, Shield, ShieldCheck, ArrowUpDown, ArrowUp, ArrowDown, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { Employee } from '@/types'
import { EmployeeDialog } from './EmployeeDialog'
import { useEmployees } from '@/hooks/useEmployees'
import { useTeams } from '@/hooks/useTeams'
import { useAuth } from '@/contexts/AuthContext'

type SortField = 'fullName' | 'team' | 'email' | 'canEdit'
type SortDirection = 'asc' | 'desc' | null

export function EmployeesTab() {
  const { currentUser } = useAuth()
  const tenantId = currentUser?.tenantId || ''
  const { employees, loading: employeesLoading, createEmployee, updateEmployee, deleteEmployee: deleteEmployeeService } = useEmployees(tenantId)
  const { teams, loading: teamsLoading } = useTeams(tenantId)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const loading = employeesLoading || teamsLoading

  const handleCreate = () => {
    setSelectedEmployee(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDialogOpen(true)
  }

  const handleDelete = async (employeeId: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return

    try {
      await deleteEmployeeService(employeeId)
    } catch (error) {
      console.error('Error deleting employee:', error)
      alert('Failed to delete employee. Please try again.')
    }
  }

  const handleSave = async (employee: Employee) => {
    try {
      if (selectedEmployee) {
        // Update existing
        await updateEmployee(employee.id, {
          fullName: employee.fullName,
          displayName: employee.displayName,
          teamId: employee.teamId,
          canEdit: employee.canEdit,
          email: employee.email,
        })
      } else {
        // Create new
        await createEmployee({
          fullName: employee.fullName,
          displayName: employee.displayName,
          teamId: employee.teamId,
          canEdit: employee.canEdit,
          email: employee.email,
        })
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving employee:', error)
      alert('Failed to save employee. Please try again.')
    }
  }

  const getTeam = (teamId: string) => {
    return teams.find((t) => t.id === teamId)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortDirection(null)
        setSortField(null)
      }
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getFilteredAndSortedEmployees = () => {
    // First filter
    let filtered = employees

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = employees.filter((employee) => {
        const team = getTeam(employee.teamId)
        return (
          employee.fullName.toLowerCase().includes(search) ||
          employee.displayName.toLowerCase().includes(search) ||
          employee.email?.toLowerCase().includes(search) ||
          team?.displayName.toLowerCase().includes(search) ||
          team?.fullName.toLowerCase().includes(search)
        )
      })
    }

    // Then sort
    if (!sortField || !sortDirection) return filtered

    return [...filtered].sort((a, b) => {
      let aValue: string | boolean
      let bValue: string | boolean

      switch (sortField) {
        case 'fullName':
          aValue = a.fullName.toLowerCase()
          bValue = b.fullName.toLowerCase()
          break
        case 'team':
          aValue = getTeam(a.teamId)?.displayName.toLowerCase() || ''
          bValue = getTeam(b.teamId)?.displayName.toLowerCase() || ''
          break
        case 'email':
          aValue = a.email?.toLowerCase() || ''
          bValue = b.email?.toLowerCase() || ''
          break
        case 'canEdit':
          aValue = a.canEdit
          bValue = b.canEdit
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
    const isActive = sortField === field
    const Icon = isActive
      ? (sortDirection === 'asc' ? ArrowUp : ArrowDown)
      : ArrowUpDown

    return (
      <TableHead
        className="cursor-pointer select-none hover:bg-muted/50 transition-colors"
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-2">
          {children}
          <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-foreground' : 'text-muted-foreground/40'}`} />
        </div>
      </TableHead>
    )
  }

  if (loading) {
    return (
      <CardContent className="py-10">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading employees...</p>
        </div>
      </CardContent>
    )
  }

  return (
    <>
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Users className="h-5 w-5" />
              Employees
            </CardTitle>
            <CardDescription>
              Manage your organization's employees and their permissions
            </CardDescription>
          </div>
          <Button onClick={handleCreate} size="default" className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search employees by name, email, or team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b hover:bg-transparent">
              <SortableHeader field="fullName">Employee</SortableHeader>
              <SortableHeader field="team">Team</SortableHeader>
              <SortableHeader field="email">Contact</SortableHeader>
              <SortableHeader field="canEdit">Permissions</SortableHeader>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="h-32">
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="rounded-full bg-muted p-3">
                        <Users className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">No employees yet</p>
                        <p className="text-sm text-muted-foreground">
                          Get started by creating your first employee
                        </p>
                      </div>
                      <Button onClick={handleCreate} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Employee
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                getFilteredAndSortedEmployees().map((employee) => {
                  const team = getTeam(employee.teamId)
                  return (
                    <TableRow
                      key={employee.id}
                      className="cursor-pointer"
                      onClick={() => handleEdit(employee)}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{employee.fullName}</div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="font-mono bg-muted px-1.5 py-0.5 rounded">
                              {employee.displayName}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {team ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full ring-2 ring-background"
                              style={{ backgroundColor: team.color }}
                            />
                            <div className="space-y-0.5">
                              <div className="text-sm font-medium">{team.displayName}</div>
                              <div className="text-xs text-muted-foreground">
                                {team.fullName}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No team</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {employee.email ? (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm">{employee.email}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No email</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {employee.canEdit ? (
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            <ShieldCheck className="h-3 w-3" />
                            Can Edit
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                            <Shield className="h-3 w-3" />
                            View Only
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(employee.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          {employees.length > 0 && (
            <div className="flex items-center justify-between border-t px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{getFilteredAndSortedEmployees().length}</span> of <span className="font-medium">{employees.length}</span> employee(s)
              </div>
            </div>
          )}
        </CardContent>

      <EmployeeDialog
        employee={selectedEmployee}
        teams={teams}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </>
  )
}
