import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../utils/pricing'
import { toggleSavedProduct, isProductSaved } from '../utils/storage'
import { useState } from 'react'

export default function ProductCard({ product, showSave = true }) {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(isProductSaved(product.id))

  const handleSave = (e) => {
    e.stopPropagation()
    toggleSavedProduct(product.id)
    setSaved(!saved)
  }

  return (
    <div className="card product-card" onClick={() => navigate(`/product/${product.id}`)} id={`product-card-${product.id}`}>
      <img
        src={product.image_url}
        alt={product.name}
        className="product-card-img"
        loading="lazy"
        onError={(e) => { e.target.src = `https://images.unsplash.com/photo-1549465220-1a8b9238f330?w=480&h=360&fit=crop` }}
      />
      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-price">
          {formatPrice(product.price_per_unit)} <small>/ unit</small>
        </div>
        <div className="product-card-badges">
          <span className="badge badge-moq">Min. {product.min_order_qty} units</span>
          {product.customizable && <span className="badge badge-custom">✦ Customizable</span>}
        </div>
        <div className="product-card-footer">
          <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`) }}>
            View Details
          </button>
          {showSave && (
            <button className="save-btn" onClick={handleSave} title={saved ? 'Remove from saved' : 'Save product'}>
              {saved ? '❤️' : '🤍'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
