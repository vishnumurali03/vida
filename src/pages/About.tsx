import { Link } from 'react-router-dom'
import VarshaImage from '../assets/Varsha.jpeg'

export default function About() {
  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <section className="bg-white py-5 shadow-sm">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">
                About <span className="text-success">Vida</span>
              </h1>
              <p className="lead text-muted">
                Empowering health through food, innovation, and community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 shadow-sm p-4 mb-5">
                <div className="card-body">
                  <div className="text-center mb-4">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '64px', height: '64px'}}>
                      <svg width="32" height="32" fill="currentColor" className="text-success" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h2 className="h3 fw-bold mb-3">Our Mission</h2>
                  </div>
                  <p className="lead text-dark text-center mb-0">
                    At Vida, we believe that healthy living starts with what's on your plate. Our platform makes wholesome eating simple, enjoyable, and accessible for everyone—because nutritious food should never be boring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center mb-5">
                <h2 className="display-6 fw-bold mb-3">About the Founder</h2>
                <div className="mx-auto" style={{width: '60px', height: '4px', backgroundColor: '#10b981'}}></div>
              </div>

              <div className="card border-0 shadow-lg overflow-hidden">
                <div className="row g-0">
                  {/* Founder Image */}
                  <div className="col-md-5">
                    <div className="bg-light h-100 d-flex align-items-center justify-content-center p-4" style={{minHeight: '500px'}}>
                      <img 
                        src={VarshaImage} 
                        alt="Varsha Murali, Founder of Vida" 
                        className="img-fluid rounded shadow-lg"
                        style={{
                          width: '100%',
                          maxWidth: '400px',
                          height: 'auto',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  </div>

                  {/* Founder Bio */}
                  <div className="col-md-7">
                    <div className="p-5">
                      <h3 className="h4 fw-bold mb-4 text-success">Varsha Murali</h3>
                      
                      <p className="mb-4">
                        Vida was founded by Varsha Murali as a freshman at Taft Charter High School, fueled by a deep passion for health, wellness, and innovation. A true foodie at heart, Varsha knows firsthand how difficult it can be to eat healthy when meals aren't exciting or flavorful. Her vision for Vida is to bridge that gap, making nutritious eating both enjoyable and sustainable for everyone—without ever sacrificing taste.
                      </p>

                      <p className="mb-4">
                        Varsha's creativity and dedication extend beyond the kitchen. She has designed devices that detect lactose and glucose in food, giving individuals with food allergies the confidence to dine safely. Her groundbreaking work has earned recognition at county, state, and national science fairs and was even presented at the International Symposium on Technology and Society Conference.
                      </p>

                      <p className="mb-0">
                        Through Vida, she combines her love of delicious, wholesome food with a mission to inspire, educate, and empower communities, proving that healthy living can be smart, accessible, and fun.
                      </p>

                      {/* Achievements */}
                      <div className="mt-4 pt-4 border-top">
                        <h4 className="h6 fw-bold mb-3 text-muted">Recognition & Achievements</h4>
                        <div className="d-flex flex-wrap gap-2">
                          <span className="badge bg-success-subtle text-success">Science Fair Winner</span>
                          <span className="badge bg-primary-subtle text-primary">Food Safety Innovation</span>
                          <span className="badge bg-info-subtle text-info">Health & Wellness Advocate</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center mb-5">
                <h2 className="display-6 fw-bold mb-3">Our Values</h2>
              </div>

              <div className="row g-4">
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm h-100 p-4">
                    <div className="card-body text-center">
                      <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '56px', height: '56px'}}>
                        <svg width="28" height="28" fill="currentColor" className="text-success" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3 className="h5 fw-bold mb-3">Health First</h3>
                      <p className="text-muted mb-0">
                        We prioritize nutritious, wholesome ingredients that nourish both body and mind.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card border-0 shadow-sm h-100 p-4">
                    <div className="card-body text-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '56px', height: '56px'}}>
                        <svg width="28" height="28" fill="currentColor" className="text-primary" viewBox="0 0 24 24">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="h5 fw-bold mb-3">Innovation</h3>
                      <p className="text-muted mb-0">
                        We leverage technology and creativity to make healthy eating easier and more accessible.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card border-0 shadow-sm h-100 p-4">
                    <div className="card-body text-center">
                      <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '56px', height: '56px'}}>
                        <svg width="28" height="28" fill="currentColor" className="text-warning" viewBox="0 0 24 24">
                          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3 className="h5 fw-bold mb-3">Community</h3>
                      <p className="text-muted mb-0">
                        We build a supportive space where everyone can share, learn, and grow together.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center">
                <h2 className="h3 fw-bold mb-4">Join Us on This Journey</h2>
                <p className="lead text-muted mb-4">
                  Whether you're here to find healthy recipes, share your own creations, or learn about mindful eating, we're glad you're part of the Vida community.
                </p>
                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                  <Link to="/recipes" className="btn btn-success btn-lg">
                    Explore Recipes
                  </Link>
                  <Link to="/submit" className="btn btn-outline-success btn-lg">
                    Share Your Recipe
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

