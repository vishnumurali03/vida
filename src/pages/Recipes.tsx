import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { type Recipe, type CuisineOption } from '../types/Recipe'
import { getRecipes, getPopularRecipes, searchRecipes, getRecipesByCuisine, getCuisineOptions } from '../api/recipes'
import RecipeCard from '../components/RecipeCard'



export default function Recipes() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineOption | 'all' | 'popular'>('all')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cuisineOptions = getCuisineOptions()

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let recipeData: Recipe[]
        
        if (searchTerm) {
          recipeData = await searchRecipes(searchTerm)
        } else if (selectedCuisine === 'popular') {
          recipeData = await getPopularRecipes(20)
        } else if (selectedCuisine === 'all') {
          recipeData = await getRecipes()
        } else {
          recipeData = await getRecipesByCuisine(selectedCuisine)
        }
        
        setRecipes(recipeData)
      } catch (err) {
        console.error('Error fetching recipes:', err)
        setError('Failed to load recipes')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [searchTerm, selectedCuisine])

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section with Search */}
      <section className="bg-white py-5 shadow-sm">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">
                Discover <span className="text-success">Healthy Recipes</span>
              </h1>
              <p className="lead text-muted mb-5">
                Explore our collection of delicious, allergen-free recipes from cuisines around the world
              </p>
              
              {/* Search Bar */}
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <div className="input-group input-group-lg mb-4">
                    <span className="input-group-text bg-white border-end-0">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19ZM21 21L16.514 16.506L21 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search for recipes, cuisines, or ingredients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Cuisine Filter Tabs */}
              <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                <button 
                  className={`btn ${selectedCuisine === 'all' ? 'btn-success' : 'btn-outline-success'} btn-sm`}
                  onClick={() => setSelectedCuisine('all')}
                >
                  All
                </button>
                <button 
                  className={`btn ${selectedCuisine === 'popular' ? 'btn-success' : 'btn-outline-success'} btn-sm`}
                  onClick={() => setSelectedCuisine('popular')}
                >
                  Popular
                </button>
                {cuisineOptions.map((cuisine) => (
                  <button 
                    key={cuisine}
                    className={`btn ${selectedCuisine === cuisine ? 'btn-success' : 'btn-outline-success'} btn-sm`}
                    onClick={() => setSelectedCuisine(cuisine)}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="py-5">
        <div className="container">
          {/* Results Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="h4 mb-0">
                  {searchTerm ? `Search Results for "${searchTerm}"` : 
                   selectedCuisine === 'all' ? 'All Recipes' :
                   selectedCuisine === 'popular' ? 'Most Popular Recipes' :
                   `${selectedCuisine} Recipes`}
                </h3>
                {!loading && recipes.length > 0 && (
                  <span className="text-muted">
                    {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading recipes...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="row">
              <div className="col-12 text-center py-5">
                <div className="alert alert-danger">
                  <h5>Error Loading Recipes</h5>
                  <p className="mb-0">{error}</p>
                </div>
                <button 
                  className="btn btn-success"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Recipes Grid */}
          {!loading && !error && (
            <>
              {recipes.length > 0 ? (
                <div className="row g-4">
                  {recipes.map((recipe) => (
                    <div key={recipe.id} className="col-md-6 col-lg-4">
                      <RecipeCard recipe={recipe} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="row">
                  <div className="col-12 text-center py-5">
                    <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24" className="text-muted mb-3">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <h5 className="text-muted mb-3">No Recipes Found</h5>
                    <p className="text-muted mb-4">
                      {searchTerm 
                        ? `No recipes found matching "${searchTerm}". Try a different search term.`
                        : selectedCuisine !== 'all' 
                        ? `No ${selectedCuisine} recipes available yet. Be the first to submit one!`
                        : 'No recipes available yet. Be the first to submit one!'
                      }
                    </p>
                    <Link to="/submit" className="btn btn-success">
                      Submit Recipe
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <h2 className="display-6 fw-bold mb-3">Featured Recipes</h2>
              <p className="lead text-muted">
                Try these popular allergen-free recipes loved by our community
              </p>
            </div>
          </div>

          <div className="row g-4">
            {/* Sample featured recipes */}
            <div className="col-md-4">
              <Link to="/recipe/123e4567-e89b-12d3-a456-426614174000" className="text-decoration-none">
                <div className="card border-0 shadow-sm h-100">
                  <img
                    src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=500&q=80"
                    alt="Mediterranean Quinoa Bowl"
                    className="card-img-top"
                    style={{height: '200px', objectFit: 'cover'}}
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold text-dark">Mediterranean Quinoa Bowl</h5>
                    <p className="card-text text-muted">A colorful, nutritious bowl packed with vegetables and quinoa</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex gap-1">
                        <span className="badge bg-success-subtle text-success">Gluten-Free</span>
                        <span className="badge bg-primary-subtle text-primary">Vegan</span>
                      </div>
                      <small className="text-muted">⭐ 4.8 (127)</small>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-4">
              <Link to="/recipe/987fcdeb-51a2-43d1-b890-123456789abc" className="text-decoration-none">
                <div className="card border-0 shadow-sm h-100">
                  <img
                    src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=500&q=80"
                    alt="Fluffy Oat Pancakes"
                    className="card-img-top"
                    style={{height: '200px', objectFit: 'cover'}}
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold text-dark">Fluffy Oat Pancakes</h5>
                    <p className="card-text text-muted">Light and fluffy pancakes made with oat flour and natural sweeteners</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex gap-1">
                        <span className="badge bg-success-subtle text-success">Nut-Free</span>
                        <span className="badge bg-warning-subtle text-warning">Dairy-Free</span>
                      </div>
                      <small className="text-muted">⭐ 4.9 (203)</small>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <img
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80"
                  alt="Smoothie Bowl"
                  className="card-img-top"
                  style={{height: '200px', objectFit: 'cover'}}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">Tropical Smoothie Bowl</h5>
                  <p className="card-text text-muted">Refreshing smoothie bowl topped with fresh fruits and seeds</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-1">
                      <span className="badge bg-primary-subtle text-primary">Raw</span>
                      <span className="badge bg-success-subtle text-success">Soy-Free</span>
                    </div>
                    <small className="text-muted">⭐ 4.7 (89)</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link to="/recipes/all" className="btn btn-success btn-lg">
              View All Recipes
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 