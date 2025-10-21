import { useState } from 'react'
import { Database, Download, Trash2, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { loadTestData } from '@/scripts/loadTestData'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

export function DataManagementTab() {
  const { currentUser } = useAuth()
  const tenantId = currentUser?.tenantId || ''

  const [loadStatus, setLoadStatus] = useState<LoadStatus>('idle')
  const [deleteStatus, setDeleteStatus] = useState<LoadStatus>('idle')
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [stats, setStats] = useState<{ teams: number; employees: number } | null>(null)

  const handleLoadTestData = async () => {
    if (!tenantId) {
      setStatusMessage('Error: No tenant ID available')
      setLoadStatus('error')
      return
    }

    try {
      setLoadStatus('loading')
      setStatusMessage('Loading test data...')

      const result = await loadTestData()

      setStats({
        teams: result.teams,
        employees: result.employees,
      })

      setLoadStatus('success')
      setStatusMessage(
        `Successfully loaded ${result.teams} teams and ${result.employees} employees!`
      )
    } catch (error) {
      console.error('Error loading test data:', error)
      setLoadStatus('error')
      setStatusMessage(
        `Error loading test data: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  const handleDeleteAllData = async () => {
    if (!tenantId) {
      setStatusMessage('Error: No tenant ID available')
      setDeleteStatus('error')
      return
    }

    const confirmed = confirm(
      '⚠️ WARNING: This will delete ALL employees and teams for this tenant.\n\n' +
      'This action cannot be undone. Are you sure you want to continue?'
    )

    if (!confirmed) return

    try {
      setDeleteStatus('loading')
      setStatusMessage('Deleting all data...')

      // Delete all employees
      const employeesCol = collection(db, 'tenants', tenantId, 'employees')
      const employeesSnapshot = await getDocs(employeesCol)

      let deletedEmployees = 0
      for (const docSnapshot of employeesSnapshot.docs) {
        await deleteDoc(doc(db, 'tenants', tenantId, 'employees', docSnapshot.id))
        deletedEmployees++
      }

      // Delete all teams
      const teamsCol = collection(db, 'tenants', tenantId, 'teams')
      const teamsSnapshot = await getDocs(teamsCol)

      let deletedTeams = 0
      for (const docSnapshot of teamsSnapshot.docs) {
        await deleteDoc(doc(db, 'tenants', tenantId, 'teams', docSnapshot.id))
        deletedTeams++
      }

      setDeleteStatus('success')
      setStatusMessage(
        `Successfully deleted ${deletedEmployees} employees and ${deletedTeams} teams!`
      )
      setStats(null)
    } catch (error) {
      console.error('Error deleting data:', error)
      setDeleteStatus('error')
      setStatusMessage(
        `Error deleting data: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  const StatusIcon = () => {
    const status = loadStatus !== 'idle' ? loadStatus : deleteStatus

    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <>
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Management
        </CardTitle>
        <CardDescription>
          Load test data or clear all data for this tenant
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Tenant Info */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Current Tenant:</span>
            <code className="rounded bg-background px-2 py-1 font-mono text-xs">
              {tenantId}
            </code>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`flex items-start gap-3 rounded-lg border p-4 ${
              loadStatus === 'success' || deleteStatus === 'success'
                ? 'border-green-200 bg-green-50 text-green-900'
                : loadStatus === 'error' || deleteStatus === 'error'
                ? 'border-red-200 bg-red-50 text-red-900'
                : 'border-blue-200 bg-blue-50 text-blue-900'
            }`}
          >
            <StatusIcon />
            <div className="flex-1 text-sm">{statusMessage}</div>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">{stats.teams}</div>
              <div className="text-sm text-muted-foreground">Teams loaded</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-2xl font-bold">{stats.employees}</div>
              <div className="text-sm text-muted-foreground">Employees loaded</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Load Test Data
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Populate the database with sample teams and employees (15 employees across 5 teams)
                </p>
              </div>
              <Button
                onClick={handleLoadTestData}
                disabled={loadStatus === 'loading' || !tenantId}
                className="w-full sm:w-auto"
              >
                {loadStatus === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading Data...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Load Test Data
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold flex items-center gap-2 text-red-900">
                  <Trash2 className="h-4 w-4" />
                  Delete All Data
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  ⚠️ Warning: This will permanently delete all employees and teams. This action cannot be undone.
                </p>
              </div>
              <Button
                onClick={handleDeleteAllData}
                disabled={deleteStatus === 'loading' || !tenantId}
                variant="destructive"
                className="w-full sm:w-auto"
              >
                {deleteStatus === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete All Data
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <h4 className="font-medium text-sm mb-2">💡 Tips</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Use "Load Test Data" to quickly populate your tenant with sample data</li>
            <li>The test data includes 5 teams with different colors and 15 employees</li>
            <li>You can load test data multiple times (it will create duplicates)</li>
            <li>Use "Delete All Data" to start fresh before loading new test data</li>
          </ul>
        </div>
      </CardContent>
    </>
  )
}
