import { useEffect, useState } from 'react'
import { User, Mail, Users, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Employee, Team } from '@/types'

interface EmployeeDialogProps {
  employee: Employee | null
  teams: Team[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (employee: Employee) => void
}

export function EmployeeDialog({
  employee,
  teams,
  open,
  onOpenChange,
  onSave,
}: EmployeeDialogProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    teamId: '',
    email: '',
    canEdit: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (employee) {
      setFormData({
        fullName: employee.fullName,
        displayName: employee.displayName,
        teamId: employee.teamId,
        email: employee.email || '',
        canEdit: employee.canEdit,
      })
    } else {
      setFormData({
        fullName: '',
        displayName: '',
        teamId: teams[0]?.id || '',
        email: '',
        canEdit: false,
      })
    }
    setErrors({})
  }, [employee, teams, open])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required'
    }

    if (!formData.teamId) {
      newErrors.teamId = 'Please select a team'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    const employeeData: Employee = {
      ...(employee || {}),
      id: employee?.id || '',
      fullName: formData.fullName.trim(),
      displayName: formData.displayName.trim(),
      teamId: formData.teamId,
      email: formData.email.trim() || undefined,
      canEdit: formData.canEdit,
      createdAt: employee?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    onSave(employeeData)
  }

  const selectedTeam = teams.find((t) => t.id === formData.teamId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-2 pb-3 sm:pb-4">
            <DialogTitle className="text-xl sm:text-2xl font-bold">
              {employee ? 'Edit Employee' : 'Create Employee'}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {employee
                ? 'Update employee information and permissions'
                : 'Add a new employee to your organization'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-5 py-3 sm:py-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="John Doe"
                className={errors.fullName ? 'border-destructive' : ''}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-sm font-medium">
                Display Name
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                placeholder="JD"
                maxLength={10}
                className={errors.displayName ? 'border-destructive' : ''}
              />
              <p className="text-xs text-muted-foreground">
                Short name displayed in the grid (max 10 characters)
              </p>
              {errors.displayName && (
                <p className="text-sm text-destructive">{errors.displayName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
                <span className="text-xs text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Team */}
            <div className="space-y-2">
              <Label htmlFor="teamId" className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Team
                <span className="text-destructive">*</span>
              </Label>
              <select
                id="teamId"
                value={formData.teamId}
                onChange={(e) =>
                  setFormData({ ...formData, teamId: e.target.value })
                }
                className={`flex h-10 w-full rounded-md border ${
                  errors.teamId ? 'border-destructive' : 'border-input'
                } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {teams.length === 0 ? (
                  <option value="">No teams available</option>
                ) : (
                  teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.displayName} - {team.fullName}
                    </option>
                  ))
                )}
              </select>
              {selectedTeam && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: selectedTeam.color }}
                  />
                  <span>{selectedTeam.fullName}</span>
                </div>
              )}
              {errors.teamId && (
                <p className="text-sm text-destructive">{errors.teamId}</p>
              )}
            </div>

            {/* Permissions */}
            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                Permissions
              </Label>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="canEdit"
                  checked={formData.canEdit}
                  onChange={(e) =>
                    setFormData({ ...formData, canEdit: e.target.checked })
                  }
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                />
                <div className="space-y-1">
                  <Label htmlFor="canEdit" className="cursor-pointer font-medium">
                    Can edit records
                  </Label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Allow this employee to create and modify planning records
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-3 sm:pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" className="shadow-sm w-full sm:w-auto">
              {employee ? 'Update Employee' : 'Create Employee'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
