import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { type Recipe } from '../types/Recipe'
import { getPopularRecipes, getRecentRecipes } from '../api/recipes'
import RecipeCard from '../components/RecipeCard'

export default function Home() {
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([])
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const [popular, recent] = await Promise.all([
          getPopularRecipes(3),
          getRecentRecipes(3)
        ])
        setPopularRecipes(popular)
        setRecentRecipes(recent)
      } catch (error) {
        console.error('Error fetching recipes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section d-flex align-items-center">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-10">
              <h1 className="display-3 fw-bold mb-4">
                Healthy & <span className="text-success">Allergen-Free</span><br />
                Recipes
              </h1>
              <p className="lead mb-5 text-muted">
                Discover, cook, and share delicious recipes tailored to your dietary needs.
                Every recipe is carefully crafted to be both nutritious and incredibly tasty.
              </p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mb-5">
                <Link
                  to="/recipes"
                  className="btn btn-success btn-lg btn-custom"
                >
                  Browse Recipes
                </Link>
                <Link
                  to="/submit"
                  className="btn btn-outline-success btn-lg btn-custom"
                >
                  Submit Your Own
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <div className="container py-5">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-4">Why Choose Vida?</h2>
              <p className="lead text-muted">
                We make healthy cooking accessible, enjoyable, and safe for everyone.
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            {/* Feature 1 */}
            <div className="col-md-4">
              <div className="card feature-card h-100 text-center p-4 bg-light">
                <div className="card-body">
                  <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '64px', height: '64px'}}>
                    <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="h5 fw-bold mb-3">Allergen-Free</h3>
                  <p className="text-muted">
                    All recipes are carefully curated to be free from common allergens while maintaining incredible taste.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-md-4">
              <div className="card feature-card h-100 text-center p-4 bg-light">
                <div className="card-body">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '64px', height: '64px'}}>
                    <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="h5 fw-bold mb-3">Quick & Easy</h3>
                  <p className="text-muted">
                    Step-by-step instructions that make cooking simple, even for beginners.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-md-4">
              <div className="card feature-card h-100 text-center p-4 bg-light">
                <div className="card-body">
                  <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{width: '64px', height: '64px'}}>
                    <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="h5 fw-bold mb-3">Community Driven</h3>
                  <p className="text-muted">
                    Share your own recipes and discover new favorites from our passionate community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-4">Fresh, Healthy, Delicious</h2>
              <p className="lead text-muted">
                Get inspired by our collection of beautiful, nutritious meals
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card image-card border-0 shadow">
                <img
                  src="https://images.unsplash.com/photo-1604908177522-bb132032b45a?auto=format&fit=crop&w=600&q=80"
                  alt="Colorful healthy salad"
                  className="card-img-top"
                  style={{height: '250px', objectFit: 'cover'}}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">Fresh Salads</h5>
                  <p className="card-text text-muted">Crisp, colorful, and nutritious</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card image-card border-0 shadow">
                <img
                  src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=600&q=80"
                  alt="Fresh cooking ingredients"
                  className="card-img-top"
                  style={{height: '250px', objectFit: 'cover'}}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">Fresh Ingredients</h5>
                  <p className="card-text text-muted">Quality ingredients for better meals</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card image-card border-0 shadow">
                <img
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80"
                  alt="Healthy smoothie bowl"
                  className="card-img-top"
                  style={{height: '250px', objectFit: 'cover'}}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">Smoothie Bowls</h5>
                  <p className="card-text text-muted">Nutritious and Instagram-worthy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-5 bg-white">
        <div className="container py-5">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-4">Featured Recipes</h2>
              <p className="lead text-muted">
                Discover our most popular and recently added recipes
              </p>
            </div>
          </div>

          {/* Popular Recipes */}
          <div className="mb-5">
            <h3 className="h4 fw-bold mb-4">Most Popular</h3>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : popularRecipes.length > 0 ? (
              <div className="row g-4">
                {popularRecipes.map((recipe) => (
                  <div key={recipe.id} className="col-md-4">
                    <RecipeCard recipe={recipe} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <p>No popular recipes available yet. Be the first to submit one!</p>
                <Link to="/submit" className="btn btn-success">
                  Submit Recipe
                </Link>
              </div>
            )}
          </div>

          {/* Recent Recipes */}
          <div className="mb-5">
            <h3 className="h4 fw-bold mb-4">Recently Added</h3>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : recentRecipes.length > 0 ? (
              <div className="row g-4">
                {recentRecipes.map((recipe) => (
                  <div key={recipe.id} className="col-md-4">
                    <RecipeCard recipe={recipe} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <p>No recent recipes available yet. Be the first to submit one!</p>
                <Link to="/submit" className="btn btn-success">
                  Submit Recipe
                </Link>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link to="/recipes" className="btn btn-outline-success btn-lg">
              View All Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 text-white">
        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-4">
                Ready to Start Your Healthy Journey?
              </h2>
              <p className="lead mb-4">
                Join thousands of home cooks who are already enjoying delicious, allergen-free meals.
              </p>
              <Link
                to="/recipes"
                className="btn btn-light btn-lg btn-custom text-success fw-bold"
              >
                Start Cooking Today
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 