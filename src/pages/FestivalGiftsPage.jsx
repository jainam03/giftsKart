import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'

export default function FestivalGiftsPage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('/data/products.json')
      .then(r => r.json())
      .then(data => setProducts(data.filter(p => p.category === 'Festival Hampers')))
      .catch(() => {})
  }, [])

  // Calculate deadline (2 weeks from now)
  const deadline = new Date()
  deadline.setDate(deadline.getDate() + 14)
  const deadlineStr = deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="page-wrapper" id="festival-gifts-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>🪔 Festival Gifts</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Curated hampers and gift sets for every Indian festival</p>
          </div>
        </div>

        <div className="urgency-banner">
          🎯 Order by {deadlineStr} to ensure timely festival delivery! Limited stock on premium hampers.
        </div>

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🪔</div>
            <h3>Loading festival gifts...</h3>
          </div>
        )}

        {/* Festival Info Section */}
        <div className="section" style={{ paddingTop: 48 }}>
          <div className="form-section">
            <h2 className="form-section-title">🎉 Why GiftsKart for Festival Gifting?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
              <div>
                <h4 style={{ marginBottom: 8 }}>✅ Direct Pricing</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                  Save 20–40% compared to FnP, IGP, and local vendors. No commission layers.
                </p>
              </div>
              <div>
                <h4 style={{ marginBottom: 8 }}>📦 Guaranteed Delivery</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                  We guarantee festival-day delivery with real-time tracking for all bulk orders.
                </p>
              </div>
              <div>
                <h4 style={{ marginBottom: 8 }}>🎨 Full Customization</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                  Add your company logo, personalized messages, and custom packaging to every hamper.
                </p>
              </div>
              <div>
                <h4 style={{ marginBottom: 8 }}>📋 Bulk Discounts</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)' }}>
                  Volume pricing: 10% off for 50+ units, 20% off for 100+ units automatically applied.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
