import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requireEdit?: boolean
}

/**
 * ProtectedRoute component that wraps protected pages
 * - Redirects to /login if user is not authenticated
 * - Optionally checks for canEdit permission
 */
export function ProtectedRoute({ children, requireEdit = false }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  // Check if user has required edit permission
  if (requireEdit && !currentUser.canEdit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="text-6xl">🔒</div>
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page. Please contact your administrator.
          </p>
        </div>
      </div>
    )
  }

  // Render protected content
  return <>{children}</>
}
