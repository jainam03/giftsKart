import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

const CATEGORY_IMAGES = {
  'Employee Onboarding Kits': 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=480&h=360&fit=crop',
  'Festival Hampers': 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=480&h=360&fit=crop',
  'Corporate Merchandise': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=480&h=360&fit=crop',
  'Personalized Gifts': 'https://images.unsplash.com/photo-1549465220-1a8b9238f330?w=480&h=360&fit=crop',
  'Institutional Gifts': 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=480&h=360&fit=crop',
}

export default function HomePage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('/data/products.json')
      .then(r => r.json())
      .then(setProducts)
      .catch(() => {})
  }, [])

  const featured = products.slice(0, 4)

  return (
    <div id="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content animate-in">
            <h1>Corporate Gifting Made Simple — <em>Direct from Manufacturer</em></h1>
            <p>Skip the middlemen. Order customized gifts for employees and clients at better prices, with real-time delivery tracking.</p>
            <div className="hero-ctas">
              <Link to="/catalogue" className="btn btn-accent btn-lg">Browse Catalogue</Link>
              <Link to="/bulk-order" className="btn btn-outline btn-lg" style={{ borderColor: '#fff', color: '#fff' }}>Request Bulk Quote</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-items">
            <div className="trust-item">
              <div className="trust-icon">🏭</div>
              <div className="trust-text">No middlemen — direct manufacturer pricing</div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">📦</div>
              <div className="trust-text">Delivery tracked end-to-end</div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">📋</div>
              <div className="trust-text">Minimum order: 25 units</div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">🇮🇳</div>
              <div className="trust-text">Serving corporates across India</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>How It Works</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Order corporate gifts in 4 simple steps</p>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Browse Catalogue</h3>
              <p>Explore our curated collection of corporate gifts from verified manufacturers.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Customize Your Gift</h3>
              <p>Add your company logo, message, and choose packaging — make it yours.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Place Bulk Order</h3>
              <p>Get transparent per-unit pricing with volume discounts. No hidden charges.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Track Delivery</h3>
              <p>Real-time tracking from dispatch to doorstep. Never miss a deadline.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Featured Categories</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Curated gift collections for every corporate occasion</p>
          <div className="category-grid">
            {Object.entries(CATEGORY_IMAGES).map(([name, img]) => (
              <Link
                to={`/catalogue?category=${encodeURIComponent(name === 'Employee Onboarding Kits' ? 'Wellness Kits' : name === 'Corporate Merchandise' ? 'Branded Merchandise' : name === 'Personalized Gifts' ? 'Festival Hampers' : name === 'Institutional Gifts' ? 'Desk Accessories' : name)}`}
                className="category-card"
                key={name}
              >
                <img src={img} alt={name} loading="lazy" />
                <div className="category-card-overlay">
                  <h3>{name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="page-header">
              <div>
                <h2 className="section-title">Trending Products</h2>
                <p className="section-subtitle" style={{ marginBottom: 0 }}>Popular picks from our corporate clients</p>
              </div>
              <Link to="/catalogue" className="btn btn-outline">View All Products →</Link>
            </div>
            <div className="product-grid">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Competitor Comparison */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Why Choose GiftsKart?</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>See how we compare to traditional gifting options</p>
          <div className="comparison-grid">
            <div className="comparison-col">
              <h3>Local Vendors</h3>
              <ul>
                <li>Inconsistent quality</li>
                <li>No bulk pricing tiers</li>
                <li>Limited product range</li>
                <li>Manual coordination</li>
                <li>No delivery tracking</li>
              </ul>
            </div>
            <div className="comparison-col highlight">
              <h3>GiftsKart</h3>
              <ul>
                <li>Direct manufacturer pricing — save 20–40%</li>
                <li>Transparent bulk pricing tiers</li>
                <li>16+ curated product categories</li>
                <li>One-click customization & ordering</li>
                <li>Real-time delivery tracking</li>
                <li>Dedicated account manager</li>
              </ul>
            </div>
            <div className="comparison-col">
              <h3>E-commerce Platforms</h3>
              <ul>
                <li>Commission-inflated pricing</li>
                <li>No bulk customization</li>
                <li>Consumer-grade experience</li>
                <li>No corporate invoicing</li>
                <li>Unreliable for bulk orders</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: 'var(--color-primary)', color: '#fff', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>Ready to Simplify Your Corporate Gifting?</h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
            Join hundreds of companies saving 20–40% on corporate gifts with direct manufacturer pricing.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/catalogue" className="btn btn-accent btn-lg">Browse Catalogue</Link>
            <Link to="/bulk-order" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>Request Bulk Quote</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
