-- Vida Recipe Platform Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  bio TEXT,
  location VARCHAR(255),
  website VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  cook_time VARCHAR(50) NOT NULL,
  prep_time VARCHAR(50) NOT NULL,
  servings INTEGER NOT NULL CHECK (servings > 0),
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  cuisine VARCHAR(100) NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  calories INTEGER NOT NULL CHECK (calories >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_published BOOLEAN DEFAULT TRUE,
  
  -- JSONB fields for flexible data storage
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  nutrition_facts JSONB,
  allergen_info JSONB NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Create recipe reviews table
CREATE TABLE IF NOT EXISTS recipe_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one review per user per recipe
  UNIQUE(recipe_id, user_id)
);

-- Create recipe favorites table (for user bookmarks)
CREATE TABLE IF NOT EXISTS recipe_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one favorite per user per recipe
  UNIQUE(recipe_id, user_id)
);

-- Create recipe collections table (user-created recipe collections)
CREATE TABLE IF NOT EXISTS recipe_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction table for recipes in collections
CREATE TABLE IF NOT EXISTS collection_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES recipe_collections(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure recipe can only be added once per collection
  UNIQUE(collection_id, recipe_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recipes_author_id ON recipes(author_id);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON recipes(cuisine);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_recipes_rating ON recipes(rating DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_is_published ON recipes(is_published);
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_recipes_ingredients ON recipes USING GIN(ingredients);

CREATE INDEX IF NOT EXISTS idx_recipe_reviews_recipe_id ON recipe_reviews(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_reviews_user_id ON recipe_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_recipe_reviews_rating ON recipe_reviews(rating);

CREATE INDEX IF NOT EXISTS idx_recipe_favorites_recipe_id ON recipe_favorites(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_favorites_user_id ON recipe_favorites(user_id);

CREATE INDEX IF NOT EXISTS idx_recipe_collections_user_id ON recipe_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_recipes_collection_id ON collection_recipes(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_recipes_recipe_id ON collection_recipes(recipe_id);

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-avatars', 'user-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_recipes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all profiles" ON users 
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for recipes table
CREATE POLICY "Anyone can view published recipes" ON recipes 
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can view own recipes" ON recipes 
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can insert own recipes" ON recipes 
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own recipes" ON recipes 
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own recipes" ON recipes 
  FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for recipe_reviews table
CREATE POLICY "Anyone can view reviews" ON recipe_reviews 
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reviews" ON recipe_reviews 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON recipe_reviews 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON recipe_reviews 
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for recipe_favorites table
CREATE POLICY "Users can view own favorites" ON recipe_favorites 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON recipe_favorites 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON recipe_favorites 
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for recipe_collections table
CREATE POLICY "Anyone can view public collections" ON recipe_collections 
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own collections" ON recipe_collections 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own collections" ON recipe_collections 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own collections" ON recipe_collections 
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for collection_recipes table
CREATE POLICY "Anyone can view public collection recipes" ON collection_recipes 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recipe_collections 
      WHERE recipe_collections.id = collection_recipes.collection_id 
      AND (recipe_collections.is_public = true OR recipe_collections.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage own collection recipes" ON collection_recipes 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM recipe_collections 
      WHERE recipe_collections.id = collection_recipes.collection_id 
      AND recipe_collections.user_id = auth.uid()
    )
  );

-- Storage policies
CREATE POLICY "Anyone can view recipe images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can upload recipe images" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'recipe-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own recipe images" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'recipe-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete own recipe images" ON storage.objects 
  FOR DELETE USING (bucket_id = 'recipe-images' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view user avatars" ON storage.objects 
  FOR SELECT USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'user-avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own avatar" ON storage.objects 
  FOR UPDATE USING (bucket_id = 'user-avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete own avatar" ON storage.objects 
  FOR DELETE USING (bucket_id = 'user-avatars' AND auth.role() = 'authenticated');

-- Functions to update rating when reviews are added/updated/deleted
CREATE OR REPLACE FUNCTION update_recipe_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the recipe's average rating and review count
  UPDATE recipes 
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 1) 
      FROM recipe_reviews 
      WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM recipe_reviews 
      WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update recipe ratings
CREATE TRIGGER trigger_update_recipe_rating_on_insert
  AFTER INSERT ON recipe_reviews
  FOR EACH ROW EXECUTE FUNCTION update_recipe_rating();

CREATE TRIGGER trigger_update_recipe_rating_on_update
  AFTER UPDATE ON recipe_reviews
  FOR EACH ROW EXECUTE FUNCTION update_recipe_rating();

CREATE TRIGGER trigger_update_recipe_rating_on_delete
  AFTER DELETE ON recipe_reviews
  FOR EACH ROW EXECUTE FUNCTION update_recipe_rating();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at timestamps
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_recipe_reviews_updated_at
  BEFORE UPDATE ON recipe_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_recipe_collections_updated_at
  BEFORE UPDATE ON recipe_collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
-- You can uncomment this section if you want some initial data

/*
-- Sample users (these will be created when users sign up through auth)
INSERT INTO users (id, email, name, verified) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'sarah@example.com', 'Sarah Chen', true),
  ('22222222-2222-2222-2222-222222222222', 'mike@example.com', 'Mike Johnson', true)
ON CONFLICT (id) DO NOTHING;

-- Sample recipes
INSERT INTO recipes (
  id, title, description, cook_time, prep_time, servings, difficulty, cuisine, 
  calories, author_id, ingredients, instructions, allergen_info, tags
) VALUES 
  (
    '123e4567-e89b-12d3-a456-426614174000',
    'Mediterranean Quinoa Bowl',
    'A vibrant, nutritious bowl packed with fresh vegetables, quinoa, and a zesty lemon-herb dressing.',
    '25 minutes',
    '15 minutes',
    4,
    'Easy',
    'Mediterranean',
    320,
    '11111111-1111-1111-1111-111111111111',
    '[
      {"item": "Quinoa, rinsed", "amount": "1 cup"},
      {"item": "Cucumber, diced", "amount": "1 medium"},
      {"item": "Cherry tomatoes, halved", "amount": "1 cup"}
    ]'::jsonb,
    '[
      "Cook quinoa according to package instructions. Let cool to room temperature.",
      "Meanwhile, prepare all vegetables by dicing cucumber, halving cherry tomatoes.",
      "In a small bowl, whisk together olive oil, lemon juice, minced garlic, salt, and pepper."
    ]'::jsonb,
    '{"glutenFree": true, "dairyFree": true, "nutFree": true, "soyFree": true, "vegan": true}'::jsonb,
    '["Gluten-Free", "Vegan", "High-Protein", "Dairy-Free"]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;
*/ 