import { useEffect, useState } from 'react'
import { Palette, Type, UserCircle, Check } from 'lucide-react'
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
import type { Team, Employee } from '@/types'

interface TeamDialogProps {
  team: Team | null
  employees: Employee[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (team: Team) => void
}

const PRESET_COLORS = [
  { hex: '#FF5733', name: 'Red Orange' },
  { hex: '#33C4FF', name: 'Blue' },
  { hex: '#33FF57', name: 'Green' },
  { hex: '#FF33F6', name: 'Pink' },
  { hex: '#FFD633', name: 'Yellow' },
  { hex: '#8B33FF', name: 'Purple' },
  { hex: '#FF8333', name: 'Orange' },
  { hex: '#33FFF6', name: 'Cyan' },
  { hex: '#FF3333', name: 'Red' },
  { hex: '#3357FF', name: 'Dark Blue' },
]

export function TeamDialog({
  team,
  employees,
  open,
  onOpenChange,
  onSave,
}: TeamDialogProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    color: PRESET_COLORS[0].hex,
    managerId: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (team) {
      setFormData({
        fullName: team.fullName,
        displayName: team.displayName,
        color: team.color,
        managerId: team.managerId || '',
      })
    } else {
      setFormData({
        fullName: '',
        displayName: '',
        color: PRESET_COLORS[0].hex,
        managerId: '',
      })
    }
    setErrors({})
  }, [team, open])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required'
    }

    if (!formData.color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      newErrors.color = 'Invalid color format (use hex color like #FF5733)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    const teamData: Team = {
      ...(team || {}),
      id: team?.id || '',
      fullName: formData.fullName.trim(),
      displayName: formData.displayName.trim(),
      color: formData.color.toUpperCase(),
      managerId: formData.managerId || undefined,
      createdAt: team?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    onSave(teamData)
  }

  const selectedManager = employees.find((e) => e.id === formData.managerId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-2 pb-3 sm:pb-4">
            <DialogTitle className="text-xl sm:text-2xl font-bold">
              {team ? 'Edit Team' : 'Create Team'}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {team
                ? 'Update team information and settings'
                : 'Create a new team to organize your employees'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-5 py-3 sm:py-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                <Type className="h-4 w-4 text-muted-foreground" />
                Full Name
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Technical Team Barcelona"
                className={errors.fullName ? 'border-destructive' : ''}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
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
                placeholder="TEC-BCN"
                maxLength={15}
                className={errors.displayName ? 'border-destructive' : ''}
              />
              <p className="text-xs text-muted-foreground">
                Short name for column headers (max 15 characters)
              </p>
              {errors.displayName && (
                <p className="text-sm text-destructive">{errors.displayName}</p>
              )}
            </div>

            {/* Color Picker */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                Team Color
                <span className="text-destructive">*</span>
              </Label>

              {/* Color Preview */}
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                <div
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg border-2 border-background shadow-md ring-2 ring-black/10 transition-all flex-shrink-0"
                  style={{ backgroundColor: formData.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Current Color</p>
                  <code className="text-xs text-muted-foreground font-mono break-all">
                    {formData.color}
                  </code>
                </div>
              </div>

              {/* Preset Colors */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Preset Colors
                </p>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.hex })}
                      className={`group relative h-10 w-full sm:w-10 rounded-lg border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        formData.color.toUpperCase() === color.hex
                          ? 'border-primary shadow-md ring-2 ring-primary/20 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={`${color.name} (${color.hex})`}
                    >
                      {formData.color.toUpperCase() === color.hex && (
                        <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Input */}
              <div>
                <Label htmlFor="color" className="text-xs font-medium text-muted-foreground">
                  Or enter a custom hex color
                </Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  placeholder="#FF5733"
                  maxLength={7}
                  className={`font-mono ${errors.color ? 'border-destructive' : ''}`}
                />
              </div>

              {errors.color && (
                <p className="text-sm text-destructive">{errors.color}</p>
              )}
            </div>

            {/* Manager */}
            <div className="space-y-2">
              <Label htmlFor="managerId" className="text-sm font-medium flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                Team Manager
                <span className="text-xs text-muted-foreground font-normal">(optional)</span>
              </Label>
              <select
                id="managerId"
                value={formData.managerId}
                onChange={(e) =>
                  setFormData({ ...formData, managerId: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">No manager assigned</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName} ({employee.displayName})
                  </option>
                ))}
              </select>
              {selectedManager && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-xs">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <span className="font-medium">{selectedManager.fullName}</span> will manage this team
                  </span>
                </div>
              )}
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
              {team ? 'Update Team' : 'Create Team'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
