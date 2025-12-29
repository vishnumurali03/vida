# Vida - Healthy Recipe Platform

Vida is a modern recipe platform focused on healthy, allergen-free recipes. Built with React, TypeScript, and Supabase.

## Features

- 🥗 Allergen-free recipe collection
- 🔍 Advanced recipe search and filtering
- 📱 Responsive design with Bootstrap 5
- 🔐 User authentication with Supabase
- 📤 Recipe submission with image upload
- 🏷️ Recipe tagging and categorization
- 📊 Nutrition information tracking

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Bootstrap 5
- **Build Tool**: Vite
- **Backend**: Supabase (Database + Storage + Auth)
- **Routing**: React Router
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vida
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Important**: The service role key is needed for admin operations. Get it from your Supabase dashboard → Settings → API → Service Role Key. Keep this secret!

### Supabase Setup

1. **Create a new Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Create database tables**:
   Run the following SQL in your Supabase SQL editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  cook_time VARCHAR(50) NOT NULL,
  prep_time VARCHAR(50) NOT NULL,
  servings INTEGER NOT NULL,
  difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  cuisine VARCHAR(100) NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  calories INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_published BOOLEAN DEFAULT TRUE,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  nutrition_facts JSONB,
  allergen_info JSONB NOT NULL,
  tags JSONB NOT NULL
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('recipe-images', 'recipe-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('user-avatars', 'user-avatars', true);

-- Set up Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Users can read all user profiles
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Anyone can read published recipes
CREATE POLICY "Anyone can view published recipes" ON recipes FOR SELECT USING (is_published = true);

-- Users can insert their own recipes
CREATE POLICY "Users can insert own recipes" ON recipes FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Users can update their own recipes
CREATE POLICY "Users can update own recipes" ON recipes FOR UPDATE USING (auth.uid() = author_id);

-- Users can delete their own recipes
CREATE POLICY "Users can delete own recipes" ON recipes FOR DELETE USING (auth.uid() = author_id);

-- Storage policies
CREATE POLICY "Anyone can view recipe images" ON storage.objects FOR SELECT USING (bucket_id = 'recipe-images');
CREATE POLICY "Authenticated users can upload recipe images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'recipe-images' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view user avatars" ON storage.objects FOR SELECT USING (bucket_id = 'user-avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-avatars' AND auth.role() = 'authenticated');
```

3. **Update environment variables**:
   Add your Supabase credentials to the `.env` file.

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── api/                 # Supabase API functions
│   ├── auth.ts         # Authentication functions
│   ├── recipes.ts      # Recipe CRUD operations
│   ├── storage.ts      # File upload functions
│   ├── supabase.ts     # Supabase client setup
│   └── index.ts        # Centralized exports
├── components/         # Reusable React components
│   ├── Layout.tsx      # App layout wrapper
│   ├── Navbar.tsx      # Navigation component
│   └── Footer.tsx      # Footer component
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Recipes.tsx     # Recipe listing page
│   ├── Recipe.tsx      # Individual recipe page
│   └── SubmitRecipe.tsx # Recipe submission form
├── types/              # TypeScript type definitions
│   └── Recipe.ts       # Recipe-related types
└── main.tsx           # App entry point
```

## API Functions

The application uses centralized API functions for all Supabase operations:

### Authentication (`src/api/auth.ts`)
- `signUp()` - User registration
- `signIn()` - User login
- `signOut()` - User logout
- `getCurrentUser()` - Get current authenticated user
- `getUserProfile()` - Get user profile data
- `updateUserProfile()` - Update user profile

### Recipes (`src/api/recipes.ts`)
- `getRecipes()` - Fetch all recipes
- `getRecipeById()` - Fetch single recipe
- `searchRecipes()` - Search recipes by term
- `createRecipe()` - Create new recipe
- `updateRecipe()` - Update existing recipe
- `deleteRecipe()` - Delete recipe
- `getPopularRecipes()` - Get highest-rated recipes
- `getRecentRecipes()` - Get newest recipes

### Storage (`src/api/storage.ts`)
- `uploadRecipeImage()` - Upload recipe images
- `uploadUserAvatar()` - Upload user avatars
- `deleteFile()` - Delete files from storage
- `getFileUrl()` - Get public URL for files

## Usage Example

```typescript
import { createRecipe, uploadRecipeImage } from '../api'

// Create a new recipe with image upload
const recipe = await createRecipe(recipeData, imageFile)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
