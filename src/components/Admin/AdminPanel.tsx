import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { EmployeesTab } from './EmployeesTab'
import { TeamsTab } from './TeamsTab'
import { DataManagementTab } from './DataManagementTab'
import { useAuth } from '@/contexts/AuthContext'

export function AdminPanel() {
  const { currentUser } = useAuth()

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">Manage employees and teams</p>
        <p className="text-xs text-muted-foreground mt-1">Tenant: {currentUser?.tenantId || 'Unknown'}</p>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="mt-6">
          <Card>
            <EmployeesTab />
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <Card>
            <TeamsTab />
          </Card>
        </TabsContent>

        <TabsContent value="data" className="mt-6">
          <Card>
            <DataManagementTab />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
