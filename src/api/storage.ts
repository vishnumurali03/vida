import { supabase } from './supabase'

// Storage bucket names
export const STORAGE_BUCKETS = {
  RECIPE_IMAGES: 'recipe-images',
  USER_AVATARS: 'user-avatars'
} as const

// Upload image to Supabase storage
export const uploadRecipeImage = async (file: File, recipeId: string): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB')
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${recipeId}-${Date.now()}.${fileExt}`

    // Upload file to Supabase storage
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.RECIPE_IMAGES)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKETS.RECIPE_IMAGES)
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('Error uploading recipe image:', error)
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Upload user avatar
export const uploadUserAvatar = async (file: File, userId: string): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    // Validate file size (2MB limit for avatars)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('Avatar size must be less than 2MB')
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`

    // Upload file to Supabase storage
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.USER_AVATARS)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKETS.USER_AVATARS)
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('Error uploading user avatar:', error)
    throw new Error(`Failed to upload avatar: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Delete file from storage
export const deleteFile = async (bucket: string, filePath: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Get file URL from storage path
export const getFileUrl = (bucket: string, filePath: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)
  
  return publicUrl
} 