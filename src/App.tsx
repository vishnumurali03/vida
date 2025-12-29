// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import Recipe from './pages/Recipe'
import SubmitRecipe from './pages/SubmitRecipe'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipe/:uuid" element={<Recipe />} />
        <Route path="/recipes/:cuisine" element={<div className="min-vh-100 bg-white d-flex align-items-center justify-content-center"><div className="text-center"><h1 className="display-4 fw-bold mb-4">Cuisine Recipes</h1><p className="text-muted">Coming soon...</p></div></div>} />
        <Route path="/submit" element={<SubmitRecipe />} />
        <Route path="/articles" element={<div className="min-vh-100 bg-white d-flex align-items-center justify-content-center"><div className="text-center"><h1 className="display-4 fw-bold mb-4">Articles</h1><p className="text-muted">Coming soon...</p></div></div>} />
      </Routes>
    </Layout>
  )
}
