import { useState } from 'react'
import { Plus, Trash2, Users, Palette, UserCircle, ArrowUpDown, ArrowUp, ArrowDown, Search, X } from 'lucide-react'
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
import type { Team } from '@/types'
import { TeamDialog } from './TeamDialog'
import { useTeams } from '@/hooks/useTeams'
import { useEmployees } from '@/hooks/useEmployees'

type SortField = 'displayName' | 'fullName' | 'manager' | 'members'
type SortDirection = 'asc' | 'desc' | null

interface TeamsTabProps {
  tenantId: string
}

export function TeamsTab({ tenantId }: TeamsTabProps) {
  const { teams, loading: teamsLoading, createTeam, updateTeam, deleteTeam: deleteTeamService } = useTeams(tenantId)
  const { employees, loading: employeesLoading } = useEmployees(tenantId)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const loading = teamsLoading || employeesLoading

  const handleCreate = () => {
    setSelectedTeam(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (team: Team) => {
    setSelectedTeam(team)
    setIsDialogOpen(true)
  }

  const handleDelete = async (teamId: string) => {
    const employeesInTeam = employees.filter((e) => e.teamId === teamId)

    if (employeesInTeam.length > 0) {
      alert(
        `Cannot delete team. ${employeesInTeam.length} employee(s) are assigned to this team. Please reassign them first.`
      )
      return
    }

    if (!confirm('Are you sure you want to delete this team?')) return

    try {
      await deleteTeamService(teamId)
    } catch (error) {
      console.error('Error deleting team:', error)
      alert('Failed to delete team. Please try again.')
    }
  }

  const handleSave = async (team: Team) => {
    try {
      if (selectedTeam) {
        // Update existing
        await updateTeam(team.id, {
          fullName: team.fullName,
          displayName: team.displayName,
          color: team.color,
          managerId: team.managerId,
        })
      } else {
        // Create new
        await createTeam({
          fullName: team.fullName,
          displayName: team.displayName,
          color: team.color,
          managerId: team.managerId,
        })
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving team:', error)
      alert('Failed to save team. Please try again.')
    }
  }

  const getManager = (managerId?: string) => {
    if (!managerId) return null
    return employees.find((e) => e.id === managerId)
  }

  const getEmployeeCount = (teamId: string) => {
    return employees.filter((e) => e.teamId === teamId).length
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

  const getFilteredAndSortedTeams = () => {
    // First filter
    let filtered = teams

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = teams.filter((team) => {
        const manager = getManager(team.managerId)
        return (
          team.displayName.toLowerCase().includes(search) ||
          team.fullName.toLowerCase().includes(search) ||
          manager?.fullName.toLowerCase().includes(search) ||
          team.color.toLowerCase().includes(search)
        )
      })
    }

    // Then sort
    if (!sortField || !sortDirection) return filtered

    return [...filtered].sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortField) {
        case 'displayName':
          aValue = a.displayName.toLowerCase()
          bValue = b.displayName.toLowerCase()
          break
        case 'fullName':
          aValue = a.fullName.toLowerCase()
          bValue = b.fullName.toLowerCase()
          break
        case 'manager':
          aValue = getManager(a.managerId)?.fullName.toLowerCase() || ''
          bValue = getManager(b.managerId)?.fullName.toLowerCase() || ''
          break
        case 'members':
          aValue = getEmployeeCount(a.id)
          bValue = getEmployeeCount(b.id)
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
          <p className="text-sm text-muted-foreground">Loading teams...</p>
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
              <Palette className="h-5 w-5" />
              Teams
            </CardTitle>
            <CardDescription>
              Organize employees into teams with custom colors and managers
            </CardDescription>
          </div>
          <Button onClick={handleCreate} size="default" className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Team
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teams by name, manager, or color..."
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
              <SortableHeader field="displayName">Team</SortableHeader>
              <TableHead>Color</TableHead>
              <SortableHeader field="manager">Manager</SortableHeader>
              <SortableHeader field="members">Members</SortableHeader>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
            <TableBody>
              {teams.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="h-32">
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="rounded-full bg-muted p-3">
                        <Palette className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">No teams yet</p>
                        <p className="text-sm text-muted-foreground">
                          Create your first team to start organizing employees
                        </p>
                      </div>
                      <Button onClick={handleCreate} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Team
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                getFilteredAndSortedTeams().map((team) => {
                  const manager = getManager(team.managerId)
                  const memberCount = getEmployeeCount(team.id)

                  return (
                    <TableRow
                      key={team.id}
                      className="cursor-pointer"
                      onClick={() => handleEdit(team)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 rounded-lg ring-2 ring-background shadow-sm flex items-center justify-center"
                            style={{ backgroundColor: team.color }}
                          >
                            <span className="text-white text-xs font-bold">
                              {team.displayName.substring(0, 2)}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="font-medium">{team.displayName}</div>
                            <div className="text-xs text-muted-foreground">
                              {team.fullName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-8 w-16 rounded border-2 border-gray-200 shadow-sm"
                            style={{ backgroundColor: team.color }}
                          />
                          <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                            {team.color}
                          </code>
                        </div>
                      </TableCell>
                      <TableCell>
                        {manager ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                              <UserCircle className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-sm font-medium">{manager.fullName}</div>
                              <div className="text-xs text-muted-foreground font-mono">
                                {manager.displayName}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No manager</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                          <Users className="h-3 w-3" />
                          <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(team.id)
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

          {teams.length > 0 && (
            <div className="flex items-center justify-between border-t px-6 py-4">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{getFilteredAndSortedTeams().length}</span> of <span className="font-medium">{teams.length}</span> team(s)
              </div>
            </div>
          )}
        </CardContent>

      <TeamDialog
        team={selectedTeam}
        employees={employees}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </>
  )
}
