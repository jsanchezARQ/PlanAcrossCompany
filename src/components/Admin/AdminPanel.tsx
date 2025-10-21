import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { EmployeesTab } from './EmployeesTab'
import { TeamsTab } from './TeamsTab'
import { DebugPanel } from './DebugPanel'

interface AdminPanelProps {
  tenantId: string
}

export function AdminPanel({ tenantId }: AdminPanelProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">Manage employees and teams</p>
        <p className="text-xs text-muted-foreground mt-1">Tenant: {tenantId}</p>
      </div>


      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="mt-6">
          <Card>
            <EmployeesTab tenantId={tenantId} />
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <Card>
            <TeamsTab tenantId={tenantId} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
