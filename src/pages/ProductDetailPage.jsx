import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { calculateUnitPrice, calculateTotalPrice, formatPrice, getDiscount } from '../utils/pricing'
import { toggleSavedProduct, isProductSaved } from '../utils/storage'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(25)
  const [saved, setSaved] = useState(false)
  const [mainImage, setMainImage] = useState(0)
  const [customization, setCustomization] = useState({
    logo: null,
    message_card: '',
    packaging: '',
    color: '',
  })

  useEffect(() => {
    fetch('/data/products.json')
      .then(r => r.json())
      .then(data => {
        const found = data.find(p => p.id === Number(id))
        if (found) {
          setProduct(found)
          setSaved(isProductSaved(found.id))
        }
      })
      .catch(() => {})
  }, [id])

  if (!product) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <h3>Loading product...</h3>
          </div>
        </div>
      </div>
    )
  }

  // Generate gallery: main + 3 variations
  const galleryImages = [
    product.image_url,
    product.image_url.replace('w=480', 'w=481'),
    product.image_url.replace('w=480', 'w=482'),
    product.image_url.replace('w=480', 'w=483'),
  ]

  const unitPrice = calculateUnitPrice(product.price_per_unit, quantity)
  const totalPrice = calculateTotalPrice(product.price_per_unit, quantity)
  const discount = getDiscount(quantity)

  const handleQuantityChange = (val) => {
    const num = Math.max(25, parseInt(val) || 25)
    setQuantity(num)
  }

  const handleSave = () => {
    toggleSavedProduct(product.id)
    setSaved(!saved)
  }

  const handleRequestOrder = () => {
    navigate(`/bulk-order?product=${product.id}&quantity=${quantity}`)
  }

  const COLORS = ['#1a1a2e', '#e94560', '#0f3460', '#16213e', '#e6b325', '#2d6a4f']

  return (
    <div className="page-wrapper" id="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: 24, fontSize: '0.85rem' }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)' }}>Home</Link>
          <span style={{ margin: '0 8px', color: 'var(--color-text-muted)' }}>/</span>
          <Link to="/catalogue" style={{ color: 'var(--color-text-muted)' }}>Catalogue</Link>
          <span style={{ margin: '0 8px', color: 'var(--color-text-muted)' }}>/</span>
          <span style={{ color: 'var(--color-text)' }}>{product.name}</span>
        </div>

        <div className="product-detail">
          {/* Left — Gallery */}
          <div className="product-gallery">
            <img
              src={galleryImages[mainImage]}
              alt={product.name}
              className="product-gallery-main"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238f330?w=480&h=360&fit=crop' }}
            />
            <div className="product-gallery-thumbs">
              {galleryImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} view ${idx + 1}`}
                  className={`product-gallery-thumb ${idx === mainImage ? 'active' : ''}`}
                  onClick={() => setMainImage(idx)}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238f330?w=80&h=60&fit=crop' }}
                />
              ))}
            </div>
          </div>

          {/* Right — Info */}
          <div className="product-info">
            <div className="product-card-category">{product.category}</div>
            <h1>{product.name}</h1>
            <div style={{ display: 'flex', gap: 8, margin: '12px 0 16px', alignItems: 'center' }}>
              <button className="save-btn" onClick={handleSave} title={saved ? 'Remove from saved' : 'Save product'}>
                {saved ? '❤️' : '🤍'}
              </button>
              <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>{saved ? 'Saved' : 'Save for later'}</span>
            </div>
            <p className="description">{product.description}</p>

            {/* Pricing Tiers Table */}
            <div className="form-section" style={{ marginBottom: 20, padding: 0, overflow: 'hidden' }}>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Quantity</th>
                      <th>Price per unit</th>
                      <th>Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={quantity >= 25 && quantity < 50 ? { background: 'var(--color-primary-50)' } : {}}>
                      <td>25–49 units</td>
                      <td>{formatPrice(product.price_per_unit)}</td>
                      <td>—</td>
                    </tr>
                    <tr style={quantity >= 50 && quantity < 100 ? { background: 'var(--color-primary-50)' } : {}}>
                      <td>50–99 units</td>
                      <td>{formatPrice(product.price_per_unit * 0.9)}</td>
                      <td><span className="badge badge-custom">Save 10%</span></td>
                    </tr>
                    <tr style={quantity >= 100 ? { background: 'var(--color-primary-50)' } : {}}>
                      <td>100+ units</td>
                      <td>{formatPrice(product.price_per_unit * 0.8)}</td>
                      <td><span className="badge badge-custom">Save 20%</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Live Price Calculator */}
            <div className="pricing-card" id="pricing-calculator">
              <h3>💰 Price Calculator</h3>
              <div className="qty-input-row">
                <label className="form-label" style={{ margin: 0 }}>Quantity:</label>
                <input
                  type="number"
                  className="form-input qty-input"
                  value={quantity}
                  min={25}
                  onChange={e => handleQuantityChange(e.target.value)}
                  id="qty-input"
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Min. 25 units</span>
              </div>
              <div className="price-display">
                <div>
                  <div className="total-label">Unit price: {formatPrice(unitPrice)}</div>
                  <div className="total-label" style={{ marginTop: 4 }}>{quantity} × {formatPrice(unitPrice)}</div>
                </div>
                <div className="total-value" id="total-price">{formatPrice(totalPrice)}</div>
              </div>
              {discount > 0 && (
                <div className="price-savings" id="price-savings">
                  🎉 You save {formatPrice(product.price_per_unit * quantity - totalPrice)} ({discount}% bulk discount applied!)
                </div>
              )}
            </div>

            {/* Customization Panel */}
            {product.customizable && (
              <div className="custom-panel" id="customization-panel">
                <h3>🎨 Customization Options</h3>
                {product.customization_options.includes('logo') && (
                  <div className="custom-option">
                    <label className="form-label">Upload Company Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-input"
                      onChange={e => setCustomization({ ...customization, logo: e.target.files[0]?.name || '' })}
                    />
                    <div className="form-hint">Accepted: PNG, JPG, SVG (max 5MB)</div>
                  </div>
                )}
                {product.customization_options.includes('message_card') && (
                  <div className="custom-option">
                    <label className="form-label">Message Card Text</label>
                    <textarea
                      className="form-textarea"
                      placeholder="e.g., Happy Diwali from [Your Company]!"
                      value={customization.message_card}
                      onChange={e => setCustomization({ ...customization, message_card: e.target.value })}
                      style={{ minHeight: 70 }}
                    />
                  </div>
                )}
                {product.customization_options.includes('packaging') && (
                  <div className="custom-option">
                    <label className="form-label">Packaging Preferences</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Kraft paper with ribbon, premium box"
                      value={customization.packaging}
                      onChange={e => setCustomization({ ...customization, packaging: e.target.value })}
                    />
                  </div>
                )}
                {product.customization_options.includes('color') && (
                  <div className="custom-option">
                    <label className="form-label">Colour Selection</label>
                    <div className="color-options">
                      {COLORS.map(c => (
                        <div
                          key={c}
                          className={`color-swatch ${customization.color === c ? 'active' : ''}`}
                          style={{ background: c }}
                          onClick={() => setCustomization({ ...customization, color: c })}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CTA */}
            <button className="btn btn-accent btn-lg" style={{ width: '100%' }} onClick={handleRequestOrder} id="request-order-btn">
              Request Bulk Order — {formatPrice(totalPrice)}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 8 }}>
              Minimum order: {product.min_order_qty} units · No hidden charges
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
