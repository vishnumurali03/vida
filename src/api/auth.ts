import { supabase } from './supabase'
import type { Database } from '../types/supabase'

// Type aliases for user data
type DbUser = Database['public']['Tables']['users']['Row']
type DbUserInsert = Database['public']['Tables']['users']['Insert']
type DbUserUpdate = Database['public']['Tables']['users']['Update']

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  verified: boolean
  bio?: string
  location?: string
  website?: string
}

// Sign up new user
export const signUp = async (email: string, password: string, name: string): Promise<AuthUser> => {
  try {
    // Create auth user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    })

    if (authError) {
      throw authError
    }

    if (!authData.user) {
      throw new Error('Failed to create user account')
    }

    // Create user profile in public.users table
    const userProfile: DbUserInsert = {
      id: authData.user.id,
      email,
      name,
      verified: false
    }

    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert(userProfile)
      .select()
      .single()

    if (profileError) {
      throw profileError
    }

    return {
      id: profileData.id,
      email: profileData.email,
      name: profileData.name,
      avatar: profileData.avatar_url || undefined,
      verified: profileData.verified || false,
      bio: profileData.bio || undefined,
      location: profileData.location || undefined,
      website: profileData.website || undefined
    }
  } catch (error) {
    console.error('Error during sign up:', error)
    throw new Error(`Sign up failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Sign in user
export const signIn = async (email: string, password: string): Promise<AuthUser> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      throw authError
    }

    if (!authData.user) {
      throw new Error('Sign in failed')
    }

    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      throw profileError
    }

    return {
      id: profileData.id,
      email: profileData.email,
      name: profileData.name,
      avatar: profileData.avatar_url || undefined,
      verified: profileData.verified || false,
      bio: profileData.bio || undefined,
      location: profileData.location || undefined,
      website: profileData.website || undefined
    }
  } catch (error) {
    console.error('Error during sign in:', error)
    throw new Error(`Sign in failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Sign out user
export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error during sign out:', error)
    throw new Error(`Sign out failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Get current user
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      throw authError
    }

    if (!user) {
      return null
    }

    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      if (profileError.code === 'PGRST116') {
        return null // Profile doesn't exist
      }
      throw profileError
    }

    return {
      id: profileData.id,
      email: profileData.email,
      name: profileData.name,
      avatar: profileData.avatar_url || undefined,
      verified: profileData.verified || false,
      bio: profileData.bio || undefined,
      location: profileData.location || undefined,
      website: profileData.website || undefined
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Update user profile
export const updateProfile = async (updates: Partial<Omit<AuthUser, 'id' | 'email'>>): Promise<AuthUser> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('User must be authenticated')
    }

    // Prepare update data
    const updateData: DbUserUpdate = {}
    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.avatar !== undefined) updateData.avatar_url = updates.avatar
    if (updates.bio !== undefined) updateData.bio = updates.bio
    if (updates.location !== undefined) updateData.location = updates.location
    if (updates.website !== undefined) updateData.website = updates.website

    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single()

    if (profileError) {
      throw profileError
    }

    return {
      id: profileData.id,
      email: profileData.email,
      name: profileData.name,
      avatar: profileData.avatar_url || undefined,
      verified: profileData.verified || false,
      bio: profileData.bio || undefined,
      location: profileData.location || undefined,
      website: profileData.website || undefined
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    throw new Error(`Profile update failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error sending password reset:', error)
    throw new Error(`Password reset failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Update password
export const updatePassword = async (newPassword: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error updating password:', error)
    throw new Error(`Password update failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = await getCurrentUser()
      callback(user)
    } else {
      callback(null)
    }
  })
} 