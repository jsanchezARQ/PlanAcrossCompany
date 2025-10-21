import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { mockTenant, mockTeams, mockEmployees, mockRecords, getEmployeesByTeam, getTeamById } from '@/data/mockData'
import type { Team, Employee } from '@/types'
import { app, auth, db } from '@/lib/firebase'
import { AdminPanel } from '@/components/Admin'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { loadTestData } from '@/scripts/loadTestData'
import { useAuth } from '@/contexts/AuthContext'

/**
 * NOTA: Este es un componente TEMPORAL de testing para Fase 1
 * Será REEMPLAZADO en Fase 2 con el Grid real y sistema de autenticación
 */
function App() {
  const { currentUser } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [firebaseStatus, setFirebaseStatus] = useState<'loading' | 'success' | 'error'>('loading')

  // Test Firebase connection on mount
  useEffect(() => {
    try {
      // Verify Firebase is initialized
      const projectId = app.options.projectId
      const authInitialized = !!auth
      const dbInitialized = !!db

      if (projectId && authInitialized && dbInitialized) {
        setFirebaseStatus('success')
        console.log('✅ Firebase initialized successfully:', { projectId })

        // Make loadTestData available globally for console usage
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).loadTestData = loadTestData
        console.log('💡 Run loadTestData() in console to populate Firestore with test data')
      } else {
        setFirebaseStatus('error')
        console.error('❌ Firebase initialization incomplete')
      }
    } catch (error) {
      setFirebaseStatus('error')
      console.error('❌ Firebase initialization error:', error)
    }
  }, [])

  // Filter employees by search term
  const filteredEmployees = mockEmployees.filter(emp =>
    emp.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Employee Planning Matrix</h1>
          <p className="text-muted-foreground">
            Testing types, components, and mock data - Tenant: {mockTenant.name}
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="admin">Admin Panel</TabsTrigger>
            <TabsTrigger value="tests">Component Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="admin" className="mt-6">
            {currentUser?.tenantId ? (
              <AdminPanel tenantId={currentUser.tenantId} />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    You must be assigned to a tenant to access the admin panel.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tests" className="mt-6 space-y-8">
            {/* All existing test cards go here */}

        {/* Firebase Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle>Firebase Connection</CardTitle>
            <CardDescription>Testing Firebase initialization and environment variables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {firebaseStatus === 'loading' && (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                  <span className="text-sm text-muted-foreground">Connecting to Firebase...</span>
                </>
              )}
              {firebaseStatus === 'success' && (
                <>
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    ✓ Firebase connected successfully
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    Project: {app.options.projectId}
                  </span>
                </>
              )}
              {firebaseStatus === 'error' && (
                <>
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-400">
                    ✗ Firebase connection failed - Check console for details
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Buttons and Input */}
        <Card>
          <CardHeader>
            <CardTitle>Component Tests</CardTitle>
            <CardDescription>Testing shadcn/ui components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="default">Default Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Employees</label>
              <Input
                type="text"
                placeholder="Type employee name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Teams Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Teams ({mockTeams.length})</CardTitle>
            <CardDescription>Testing Team types and data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockTeams.map((team: Team) => {
                const employeeCount = getEmployeesByTeam(team.id).length
                return (
                  <div
                    key={team.id}
                    className="p-4 rounded-lg border"
                    style={{ borderLeftColor: team.color, borderLeftWidth: '4px' }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: team.color }}
                      />
                      <h3 className="font-semibold">{team.displayName}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{team.fullName}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {employeeCount} employee{employeeCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
            <CardDescription>Testing Employee types and filtering</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Permissions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee: Employee) => {
                  const team = getTeamById(employee.teamId)
                  return (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.displayName}</TableCell>
                      <TableCell>{employee.fullName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {team && (
                            <>
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: team.color }}
                              />
                              <span>{team.displayName}</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{employee.email}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            employee.canEdit
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }`}
                        >
                          {employee.canEdit ? 'Can Edit' : 'View Only'}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Records Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Records ({mockRecords.length})</CardTitle>
            <CardDescription>Testing Record types with styles</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Updated By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecords.slice(0, 10).map((record) => {
                  const employee = mockEmployees.find(emp => emp.id === record.employeeId)
                  return (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {employee?.displayName || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        {record.date.toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <span
                          className="inline-block px-2 py-1 rounded"
                          style={{
                            backgroundColor: record.style?.backgroundColor,
                            color: record.style?.textColor,
                            fontWeight: record.style?.fontWeight,
                            fontStyle: record.style?.fontStyle,
                          }}
                        >
                          {record.value}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {mockEmployees.find(emp => emp.id === record.updatedBy)?.displayName}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>All types, components, and mock data working correctly!</p>
          <p className="mt-2">
            Next: Firebase setup, TanStack Virtual, Zustand, and date-fns testing
          </p>
        </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
