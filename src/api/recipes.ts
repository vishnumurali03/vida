import { supabase, supabaseAdmin } from './supabase'
import type { Database } from '../types/supabase'
import type { Recipe, RecipeFormData, CuisineOption } from '../types/Recipe'

// Type aliases for easier use
type DbRecipe = Database['public']['Tables']['recipes']['Row']
type DbRecipeInsert = Database['public']['Tables']['recipes']['Insert']
type DbRecipeUpdate = Database['public']['Tables']['recipes']['Update']

// Transform database recipe to frontend Recipe type
const transformDbRecipe = (dbRecipe: any): Recipe => {
  return {
    id: dbRecipe.id,
    title: dbRecipe.title,
    description: dbRecipe.description || '',
    image: dbRecipe.image || '',
    cookTime: dbRecipe.cook_time,
    prepTime: dbRecipe.prep_time,
    servings: dbRecipe.servings,
    difficulty: dbRecipe.difficulty as 'Easy' | 'Medium' | 'Hard',
    cuisine: dbRecipe.cuisine as CuisineOption,
    rating: dbRecipe.rating || 0,
    reviews: dbRecipe.review_count || 0,
    calories: dbRecipe.calories,
    tags: Array.isArray(dbRecipe.tags) ? dbRecipe.tags : [],
    author: {
      id: dbRecipe.author_id,
      name: dbRecipe.users?.name || 'Unknown',
      avatar: dbRecipe.users?.avatar_url,
      verified: dbRecipe.users?.verified || false
    },
    ingredients: Array.isArray(dbRecipe.ingredients) ? dbRecipe.ingredients : [],
    instructions: Array.isArray(dbRecipe.instructions) ? dbRecipe.instructions : [],
    nutritionFacts: dbRecipe.nutrition_facts || {
      calories: dbRecipe.calories,
      protein: '0g',
      carbs: '0g',
      fat: '0g',
      fiber: '0g',
      sugar: '0g'
    },
    allergenInfo: dbRecipe.allergen_info || {
      glutenFree: false,
      dairyFree: false,
      nutFree: false,
      soyFree: false,
      vegan: false
    },
    dateCreated: new Date(dbRecipe.created_at || ''),
    isPublished: dbRecipe.is_published || false
  }
}

// Fetch all published recipes
export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        users!recipes_author_id_fkey (
          id,
          name,
          avatar_url,
          verified
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return (data || []).map(transformDbRecipe)
  } catch (error) {
    console.error('Error fetching recipes:', error)
    throw new Error(`Failed to fetch recipes: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Fetch recipes by cuisine
export const getRecipesByCuisine = async (cuisine: CuisineOption): Promise<Recipe[]> => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        users!recipes_author_id_fkey (
          id,
          name,
          avatar_url,
          verified
        )
      `)
      .eq('cuisine', cuisine)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return (data || []).map(recipe => {
      const transformed = transformDbRecipe(recipe)
      if (recipe.users) {
        transformed.author = {
          id: recipe.users.id,
          name: recipe.users.name,
          avatar: recipe.users.avatar_url || undefined,
          verified: recipe.users.verified || false
        }
      }
      return transformed
    })
  } catch (error) {
    console.error('Error fetching recipes by cuisine:', error)
    throw new Error(`Failed to fetch ${cuisine} recipes: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Fetch single recipe by ID
export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        users!recipes_author_id_fkey (
          id,
          name,
          avatar_url,
          verified
        )
      `)
      .eq('id', id)
      .eq('is_published', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Recipe not found
      }
      throw error
    }

    return transformDbRecipe(data)
  } catch (error) {
    console.error('Error fetching recipe:', error)
    throw new Error(`Failed to fetch recipe: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Search recipes by title or description
export const searchRecipes = async (query: string): Promise<Recipe[]> => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        users!recipes_author_id_fkey (
          id,
          name,
          avatar_url,
          verified
        )
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return (data || []).map(transformDbRecipe)
  } catch (error) {
    console.error('Error searching recipes:', error)
    throw new Error(`Failed to search recipes: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Create new recipe
export const createRecipe = async (recipeData: RecipeFormData, userId: string, imageUrl?: string): Promise<Recipe> => {
  try {
    const newRecipe: DbRecipeInsert = {
      title: recipeData.title,
      description: recipeData.description,
      image: imageUrl || recipeData.image,
      cook_time: recipeData.cookTime,
      prep_time: recipeData.prepTime,
      servings: recipeData.servings,
      difficulty: recipeData.difficulty,
      cuisine: recipeData.cuisine,
      calories: recipeData.calories,
      tags: recipeData.tags as any,
      ingredients: recipeData.ingredients as any,
      instructions: recipeData.instructions as any,
      nutrition_facts: recipeData.nutritionFacts as any,
      allergen_info: recipeData.allergenInfo as any,
      author_id: userId,
      is_published: true
    }

    const { data, error } = await supabaseAdmin
      .from('recipes')
      .insert(newRecipe)
      .select(`
        *,
        users!recipes_author_id_fkey (
          id,
          name,
          avatar_url,
          verified
        )
      `)
      .single()

    if (error) {
      throw error
    }

    return transformDbRecipe(data)
  } catch (error) {
    console.error('Error creating recipe:', error)
    throw new Error(`Failed to create recipe: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Update existing recipe
export const updateRecipe = async (id: string, recipeData: Partial<RecipeFormData>, imageUrl?: string): Promise<Recipe> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User must be authenticated to update recipes')
    }

    // Check if user owns the recipe
    const { data: existingRecipe, error: fetchError } = await supabase
      .from('recipes')
      .select('author_id, image')
      .eq('id', id)
      .single()

    if (fetchError) {
      throw new Error('Recipe not found')
    }

    if (existingRecipe.author_id !== user.id) {
      throw new Error('You can only update your own recipes')
    }

    // Prepare update data
    const updateData: DbRecipeUpdate = {
      updated_at: new Date().toISOString()
    }

    if (recipeData.title) updateData.title = recipeData.title
    if (recipeData.description !== undefined) updateData.description = recipeData.description
    if (imageUrl !== undefined) updateData.image = imageUrl
    if (recipeData.cookTime) updateData.cook_time = recipeData.cookTime
    if (recipeData.prepTime) updateData.prep_time = recipeData.prepTime
    if (recipeData.servings) updateData.servings = recipeData.servings
    if (recipeData.difficulty) updateData.difficulty = recipeData.difficulty
    if (recipeData.cuisine) updateData.cuisine = recipeData.cuisine
    if (recipeData.nutritionFacts?.calories) updateData.calories = recipeData.nutritionFacts.calories
    if (recipeData.ingredients) updateData.ingredients = recipeData.ingredients as any
    if (recipeData.instructions) updateData.instructions = recipeData.instructions as any
    if (recipeData.nutritionFacts) updateData.nutrition_facts = recipeData.nutritionFacts as any
    if (recipeData.allergenInfo) updateData.allergen_info = recipeData.allergenInfo as any
    if (recipeData.tags) updateData.tags = recipeData.tags as any

    // Update recipe in database
    const { data, error } = await supabase
      .from('recipes')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        users!recipes_author_id_fkey (
          id,
          name,
          avatar_url,
          verified
        )
      `)
      .single()

    if (error) {
      throw error
    }

    const transformed = transformDbRecipe(data)
    if (data.users) {
      transformed.author = {
        id: data.users.id,
        name: data.users.name,
        avatar: data.users.avatar_url || undefined,
        verified: data.users.verified || false
      }
    }
    return transformed
  } catch (error) {
    console.error('Error updating recipe:', error)
    throw new Error(`Failed to update recipe: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Delete recipe
export const deleteRecipe = async (id: string): Promise<void> => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User must be authenticated to delete recipes')
    }

    // Check if user owns the recipe
    const { data: existingRecipe, error: fetchError } = await supabase
      .from('recipes')
      .select('author_id')
      .eq('id', id)
      .single()

    if (fetchError) {
      throw new Error('Recipe not found')
    }

    if (existingRecipe.author_id !== user.id) {
      throw new Error('You can only delete your own recipes')
    }

    // Delete recipe from database
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error deleting recipe:', error)
    throw new Error(`Failed to delete recipe: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Get popular recipes (highest rated)
export const getPopularRecipes = async (limit: number = 10): Promise<Recipe[]> => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        users!recipes_author_id_fkey (
          id,
          name,
          avatar_url,
          verified
        )
      `)
      .eq('is_published', true)
      .order('rating', { ascending: false })
      .order('review_count', { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return (data || []).map(transformDbRecipe)
  } catch (error) {
    console.error('Error fetching popular recipes:', error)
    throw new Error(`Failed to fetch popular recipes: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Get recent recipes
export const getRecentRecipes = async (limit: number = 10): Promise<Recipe[]> => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        users!recipes_author_id_fkey (
          id,
          name,
          avatar_url,
          verified
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return (data || []).map(transformDbRecipe)
  } catch (error) {
    console.error('Error fetching recent recipes:', error)
    throw new Error(`Failed to fetch recent recipes: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Get all available cuisine options
export const getCuisineOptions = (): CuisineOption[] => {
  return [
    'Italian',
    'Asian', 
    'Mediterranean',
    'Mexican',
    'Indian',
    'American',
    'French',
    'Middle Eastern',
    'Thai',
    'Japanese',
    'Chinese',
    'Greek',
    'Spanish',
    'Korean',
    'Vietnamese',
    'Other'
  ]
} 