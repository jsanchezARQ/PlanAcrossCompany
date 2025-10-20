import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  getEmployees,
  getTeams,
  createEmployee,
  createTeam,
  createRecord,
  getRecordsByEmployeeAndDateRange,
  updateRecord,
  deleteRecord,
} from '@/services/firestore'
import type { CreateEmployeeInput, CreateTeamInput, CreateRecordInput } from '@/types'

interface TestResult {
  name: string
  status: 'pending' | 'running' | 'success' | 'error'
  message?: string
  duration?: number
}

export default function FirebaseTestPage() {
  const { currentUser, refreshUserClaims } = useAuth()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const updateTestResult = (name: string, updates: Partial<TestResult>) => {
    setTestResults(prev =>
      prev.map(test => (test.name === name ? { ...test, ...updates } : test))
    )
  }

  const addTestResult = (test: TestResult) => {
    setTestResults(prev => [...prev, test])
  }

  const handleRefreshClaims = async () => {
    setIsRefreshing(true)
    try {
      await refreshUserClaims()
      alert('Custom claims refrescados. Verifica que el tenantId ahora esté asignado.')
    } catch (error) {
      console.error('Error refreshing claims:', error)
      alert('Error al refrescar claims')
    } finally {
      setIsRefreshing(false)
    }
  }

  const runAllTests = async () => {
    if (!currentUser || !currentUser.tenantId) {
      alert('No estás autenticado o no tienes un tenant asignado')
      return
    }

    setIsRunning(true)
    setTestResults([])

    // Test 1: Conexión a Firebase
    await testFirebaseConnection()

    // Test 2: Autenticación
    await testAuthentication()

    // Test 3: Crear Team
    const teamId = await testCreateTeam()

    // Test 4: Leer Teams
    await testReadTeams()

    // Test 5: Crear Employee
    const employeeId = teamId ? await testCreateEmployee(teamId) : null

    // Test 6: Leer Employees
    await testReadEmployees()

    // Test 7: Crear Record
    const recordId = employeeId ? await testCreateRecord(employeeId) : null

    // Test 8: Leer Records
    if (employeeId) {
      await testReadRecords(employeeId)
    }

    // Test 9: Actualizar Record
    if (recordId) {
      await testUpdateRecord(recordId)
    }

    // Test 10: Eliminar Record
    if (recordId) {
      await testDeleteRecord(recordId)
    }

    setIsRunning(false)
  }

  const testFirebaseConnection = async () => {
    const testName = '1. Conexión a Firebase'
    addTestResult({ name: testName, status: 'running' })
    const start = Date.now()

    try {
      // Intentar leer algo simple de Firestore
      if (!currentUser?.tenantId) {
        throw new Error('No tenant ID disponible')
      }

      const teams = await getTeams(currentUser.tenantId)
      const duration = Date.now() - start

      updateTestResult(testName, {
        status: 'success',
        message: `Conectado correctamente. Found ${teams.length} teams.`,
        duration,
      })
    } catch (error: any) {
      const duration = Date.now() - start
      updateTestResult(testName, {
        status: 'error',
        message: `Error: ${error.message}`,
        duration,
      })
    }
  }

  const testAuthentication = async () => {
    const testName = '2. Autenticación'
    addTestResult({ name: testName, status: 'running' })
    const start = Date.now()

    try {
      if (!currentUser) {
        throw new Error('No hay usuario autenticado')
      }

      if (!currentUser.tenantId) {
        throw new Error('Usuario no tiene tenantId en custom claims')
      }

      const duration = Date.now() - start
      updateTestResult(testName, {
        status: 'success',
        message: `Usuario autenticado: ${currentUser.email} (Tenant: ${currentUser.tenantId}, canEdit: ${currentUser.canEdit})`,
        duration,
      })
    } catch (error: any) {
      const duration = Date.now() - start
      updateTestResult(testName, {
        status: 'error',
        message: `Error: ${error.message}`,
        duration,
      })
    }
  }

  const testCreateTeam = async (): Promise<string | null> => {
    const testName = '3. Crear Team'
    addTestResult({ name: testName, status: 'running' })
    const start = Date.now()

    try {
      if (!currentUser?.tenantId) {
        throw new Error('No tenant ID')
      }

      const teamData: CreateTeamInput = {
        fullName: 'Test Team - Engineering',
        displayName: 'ENG-TEST',
        color: '#FF5733',
      }

      const teamId = await createTeam(currentUser.tenantId, teamData)
      const duration = Date.now() - start

      updateTestResult(testName, {
        status: 'success',
        message: `Team creado con ID: ${teamId}`,
        duration,
      })

      return teamId
    } catch (error: any) {
      const duration = Date.now() - start
      updateTestResult(testName, {
        status: 'error',
        message: `Error: ${error.message}`,
        duration,
      })
      return null
    }
  }

  const testReadTeams = async () => {
    const testName = '4. Leer Teams'
    addTestResult({ name: testName, status: 'running' })
    const start = Date.now()

    try {
      if (!currentUser?.tenantId) {
        throw new Error('No tenant ID')
      }

      const teams = await getTeams(currentUser.tenantId)
      const duration = Date.now() - start

      updateTestResult(testName, {
        status: 'success',
        message: `Encontrados ${teams.length} teams: ${teams.map(t => t.displayName).join(', ')}`,
        duration,
      })
    } catch (error: any) {
      const duration = Date.now() - start
      updateTestResult(testName, {
        status: 'error',
        message: `Error: ${error.message}`,
        duration,
      })
    }
  }

  const testCreateEmployee = async (teamId: string): Promise<string | null> => {
    const testName = '5. Crear Employee'
    addTestResult({ name: testName, status: 'running' })
    const start = Date.now()

    try {
      if (!currentUser?.tenantId) {
        throw new Error('No tenant ID')
      }

      const employeeData: CreateEmployeeInput = {
        fullName: 'John Doe',
        displayName: 'JDoe',
        teamId,
        canEdit: true,
        userId: currentUser.uid,
      }

      const employeeId = await createEmployee(currentUser.tenantId, employeeData)
      const duration = Date.now() - start

      updateTestResult(testName, {
        status: 'success',
        message: `Employee creado con ID: ${employeeId}`,
        duration,
      })

      return employeeId
    } catch (error: any) {
      const duration = Date.now() - start
      updateTestResult(testName, {
        status: 'error',
        message: `Error: ${error.message}`,
        duration,
      })
      return null
    }
  }

  const testReadEmployees = async () => {
    const testName = '6. Leer Employees'
    addTestResult({ name: testName, status: 'running' })
    const start = Date.now()

    try {
      if (!currentUser?.tenantId) {
        throw new Error('No tenant ID')
      }

      const employees = await getEmployees(currentUser.tenantId)
      const duration = Date.now() - start

      updateTestResult(testName, {
        status: 'success',
        message: `Encontrados ${employees.length} employees: ${employees.map(e => e.displayName).join(', ')}`,
        duration,
      })
    } catch (error: any) {
      const duration = Date.now() - start
      updateTestResult(testName, {
        status: 'error',
        message: `Error: ${error.message}`,
        duration,
      })
    }
  }

  const testCreateRecord = async (employeeId: string): Promise<string | null> => {
    const testName = '7. Crear Record'
    addTestResult({ name: testName, status: 'running' })
    const start = Date.now()

    try {
      if (!currentUser?.tenantId) {
        throw new Error('No tenant ID')
      }

      const recordData: CreateRecordInput = {
        employeeId,
        date: new Date(),
        value: 'TEST PROJECT',
        style: {
          backgroundColor: '#E3F2FD',
          textColor: '#1976D2',
        },
        updatedBy: currentUser.uid,
      }

      const recordId = await createRecord(currentUser.tenantId, recordData)
      const duration = Date.now() - start

      updateTestResult(testName, {
        status: 'success',
        message: `Record creado con ID: ${recordId}`,
        duration,
      })

      return recordId
    } catch (error: any) {
      const duration = Date.now() - start
      updateTestResult(testName, {
        status: 'error',
        message: `Error: ${error.message}`,
        duration,
      })
      return null
    }
  }

  const testReadRecords = async (employeeId: string) => {
    const testName = '8. Leer Records'
    addTestResult({ name: testName, status: 'running' })
    const start = Date.now()

    try {
      if (!currentUser?.tenantId) {
        throw new Error('No tenant ID')
      }

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 7)
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 7)

      const records = await getRecordsByEmployeeAndDateRange(
        currentUser.tenantId,
        employeeId,
        startDate,
        endDate
      )
      const duration = Date.now() - start

      updateTestResult(testName, {
        status: 'success',
        message: `Encontrados ${records.length} records para el empleado`,
        duration,
      })
    } catch (error: any) {
      const duration = Date.now() - start
      updateTestResult(testName, {
        status: 'error',
        message: `Error: ${error.message}`,
        duration,
      })
    }
  }

  const testUpdateRecord = async (recordId: string) => {
    const testName = '9. Actualizar Record'
    addTestResult({ name: testName, status: 'running' })
    const start = Date.now()

    try {
      if (!currentUser?.tenantId) {
        throw new Error('No tenant ID')
      }

      await updateRecord(currentUser.tenantId, recordId, {
        value: 'UPDATED PROJECT',
        updatedBy: currentUser.uid,
      })
      const duration = Date.now() - start

      updateTestResult(testName, {
        status: 'success',
        message: `Record actualizado correctamente`,
        duration,
      })
    } catch (error: any) {
      const duration = Date.now() - start
      updateTestResult(testName, {
        status: 'error',
        message: `Error: ${error.message}`,
        duration,
      })
    }
  }

  const testDeleteRecord = async (recordId: string) => {
    const testName = '10. Eliminar Record'
    addTestResult({ name: testName, status: 'running' })
    const start = Date.now()

    try {
      if (!currentUser?.tenantId) {
        throw new Error('No tenant ID')
      }

      await deleteRecord(currentUser.tenantId, recordId)
      const duration = Date.now() - start

      updateTestResult(testName, {
        status: 'success',
        message: `Record eliminado correctamente`,
        duration,
      })
    } catch (error: any) {
      const duration = Date.now() - start
      updateTestResult(testName, {
        status: 'error',
        message: `Error: ${error.message}`,
        duration,
      })
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'text-gray-500'
      case 'running':
        return 'text-blue-500'
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
    }
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return '⏸'
      case 'running':
        return '⏳'
      case 'success':
        return '✓'
      case 'error':
        return '✗'
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Firebase Integration Tests</CardTitle>
          <div className="text-sm text-gray-600 mt-2">
            {currentUser ? (
              <div>
                <p>Usuario: {currentUser.email}</p>
                <p>Tenant: {currentUser.tenantId || 'No asignado'}</p>
                <p>Permisos: {currentUser.canEdit ? 'Editor' : 'Solo lectura'}</p>
              </div>
            ) : (
              <p>No autenticado</p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={runAllTests} disabled={isRunning || !currentUser?.tenantId}>
                {isRunning ? 'Ejecutando tests...' : 'Ejecutar todos los tests'}
              </Button>

              {!currentUser?.tenantId && (
                <Button
                  variant="outline"
                  onClick={handleRefreshClaims}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? 'Refrescando...' : 'Refrescar Custom Claims'}
                </Button>
              )}
            </div>

            {!currentUser?.tenantId && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm">
                <p className="font-semibold text-yellow-800">Advertencia:</p>
                <p className="text-yellow-700">
                  Tu usuario no tiene un tenant asignado. Sigue estos pasos:
                </p>
                <ol className="text-yellow-700 mt-2 ml-4 list-decimal space-y-1">
                  <li>Ejecuta: <code className="bg-yellow-100 px-1">node scripts/set-custom-claims.cjs set {currentUser?.email} tenant-001 true</code></li>
                  <li>Click en "Refrescar Custom Claims" arriba</li>
                  <li>Si el tenant no aparece, haz logout/login</li>
                </ol>
                <p className="text-yellow-700 mt-2">
                  Ver: <code className="bg-yellow-100 px-1">scripts/README.md</code> para más detalles
                </p>
              </div>
            )}

            {testResults.length > 0 && (
              <div className="mt-6 space-y-2">
                <h3 className="font-semibold text-lg mb-4">Resultados:</h3>
                {testResults.map((test, index) => (
                  <div
                    key={index}
                    className="border rounded p-3 flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xl ${getStatusColor(test.status)}`}>
                          {getStatusIcon(test.status)}
                        </span>
                        <span className="font-semibold">{test.name}</span>
                        {test.duration && (
                          <span className="text-xs text-gray-500">({test.duration}ms)</span>
                        )}
                      </div>
                      {test.message && (
                        <p className={`text-sm mt-1 ml-8 ${getStatusColor(test.status)}`}>
                          {test.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {testResults.length > 0 && !isRunning && (
              <div className="mt-6 pt-6 border-t">
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-mono text-xl">✓</span>
                    <span>
                      Exitosos: {testResults.filter(t => t.status === 'success').length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-600 font-mono text-xl">✗</span>
                    <span>Fallidos: {testResults.filter(t => t.status === 'error').length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">
                      Total:{' '}
                      {testResults.reduce((sum, t) => sum + (t.duration || 0), 0).toFixed(0)}ms
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
