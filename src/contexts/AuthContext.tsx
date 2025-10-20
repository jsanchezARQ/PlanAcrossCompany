import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
  type UserCredential
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import type { UserWithTenant } from '@/types'

interface AuthContextType {
  currentUser: UserWithTenant | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<UserCredential>
  register: (email: string, password: string, displayName: string) => Promise<UserCredential>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<UserWithTenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Parse custom claims from Firebase token
  const parseUserWithClaims = async (user: User): Promise<UserWithTenant | null> => {
    try {
      const tokenResult = await user.getIdTokenResult()
      const customClaims = tokenResult.claims

      // Extract tenant and permissions from custom claims
      const userWithTenant: UserWithTenant = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email || 'Unknown User',
        tenantId: customClaims.tenantId as string || null,
        canEdit: customClaims.canEdit as boolean || false,
      }

      return userWithTenant
    } catch (err) {
      console.error('Error parsing user claims:', err)
      return null
    }
  }

  // Login with email and password
  const login = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setError(null)
      const credential = await signInWithEmailAndPassword(auth, email, password)
      return credential
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to login'
      setError(errorMessage)
      throw err
    }
  }

  // Register new user with email and password
  const register = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<UserCredential> => {
    try {
      setError(null)
      const credential = await createUserWithEmailAndPassword(auth, email, password)

      // Update profile with display name
      if (credential.user) {
        await updateProfile(credential.user, {
          displayName: displayName,
        })
      }

      return credential
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to register'
      setError(errorMessage)
      throw err
    }
  }

  // Logout
  const logout = async (): Promise<void> => {
    try {
      setError(null)
      await signOut(auth)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to logout'
      setError(errorMessage)
      throw err
    }
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userWithTenant = await parseUserWithClaims(user)
        setCurrentUser(userWithTenant)
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value: AuthContextType = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
