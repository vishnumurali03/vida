import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { type Recipe as RecipeType } from '../types/Recipe'
import { getRecipeById } from '../api/recipes'

// Sample recipe data - in a real app, this would come from an API
const sampleRecipes = {
  '123e4567-e89b-12d3-a456-426614174000': {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Mediterranean Quinoa Bowl',
    description: 'A vibrant, nutritious bowl packed with fresh vegetables, quinoa, and a zesty lemon-herb dressing. Perfect for a healthy lunch or dinner.',
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80',
    cookTime: '25 minutes',
    prepTime: '15 minutes',
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'Mediterranean',
    rating: 4.8,
    reviews: 127,
    calories: 320,
    tags: ['Gluten-Free', 'Vegan', 'High-Protein', 'Dairy-Free'],
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c96?auto=format&fit=crop&w=100&q=80',
      verified: true
    },
    ingredients: [
      { item: 'Quinoa, rinsed', amount: '1 cup' },
      { item: 'Cucumber, diced', amount: '1 medium' },
      { item: 'Cherry tomatoes, halved', amount: '1 cup' },
      { item: 'Red bell pepper, diced', amount: '1 medium' },
      { item: 'Red onion, finely diced', amount: '1/4 cup' },
      { item: 'Fresh parsley, chopped', amount: '1/4 cup' },
      { item: 'Fresh mint, chopped', amount: '2 tablespoons' },
      { item: 'Kalamata olives, pitted', amount: '1/3 cup' },
      { item: 'Extra virgin olive oil', amount: '3 tablespoons' },
      { item: 'Fresh lemon juice', amount: '2 tablespoons' },
      { item: 'Garlic, minced', amount: '2 cloves' },
      { item: 'Salt and pepper', amount: 'to taste' }
    ],
    instructions: [
      'Cook quinoa according to package instructions. Let cool to room temperature.',
      'Meanwhile, prepare all vegetables by dicing cucumber, halving cherry tomatoes, and dicing bell pepper and red onion.',
      'In a small bowl, whisk together olive oil, lemon juice, minced garlic, salt, and pepper to make the dressing.',
      'In a large bowl, combine cooled quinoa with all prepared vegetables.',
      'Add fresh herbs (parsley and mint) and kalamata olives.',
      'Pour dressing over the quinoa mixture and toss gently to combine.',
      'Taste and adjust seasoning as needed.',
      'Serve immediately or refrigerate for up to 3 days. The flavors improve with time!'
    ],
    nutritionFacts: {
      calories: 320,
      protein: '12g',
      carbs: '45g',
      fat: '12g',
      fiber: '6g',
      sugar: '8g'
    },
    allergenInfo: {
      glutenFree: true,
      dairyFree: true,
      nutFree: true,
      soyFree: true,
      vegan: true
    }
  },
  '987fcdeb-51a2-43d1-b890-123456789abc': {
    id: '987fcdeb-51a2-43d1-b890-123456789abc',
    title: 'Fluffy Oat Pancakes',
    description: 'Light, fluffy pancakes made with oat flour and natural sweeteners. A healthy breakfast that doesn\'t compromise on taste.',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
    cookTime: '15 minutes',
    prepTime: '10 minutes',
    servings: 3,
    difficulty: 'Easy',
    cuisine: 'American',
    rating: 4.9,
    reviews: 203,
    calories: 280,
    tags: ['Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Quick'],
    author: {
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      verified: true
    },
    ingredients: [
      { item: 'Oat flour', amount: '1½ cups' },
      { item: 'Baking powder', amount: '2 teaspoons' },
      { item: 'Salt', amount: '½ teaspoon' },
      { item: 'Almond milk', amount: '1¼ cups' },
      { item: 'Maple syrup', amount: '2 tablespoons' },
      { item: 'Vanilla extract', amount: '1 teaspoon' },
      { item: 'Coconut oil, melted', amount: '2 tablespoons' },
      { item: 'Apple cider vinegar', amount: '1 teaspoon' }
    ],
    instructions: [
      'In a large bowl, whisk together oat flour, baking powder, and salt.',
      'In another bowl, combine almond milk, maple syrup, vanilla extract, melted coconut oil, and apple cider vinegar.',
      'Pour wet ingredients into dry ingredients and stir until just combined. Don\'t overmix.',
      'Let batter rest for 5 minutes to thicken.',
      'Heat a non-stick pan or griddle over medium heat.',
      'Pour ¼ cup of batter for each pancake onto the hot surface.',
      'Cook until bubbles form on surface and edges look set, about 2-3 minutes.',
      'Flip and cook for another 1-2 minutes until golden brown.',
      'Serve immediately with fresh fruit and maple syrup.'
    ],
    nutritionFacts: {
      calories: 280,
      protein: '8g',
      carbs: '42g',
      fat: '9g',
      fiber: '5g',
      sugar: '12g'
    },
    allergenInfo: {
      glutenFree: true,
      dairyFree: true,
      nutFree: true,
      soyFree: true,
      vegan: true
    }
  }
}

export default function Recipe() {
  const { uuid } = useParams<{ uuid: string }>()
  const [activeTab, setActiveTab] = useState('ingredients')
  const [servings, setServings] = useState(4)
  const [recipe, setRecipe] = useState<RecipeType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!uuid) {
        setError('Recipe ID not provided')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const recipeData = await getRecipeById(uuid)
        if (recipeData) {
          setRecipe(recipeData)
          setServings(recipeData.servings)
        } else {
          setError('Recipe not found')
        }
      } catch (err) {
        console.error('Error fetching recipe:', err)
        setError('Failed to load recipe')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [uuid])

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading recipe...</p>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24" className="text-muted mb-3">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <h2 className="h4 mb-3">{error || 'Recipe Not Found'}</h2>
          <p className="text-muted mb-4">
            {error === 'Failed to load recipe' 
              ? 'Unable to load the recipe. Please try again later.'
              : 'The recipe you\'re looking for doesn\'t exist or has been moved.'
            }
          </p>
          <Link to="/recipes" className="btn btn-success">
            Browse All Recipes
          </Link>
        </div>
      </div>
    )
  }

  const adjustedServings = servings || recipe.servings

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container py-5">
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                  <li className="breadcrumb-item"><Link to="/recipes">Recipes</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">{recipe.title}</li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="row g-5">
            {/* Recipe Image */}
            <div className="col-lg-6">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="img-fluid rounded-3 shadow"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            </div>

            {/* Recipe Info */}
            <div className="col-lg-6">
              <div className="d-flex flex-wrap gap-2 mb-3">
                {recipe.tags.map((tag, index) => (
                  <span key={index} className="badge bg-success-subtle text-success">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="display-5 fw-bold mb-3">{recipe.title}</h1>
              <p className="lead text-muted mb-4">{recipe.description}</p>

              {/* Author Info */}
              <div className="d-flex align-items-center mb-4">
                <img
                  src={recipe.author.avatar}
                  alt={recipe.author.name}
                  className="rounded-circle me-3"
                  width="50"
                  height="50"
                />
                <div>
                  <div className="d-flex align-items-center">
                    <h6 className="mb-0 me-2">{recipe.author.name}</h6>
                    {recipe.author.verified && (
                      <svg width="16" height="16" fill="#28a745" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    )}
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="text-warning me-1">⭐</span>
                    <span className="me-2">{recipe.rating}</span>
                    <small className="text-muted">({recipe.reviews} reviews)</small>
                  </div>
                </div>
              </div>

              {/* Recipe Stats */}
              <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                  <div className="text-center p-3 bg-light rounded">
                    <div className="h5 mb-1">{recipe.prepTime}</div>
                    <small className="text-muted">Prep Time</small>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="text-center p-3 bg-light rounded">
                    <div className="h5 mb-1">{recipe.cookTime}</div>
                    <small className="text-muted">Cook Time</small>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="text-center p-3 bg-light rounded">
                    <div className="h5 mb-1">{recipe.servings}</div>
                    <small className="text-muted">Servings</small>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="text-center p-3 bg-light rounded">
                    <div className="h5 mb-1">{recipe.difficulty}</div>
                    <small className="text-muted">Difficulty</small>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-3">
                <button className="btn btn-success btn-lg">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="me-2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Save Recipe
                </button>
                <button className="btn btn-outline-success btn-lg">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="me-2">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Content */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            {/* Main Content */}
            <div className="col-lg-8">
              {/* Tab Navigation */}
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'ingredients' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ingredients')}
                  >
                    Ingredients
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'instructions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('instructions')}
                  >
                    Instructions
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'nutrition' ? 'active' : ''}`}
                    onClick={() => setActiveTab('nutrition')}
                  >
                    Nutrition
                  </button>
                </li>
              </ul>

              {/* Tab Content */}
              <div className="tab-content">
                {/* Ingredients Tab */}
                {activeTab === 'ingredients' && (
                  <div className="bg-white rounded-3 p-4 shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="h4 mb-0">Ingredients</h3>
                      <div className="d-flex align-items-center">
                        <label className="me-2">Servings:</label>
                        <div className="input-group" style={{width: '120px'}}>
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => setServings(Math.max(1, servings - 1))}
                          >
                            -
                          </button>
                          <input 
                            type="number" 
                            className="form-control text-center" 
                            value={adjustedServings}
                            onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                            min="1"
                          />
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => setServings(servings + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <ul className="list-group list-group-flush">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center border-0 px-0">
                          <span>{ingredient.item}</span>
                          <span className="fw-semibold text-success">{ingredient.amount}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Instructions Tab */}
                {activeTab === 'instructions' && (
                  <div className="bg-white rounded-3 p-4 shadow-sm">
                    <h3 className="h4 mb-4">Instructions</h3>
                    <ol className="list-group list-group-numbered">
                      {recipe.instructions.map((step, index) => (
                        <li key={index} className="list-group-item border-0 px-0 py-3">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Nutrition Tab */}
                {activeTab === 'nutrition' && (
                  <div className="bg-white rounded-3 p-4 shadow-sm">
                    <h3 className="h4 mb-4">Nutrition Facts</h3>
                    <div className="row g-3">
                      {Object.entries(recipe.nutritionFacts).map(([key, value]) => (
                        <div key={key} className="col-6 col-md-4">
                          <div className="text-center p-3 bg-light rounded">
                            <div className="h5 mb-1">{value}</div>
                            <small className="text-muted text-capitalize">{key}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              {/* Allergen Information */}
              <div className="bg-white rounded-3 p-4 shadow-sm mb-4">
                <h4 className="h5 mb-3">Allergen Information</h4>
                <div className="d-flex flex-wrap gap-2">
                  {Object.entries(recipe.allergenInfo).map(([key, value]) => (
                    value && (
                      <span key={key} className="badge bg-success-subtle text-success">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    )
                  ))}
                </div>
              </div>

              {/* Related Recipes */}
              <div className="bg-white rounded-3 p-4 shadow-sm">
                <h4 className="h5 mb-3">More {recipe.cuisine} Recipes</h4>
                <div className="d-grid gap-3">
                  <div className="d-flex">
                    <img 
                      src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=100&q=80"
                      alt="Related recipe"
                      className="rounded me-3"
                      style={{width: '60px', height: '60px', objectFit: 'cover'}}
                    />
                    <div>
                      <h6 className="mb-1">Greek Salad Bowl</h6>
                      <small className="text-muted">⭐ 4.7 (89 reviews)</small>
                    </div>
                  </div>
                  <div className="d-flex">
                    <img 
                      src="https://images.unsplash.com/photo-1544378730-6f3c9b2b5d8b?auto=format&fit=crop&w=100&q=80"
                      alt="Related recipe"
                      className="rounded me-3"
                      style={{width: '60px', height: '60px', objectFit: 'cover'}}
                    />
                    <div>
                      <h6 className="mb-1">Hummus & Veggie Wrap</h6>
                      <small className="text-muted">⭐ 4.6 (134 reviews)</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 