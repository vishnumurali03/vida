import { useState, useEffect } from 'react'
import { type RecipeFormData, type Ingredient, type NutritionFacts, type AllergenInfo, type CuisineOption } from '../types/Recipe'
import { createRecipe, getCuisineOptions } from '../api/recipes'
import { uploadRecipeImage } from '../api/storage'
import { useAuth } from '../contexts/AuthContext'


// Get cuisine options from the API
const cuisineOptions = getCuisineOptions()

const commonTags = [
  'Gluten-Free', 'Vegan', 'Vegetarian', 'Dairy-Free', 'Nut-Free',
  'Soy-Free', 'Egg-Free', 'Low-Carb', 'High-Protein', 'Quick',
  'Make-Ahead', 'One-Pot', 'No-Cook', 'Keto', 'Paleo'
]

export default function SubmitRecipe() {
  const { user, isAuthenticated, isLoading, loginWithGoogle, loginWithFacebook } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    description: '',
    image: '',
    cookTime: '',
    prepTime: '',
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'Other' as CuisineOption,
    calories: 0,
    tags: [],
    ingredients: [{ item: '', amount: '' }],
    instructions: [''],
    nutritionFacts: {
      calories: 0,
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      sugar: ''
    },
    allergenInfo: {
      glutenFree: false,
      dairyFree: false,
      nutFree: false,
      soyFree: false,
      vegan: false,
      vegetarian: false,
      eggFree: false,
      fishFree: false,
      shellFishFree: false
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const updateFormData = (field: keyof RecipeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      setImageFile(file)
      
      // Create local preview URL (no base64 needed)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      
      // Store the file object, URL will be generated on upload to Supabase
      updateFormData('image', '') // Clear any previous URL
    }
  }

  const removeImage = () => {
    // Clean up object URL to prevent memory leaks
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    
    setImageFile(null)
    setImagePreview('')
    updateFormData('image', '')
    // Reset file input
    const fileInput = document.getElementById('imageInput') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const updateNutritionFacts = (field: keyof NutritionFacts, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      nutritionFacts: { ...prev.nutritionFacts, [field]: value }
    }))
  }

  const updateAllergenInfo = (field: keyof AllergenInfo, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      allergenInfo: { ...prev.allergenInfo, [field]: value }
    }))
  }

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { item: '', amount: '' }]
    }))
  }

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      )
    }))
  }

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
  }

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }))
  }

  const updateInstruction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => 
        i === index ? value : inst
      )
    }))
  }

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }))
  }

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  // Function to upload image to Supabase Storage
  const uploadImageToSupabase = async (file: File, recipeId: string): Promise<string> => {
    try {
      return await uploadRecipeImage(file, recipeId)
    } catch (error) {
      console.error('Error uploading image:', error)
      throw new Error('Failed to upload image')
    }
  }

  const handleSubmit = async () => {
    // TEMPORARILY DISABLED AUTH CHECK FOR TESTING
    // if (!user) {
    //   alert('You must be logged in to submit a recipe')
    //   return
    // }

    setIsSubmitting(true)

    try {
      // Generate UUID for the recipe
      const recipeId = crypto.randomUUID()
      
      let imageUrl = formData.image

      // Upload image to Supabase if a file was selected
      if (imageFile) {
        imageUrl = await uploadImageToSupabase(imageFile, recipeId)
        console.log('Image uploaded successfully:', imageUrl)
      }
      
      // Create the recipe in the database with authenticated user ID
      // Using test user ID for now (replace with actual user.id when auth is ready)
      const userId = user?.id || '00000000-0000-0000-0000-000000000000'
      const recipe = await createRecipe(formData, userId, imageUrl)
      console.log('Recipe created successfully:', recipe)
      
      setSubmitSuccess(true)
    } catch (error) {
      console.error('Error submitting recipe:', error)
      alert('Error submitting recipe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  // TEMPORARILY DISABLED FOR TESTING
  // if (!isAuthenticated) {
  //   return (
  //     <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
  //       <div className="text-center">
  //         <div className="mb-4">
  //           <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24" className="text-muted">
  //             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 6h-3V6c0-1.66-1.34-3-3-3S7 4.34 7 6v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/>
  //           </svg>
  //         </div>
  //         <h2 className="h3 mb-3">Sign In Required</h2>
  //         <p className="text-muted mb-4">You need to sign in to submit a recipe to our community.</p>
  //         <div className="d-flex justify-content-center gap-3">
  //           <button 
  //             className="btn btn-outline-primary"
  //             onClick={loginWithGoogle}
  //           >
  //             <i className="fab fa-google me-2"></i>
  //             Sign in with Google
  //           </button>
  //           <button 
  //             className="btn btn-primary"
  //             onClick={loginWithFacebook}
  //           >
  //             <i className="fab fa-facebook-f me-2"></i>
  //             Sign in with Facebook
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  if (submitSuccess) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="mb-4">
            <svg width="64" height="64" fill="#28a745" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2 className="h3 mb-3">Recipe Submitted Successfully!</h2>
          <p className="text-muted mb-4">Your recipe "{formData.title}" has been submitted for review.</p>
          <button 
            className="btn btn-success me-3"
            onClick={() => {
              setSubmitSuccess(false)
              setCurrentStep(1)
              setImageFile(null)
              setImagePreview('')
              setFormData({
                title: '',
                description: '',
                image: '',
                cookTime: '',
                prepTime: '',
                servings: 4,
                difficulty: 'Easy',
                cuisine: 'Other' as CuisineOption,
                calories: 0,
                tags: [],
                ingredients: [{ item: '', amount: '' }],
                instructions: [''],
                nutritionFacts: {
                  calories: 0,
                  protein: '',
                  carbs: '',
                  fat: '',
                  fiber: '',
                  sugar: ''
                },
                allergenInfo: {
                  glutenFree: false,
                  dairyFree: false,
                  nutFree: false,
                  soyFree: false,
                  vegan: false,
                  vegetarian: false,
                  eggFree: false,
                  fishFree: false,
                  shellFishFree: false
                }
              })
            }}
          >
            Submit Another Recipe
          </button>
          <a href="/recipes" className="btn btn-outline-success">
            Browse Recipes
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold mb-3">Submit Your Recipe</h1>
              <p className="lead text-muted">
                Share your delicious allergen-free recipe with our community
              </p>
            </div>

            {/* Progress Steps */}
            <div className="row mb-5">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="d-flex flex-column align-items-center">
                      <div 
                        className={`rounded-circle d-flex align-items-center justify-content-center ${
                          currentStep >= step ? 'bg-success text-white' : 'bg-light text-muted'
                        }`}
                        style={{ width: '40px', height: '40px' }}
                      >
                        {step}
                      </div>
                      <small className="mt-1 text-muted">
                        {step === 1 && 'Basic Info'}
                        {step === 2 && 'Ingredients'}
                        {step === 3 && 'Instructions'}
                        {step === 4 && 'Nutrition & Tags'}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3 shadow-sm p-4">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div>
                    <h3 className="h4 mb-4">Basic Information</h3>
                    
                    <div className="mb-3">
                      <label className="form-label">Recipe Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.title}
                        onChange={(e) => updateFormData('title', e.target.value)}
                        placeholder="Enter your recipe title"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description *</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        placeholder="Describe your recipe..."
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Recipe Image</label>
                      <div className="border rounded p-3">
                        {imagePreview ? (
                          <div className="text-center">
                            <img
                              src={imagePreview}
                              alt="Recipe preview"
                              className="img-fluid rounded mb-3"
                              style={{ maxHeight: '200px', objectFit: 'cover' }}
                            />
                            <div>
                              <p className="text-muted mb-2">{imageFile?.name}</p>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={removeImage}
                              >
                                Remove Image
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24" className="text-muted mb-3">
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                            </svg>
                            <p className="text-muted mb-3">Upload a photo of your recipe</p>
                            <label htmlFor="imageInput" className="btn btn-outline-success">
                              Choose Image
                            </label>
                            <input
                              id="imageInput"
                              type="file"
                              className="d-none"
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                            <p className="small text-muted mt-2">
                              Supported formats: JPG, PNG, GIF (Max 5MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Prep Time *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.prepTime}
                          onChange={(e) => updateFormData('prepTime', e.target.value)}
                          placeholder="e.g., 15 minutes"
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Cook Time *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.cookTime}
                          onChange={(e) => updateFormData('cookTime', e.target.value)}
                          placeholder="e.g., 30 minutes"
                          required
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Servings *</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.servings}
                          onChange={(e) => updateFormData('servings', parseInt(e.target.value) || 1)}
                          min="1"
                          max="20"
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Difficulty *</label>
                        <select
                          className="form-select"
                          value={formData.difficulty}
                          onChange={(e) => updateFormData('difficulty', e.target.value)}
                          required
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Cuisine *</label>
                        <select
                          className="form-select"
                          value={formData.cuisine}
                          onChange={(e) => updateFormData('cuisine', e.target.value)}
                          required
                        >
                          <option value="">Select cuisine</option>
                          {cuisineOptions.map(cuisine => (
                            <option key={cuisine} value={cuisine}>{cuisine}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Ingredients */}
                {currentStep === 2 && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="h4 mb-0">Ingredients</h3>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={addIngredient}
                      >
                        + Add Ingredient
                      </button>
                    </div>

                    {formData.ingredients.map((ingredient, index) => (
                      <div key={index} className="row mb-3">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ingredient name"
                            value={ingredient.item}
                            onChange={(e) => updateIngredient(index, 'item', e.target.value)}
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Amount"
                            value={ingredient.amount}
                            onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                          />
                        </div>
                        <div className="col-md-2">
                          {formData.ingredients.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-danger w-100"
                              onClick={() => removeIngredient(index)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 3: Instructions */}
                {currentStep === 3 && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="h4 mb-0">Instructions</h3>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={addInstruction}
                      >
                        + Add Step
                      </button>
                    </div>

                    {formData.instructions.map((instruction, index) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex align-items-start">
                          <span className="badge bg-success me-3 mt-2">{index + 1}</span>
                          <div className="flex-grow-1">
                            <textarea
                              className="form-control"
                              rows={3}
                              placeholder={`Step ${index + 1} instructions...`}
                              value={instruction}
                              onChange={(e) => updateInstruction(index, e.target.value)}
                            />
                          </div>
                          {formData.instructions.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm ms-2 mt-2"
                              onClick={() => removeInstruction(index)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 4: Nutrition & Tags */}
                {currentStep === 4 && (
                  <div>
                    <h3 className="h4 mb-4">Nutrition & Allergen Information</h3>

                    {/* Nutrition Facts */}
                    <div className="mb-4">
                      <h5 className="h6 mb-3">Nutrition Facts (per serving)</h5>
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label className="form-label">Calories</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.nutritionFacts.calories}
                            onChange={(e) => updateNutritionFacts('calories', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label">Protein (g)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.nutritionFacts.protein}
                            onChange={(e) => updateNutritionFacts('protein', e.target.value)}
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label">Carbs (g)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.nutritionFacts.carbs}
                            onChange={(e) => updateNutritionFacts('carbs', e.target.value)}
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label">Fat (g)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.nutritionFacts.fat}
                            onChange={(e) => updateNutritionFacts('fat', e.target.value)}
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label">Fiber (g)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.nutritionFacts.fiber}
                            onChange={(e) => updateNutritionFacts('fiber', e.target.value)}
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label">Sugar (g)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.nutritionFacts.sugar}
                            onChange={(e) => updateNutritionFacts('sugar', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Allergen Information */}
                    <div className="mb-4">
                      <h5 className="h6 mb-3">Allergen Information</h5>
                      <div className="row">
                        {Object.entries(formData.allergenInfo).map(([key, value]) => (
                          <div key={key} className="col-md-4 mb-2">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={value}
                                onChange={(e) => updateAllergenInfo(key as keyof AllergenInfo, e.target.checked)}
                                id={key}
                              />
                              <label className="form-check-label" htmlFor={key}>
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                      <h5 className="h6 mb-3">Tags</h5>
                      <div className="d-flex flex-wrap gap-2">
                        {commonTags.map(tag => (
                          <button
                            key={tag}
                            type="button"
                            className={`btn btn-sm ${
                              formData.tags.includes(tag) 
                                ? 'btn-success' 
                                : 'btn-outline-success'
                            }`}
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </button>
                  
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={nextStep}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-success"
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Recipe'}
                    </button>
                  )}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 