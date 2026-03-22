import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'

export default function CorporateGiftsPage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('/data/products.json')
      .then(r => r.json())
      .then(data => setProducts(data.filter(p => p.category === 'Branded Merchandise' || p.category === 'Desk Accessories')))
      .catch(() => {})
  }, [])

  return (
    <div className="page-wrapper" id="corporate-gifts-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>💼 Corporate Gifts</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Branded merchandise, desk accessories, and executive gifts for your team</p>
          </div>
        </div>

        <div className="form-section" style={{ marginBottom: 32, background: 'linear-gradient(135deg, var(--color-primary-50), #fff)', border: '1px solid var(--color-primary-200)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h3 style={{ color: 'var(--color-primary)', marginBottom: 4 }}>Direct from Manufacturer. No Middlemen. Better Price.</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>All products sourced directly — save 20–40% on corporate orders.</p>
            </div>
            <a href="/bulk-order" className="btn btn-primary">Request Custom Quote</a>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">💼</div>
            <h3>Loading corporate gifts...</h3>
          </div>
        )}
      </div>
    </div>
  )
}
