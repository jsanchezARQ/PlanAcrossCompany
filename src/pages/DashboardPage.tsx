import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { mockTenant, mockTeams, mockEmployees } from '@/data/mockData'

/**
 * Dashboard Page - Protected route
 * Shows overview of planning matrix and user info
 */
export function DashboardPage() {
  const { currentUser, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Employee Planning Matrix</h1>
            <p className="text-sm text-muted-foreground">{mockTenant.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{currentUser?.displayName}</p>
              <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {currentUser?.displayName}!</CardTitle>
              <CardDescription>
                You are logged in with {currentUser?.canEdit ? 'edit' : 'read-only'} permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Tenant ID:</span>
                  <span className="text-sm text-muted-foreground">
                    {currentUser?.tenantId || 'Not assigned'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">User ID:</span>
                  <span className="text-sm text-muted-foreground font-mono text-xs">
                    {currentUser?.uid}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Permissions:</span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      currentUser?.canEdit
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {currentUser?.canEdit ? 'Can Edit' : 'View Only'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Teams</CardTitle>
                <CardDescription>Active teams</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{mockTeams.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Employees</CardTitle>
                <CardDescription>Total employees</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{mockEmployees.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
                <CardDescription>System status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">All systems operational</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Placeholder for Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Planning Grid</CardTitle>
              <CardDescription>
                The employee planning matrix will be displayed here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-muted rounded-lg">
                <div className="text-center space-y-2">
                  <p className="text-lg font-medium text-muted-foreground">
                    Grid Component Coming Soon
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This will be implemented in Phase 3
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
