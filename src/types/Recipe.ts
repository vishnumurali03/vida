// Import the cuisine enum type from Supabase
import type { Database } from './supabase'

export type CuisineOption = Database['public']['Enums']['cuisineoptions']

export interface Ingredient {
  item: string;
  amount: string;
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  verified?: boolean;
}

export interface NutritionFacts {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  sugar: string;
}

export interface AllergenInfo {
  glutenFree: boolean;
  dairyFree: boolean;
  nutFree: boolean;
  soyFree: boolean;
  vegan: boolean;
  vegetarian?: boolean;
  eggFree?: boolean;
  fishFree?: boolean;
  shellFishFree?: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  cookTime: string;
  prepTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: CuisineOption;
  rating?: number;
  reviews?: number;
  calories: number;
  tags: string[];
  author: Author;
  ingredients: Ingredient[];
  instructions: string[];
  nutritionFacts: NutritionFacts;
  allergenInfo: AllergenInfo;
  dateCreated?: Date;
  isPublished?: boolean;
}

export interface RecipeFormData {
  title: string;
  description: string;
  image: string;
  cookTime: string;
  prepTime: string;
  servings: number;
  difficulty: Recipe['difficulty'];
  cuisine: CuisineOption;
  calories: number;
  tags: string[];
  ingredients: Ingredient[];
  instructions: string[];
  nutritionFacts: NutritionFacts;
  allergenInfo: AllergenInfo;
} 