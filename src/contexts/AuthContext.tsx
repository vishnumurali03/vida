import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth0, User as Auth0User } from '@auth0/auth0-react'
import { supabaseAdmin } from '../api/supabase'
import type { AuthUser } from '../api/auth'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  loginWithGoogle: () => void
  loginWithFacebook: () => void
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    user: auth0User,
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading,
    loginWithRedirect,
    logout: auth0Logout,
    error: auth0Error
  } = useAuth0()

  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Sync Auth0 user with Supabase
  useEffect(() => {
    const syncUserWithSupabase = async (auth0User: Auth0User) => {
      try {
        setError(null)
        
        // Check if user exists in Supabase
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', auth0User.email!)
          .single()

        let supabaseUser: AuthUser

        if (existingUser) {
          // Update existing user
          const { data: updatedUser, error: updateError } = await supabaseAdmin
            .from('users')
            .update({
              name: auth0User.name || auth0User.email!,
              avatar_url: auth0User.picture,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingUser.id)
            .select()
            .single()

          if (updateError) throw updateError
          supabaseUser = transformSupabaseUser(updatedUser)
        } else {
          // Create new user
          const newUser = {
            id: auth0User.sub!, // Use Auth0 user ID
            email: auth0User.email!,
            name: auth0User.name || auth0User.email!,
            avatar_url: auth0User.picture,
            verified: auth0User.email_verified || false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          const { data: createdUser, error: createError } = await supabaseAdmin
            .from('users')
            .insert(newUser)
            .select()
            .single()

          if (createError) throw createError
          supabaseUser = transformSupabaseUser(createdUser)
        }

        setUser(supabaseUser)
      } catch (err) {
        console.error('Error syncing user with Supabase:', err)
        setError('Failed to sync user data')
      }
    }

    if (auth0IsAuthenticated && auth0User && auth0User.email) {
      syncUserWithSupabase(auth0User)
    } else if (!auth0IsAuthenticated) {
      setUser(null)
    }

    setIsLoading(auth0IsLoading)
  }, [auth0User, auth0IsAuthenticated, auth0IsLoading])

  // Transform Supabase user to AuthUser type
  const transformSupabaseUser = (dbUser: any): AuthUser => ({
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    avatar: dbUser.avatar_url,
    verified: dbUser.verified || false,
    bio: dbUser.bio,
    location: dbUser.location,
    website: dbUser.website
  })

  const loginWithGoogle = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2'
      }
    })
  }

  const loginWithFacebook = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'facebook'
      }
    })
  }

  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    })
    setUser(null)
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: auth0IsAuthenticated && !!user,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    error: error || auth0Error?.message || null
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 