import { AdminPanel } from '@/components/Admin'
import { useAuth } from '@/contexts/AuthContext'

/**
 * Admin Page
 *
 * Página de administración para gestionar empleados y equipos de la organización.
 * Accesible solo para usuarios con permisos de administrador.
 *
 * Features:
 * - CRUD de empleados
 * - CRUD de equipos
 * - Validaciones de negocio
 * - Interfaz basada en shadcn/ui
 * - Integración con Firestore para persistencia en tiempo real
 *
 * TODO (Fase 2+):
 * - Agregar validación de permisos de admin específicos
 * - Agregar toast notifications en lugar de alerts
 */
export function AdminPage() {
  const { currentUser } = useAuth()

  // Si no hay usuario autenticado o no tiene tenantId, mostrar mensaje
  if (!currentUser?.tenantId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You must be assigned to a tenant to access the admin panel.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminPanel />
    </div>
  )
}

export default AdminPage
