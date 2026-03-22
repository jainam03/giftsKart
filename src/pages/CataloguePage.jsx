import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['All', 'Festival Hampers', 'Branded Merchandise', 'Wellness Kits', 'Desk Accessories']
const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A–Z' },
]

export default function CataloguePage() {
  const [products, setProducts] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All')
  const [sortBy, setSortBy] = useState('default')
  const [priceRange, setPriceRange] = useState([0, 2000])

  useEffect(() => {
    fetch('/data/products.json')
      .then(r => r.json())
      .then(setProducts)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setActiveCategory(cat)
  }, [searchParams])

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    if (cat === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({ category: cat })
    }
  }

  let filtered = products.filter(p => {
    if (activeCategory !== 'All' && p.category !== activeCategory) return false
    if (p.price_per_unit < priceRange[0] || p.price_per_unit > priceRange[1]) return false
    return true
  })

  // Sort
  if (sortBy === 'price-asc') filtered.sort((a, b) => a.price_per_unit - b.price_per_unit)
  else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price_per_unit - a.price_per_unit)
  else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="page-wrapper" id="catalogue-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Product Catalogue</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {filtered.length} product{filtered.length !== 1 ? 's' : ''} available — direct from manufacturer
            </p>
          </div>
        </div>

        <div className="filter-bar">
          <div className="filter-group">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <label style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>Max price:</label>
            <input
              type="range"
              min="200"
              max="2000"
              step="50"
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              style={{ width: 120 }}
            />
            <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>₹{priceRange[1]}</span>
            <select className="form-select" style={{ width: 160 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your filters or browse all categories.</p>
          </div>
        )}
      </div>
    </div>
  )
}
