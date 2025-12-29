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
      {/* <section className="py-5 bg-light">
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
      </section> */}

      


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

      {/* About Vida Section */}
      <section className="py-5 bg-white">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold mb-4">
                  Vida: Empowering Health Through <span className="text-success">Food</span>
                </h2>
              </div>

              <div className="card border-0 shadow-sm p-4 mb-4">
                <div className="card-body">
                  <p className="lead text-dark mb-4">
                    At Vida, we believe that healthy living starts with what's on your plate. Our platform is packed with a curated collection of nutritious, flavorful recipes that make wholesome eating simple, enjoyable, and accessible for every age and lifestyle. Whether you're looking for quick weekday meals, family-friendly dinners, or creative ways to incorporate more fruits, vegetables, and whole foods into your diet, Vida provides the inspiration and guidance to help you make informed, health-conscious choices. We're more than a recipe directory. We are a community dedicated to wellness, mindful eating, and turning nutritious habits into a joyful part of everyday life.
                  </p>
                  <p className="lead text-dark mb-0">
                    Vida is also committed to raising awareness about eating disorders and fostering a positive, empowering relationship with food. Our thoughtfully curated directory makes it easy to find recipes that not only nourish your body but also help you feel confident, energized, and good about yourself. By combining education, support, and access to feel-good meals, Vida encourages choices that promote both physical health and mental well-being.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Community Section */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="card border-0 shadow-lg overflow-hidden">
                <div className="row g-0">
                  <div className="col-md-4" style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    minHeight: '350px'
                  }}>
                    <div className="h-100 d-flex flex-column justify-content-center align-items-center text-white p-4">
                      <svg width="80" height="80" fill="white" viewBox="0 0 24 24" className="mb-4">
                        <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h2 className="h3 fw-bold text-center">Join the Vida Community!</h2>
                    </div>
                  </div>
                  
                  <div className="col-md-8">
                    <div className="p-5">
                      <p className="lead text-dark mb-4">
                        Vida thrives on shared ideas and real experiences. Submit your favorite healthy recipes along with photos, or contribute articles on healthy eating, exercise, body image, or eating disorder awareness. Your recipes can inspire others and show that healthy eating is real, personal, and achievable.
                      </p>
                      <p className="lead text-dark mb-4">
                        Together, we can make healthy living more accessible, inclusive, and empowering, one recipe, one story, and one community at a time.
                      </p>

                      <div className="d-flex gap-3">
                        <Link to="/submit" className="btn btn-success btn-lg">
                          Submit Recipe
                        </Link>
                        <Link to="/articles" className="btn btn-outline-success btn-lg">
                          Read Articles
                        </Link>
                      </div>
                    </div>
                  </div>
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