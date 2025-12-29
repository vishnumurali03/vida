import { Link } from 'react-router-dom'
import type { Recipe } from '../types/Recipe'

interface RecipeCardProps {
  recipe: Recipe
  showAuthor?: boolean
}

export default function RecipeCard({ recipe, showAuthor = true }: RecipeCardProps) {
  return (
    <div className="card recipe-card h-100 border-0 shadow-sm overflow-hidden">
      <div className="position-relative" style={{ height: '200px' }}>
        <img
          src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'}
          alt={recipe.title}
          className="card-img-top h-100 w-100"
          style={{ objectFit: 'cover' }}
        />
        
        {/* Difficulty Badge */}
        <div className="position-absolute top-0 end-0 m-2">
          <span className={`badge ${
            recipe.difficulty === 'Easy' ? 'bg-success' :
            recipe.difficulty === 'Medium' ? 'bg-warning' : 'bg-danger'
          }`}>
            {recipe.difficulty}
          </span>
        </div>

        {/* Rating Badge */}
        {recipe.rating && recipe.rating > 0 && (
          <div className="position-absolute top-0 start-0 m-2">
            <span className="badge bg-dark bg-opacity-75 text-white">
              <i className="fas fa-star text-warning me-1"></i>
              {recipe.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold mb-2 text-truncate" title={recipe.title}>
          {recipe.title}
        </h5>
        
        <p className="card-text text-muted small mb-3" style={{ 
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {recipe.description}
        </p>

        {/* Recipe Info */}
        <div className="row g-2 mb-3 text-muted small">
          <div className="col-6">
            <i className="fas fa-clock me-1"></i>
            {recipe.prepTime ? `${recipe.prepTime} + ${recipe.cookTime}` : recipe.cookTime}
          </div>
          <div className="col-6">
            <i className="fas fa-users me-1"></i>
            {recipe.servings} servings
          </div>
          <div className="col-6">
            <i className="fas fa-fire me-1"></i>
            {recipe.calories} cal
          </div>
          <div className="col-6">
            <i className="fas fa-globe-americas me-1"></i>
            {recipe.cuisine}
          </div>
        </div>

        {/* Allergen Tags */}
        <div className="mb-3">
          <div className="d-flex flex-wrap gap-1">
            {recipe.allergenInfo.glutenFree && (
              <span className="badge bg-info-subtle text-info">GF</span>
            )}
            {recipe.allergenInfo.vegan && (
              <span className="badge bg-success-subtle text-success">Vegan</span>
            )}
            {recipe.allergenInfo.dairyFree && (
              <span className="badge bg-warning-subtle text-warning">DF</span>
            )}
            {recipe.allergenInfo.nutFree && (
              <span className="badge bg-danger-subtle text-danger">NF</span>
            )}
          </div>
        </div>

        {/* Author */}
        {showAuthor && (
          <div className="d-flex align-items-center mb-3 text-muted small">
            <img
              src={recipe.author.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=32&q=80'}
              alt={recipe.author.name}
              className="rounded-circle me-2"
              style={{ width: '24px', height: '24px', objectFit: 'cover' }}
            />
            <span>
              by {recipe.author.name}
              {recipe.author.verified && (
                <i className="fas fa-check-circle text-success ms-1" title="Verified Chef"></i>
              )}
            </span>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-auto">
          <Link
            to={`/recipe/${recipe.id}`}
            className="btn btn-outline-success w-100"
          >
            View Recipe
          </Link>
        </div>
      </div>
    </div>
  )
} 