import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import OrderStepper from '../components/OrderStepper'
import { getOrders, getSavedProducts } from '../utils/storage'
import { formatPrice } from '../utils/pricing'
import { formatDate } from '../utils/orderUtils'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('active')
  const [mockOrders, setMockOrders] = useState([])
  const [quotes, setQuotes] = useState([])
  const [products, setProducts] = useState([])
  const [savedIds, setSavedIds] = useState([])

  useEffect(() => {
    // Load mock orders
    fetch('/data/orders.json').then(r => r.json()).then(setMockOrders).catch(() => {})
    // Load quotes
    fetch('/data/quotes.json').then(r => r.json()).then(setQuotes).catch(() => {})
    // Load products (for saved)
    fetch('/data/products.json').then(r => r.json()).then(setProducts).catch(() => {})
    // Load saved product IDs
    setSavedIds(getSavedProducts())
  }, [])

  // Merge localStorage orders with mock orders
  const localOrders = getOrders()
  const allOrders = [...localOrders, ...mockOrders]
  const activeOrders = allOrders.filter(o => o.status !== 'Delivered')
  const pastOrders = allOrders.filter(o => o.status === 'Delivered')
  const savedProducts = products.filter(p => savedIds.includes(p.id))

  const stats = [
    { label: 'Total Orders', value: allOrders.length, icon: '📦' },
    { label: 'Active Orders', value: activeOrders.length, icon: '🔄' },
    { label: 'Quotes Received', value: quotes.length, icon: '📋' },
    { label: 'Saved Products', value: savedProducts.length, icon: '❤️' },
  ]

  const TABS = [
    { key: 'active', label: `Active Orders (${activeOrders.length})` },
    { key: 'history', label: `Order History (${pastOrders.length})` },
    { key: 'quotes', label: `Quotes (${quotes.length})` },
    { key: 'saved', label: `Saved Products (${savedProducts.length})` },
  ]

  const statusClass = (status) => `badge badge-status badge-${status.toLowerCase()}`

  return (
    <div className="page-wrapper" id="dashboard-page">
      <div className="container">
        <div className="page-header">
          <h1>📊 Corporate Dashboard</h1>
        </div>

        <div className="dash-stats">
          {stats.map(s => (
            <div className="dash-stat" key={s.label}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{s.icon}</div>
              <div className="dash-stat-value">{s.value}</div>
              <div className="dash-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="tabs">
          {TABS.map(t => (
            <button key={t.key} className={`tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Active Orders */}
        {activeTab === 'active' && (
          <div className="order-list">
            {activeOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📦</div>
                <h3>No active orders</h3>
                <p>Your active orders will appear here once you place an order.</p>
                <Link to="/catalogue" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Catalogue</Link>
              </div>
            ) : (
              activeOrders.map(order => (
                <div className="card" key={order.id} style={{ padding: 24 }}>
                  <div className="order-card" style={{ border: 'none', padding: 0 }}>
                    <img src={order.product_image} alt={order.product_name} className="order-card-img"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238f330?w=80&h=80&fit=crop' }} />
                    <div className="order-card-info">
                      <h3>{order.product_name}</h3>
                      <p>Order #{order.id} · {order.quantity} units · {order.company_name}</p>
                    </div>
                    <div className="order-card-meta">
                      <div className="price">{formatPrice(order.total_price)}</div>
                      <div className="date">Delivery: {formatDate(order.delivery_date)}</div>
                      <span className={statusClass(order.status)}>{order.status}</span>
                    </div>
                  </div>
                  <OrderStepper currentStatus={order.status} />
                </div>
              ))
            )}
          </div>
        )}

        {/* Order History */}
        {activeTab === 'history' && (
          <div className="order-list">
            {pastOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📜</div>
                <h3>No past orders</h3>
                <p>Your completed orders will appear here.</p>
              </div>
            ) : (
              pastOrders.map(order => (
                <div className="order-card card" key={order.id}>
                  <img src={order.product_image} alt={order.product_name} className="order-card-img"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238f330?w=80&h=80&fit=crop' }} />
                  <div className="order-card-info">
                    <h3>{order.product_name}</h3>
                    <p>Order #{order.id} · {order.quantity} units</p>
                    <p>Delivered: {formatDate(order.delivery_date)}</p>
                  </div>
                  <div className="order-card-meta">
                    <div className="price">{formatPrice(order.total_price)}</div>
                    <span className={statusClass('delivered')}>Delivered ✓</span>
                    <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>⬇ Invoice</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Quotes */}
        {activeTab === 'quotes' && (
          <div className="order-list">
            {quotes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3>No quotes yet</h3>
                <p>Quotes from the GiftsKart team will appear here.</p>
              </div>
            ) : (
              quotes.map(q => (
                <div className="order-card card" key={q.id}>
                  <img src={q.product_image} alt={q.product_name} className="order-card-img"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238f330?w=80&h=80&fit=crop' }} />
                  <div className="order-card-info">
                    <h3>{q.product_name}</h3>
                    <p>{q.company_name} · {q.quantity} units</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{q.notes}</p>
                  </div>
                  <div className="order-card-meta">
                    <div className="price">{formatPrice(q.total_price)}</div>
                    <div className="date">{formatPrice(q.price_per_unit)}/unit</div>
                    <span className={statusClass(q.status)}>{q.status}</span>
                    <div className="date">Valid until: {formatDate(q.valid_until)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Saved Products */}
        {activeTab === 'saved' && (
          <div>
            {savedProducts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">❤️</div>
                <h3>No saved products</h3>
                <p>Browse the catalogue and save products you're interested in.</p>
                <Link to="/catalogue" className="btn btn-primary" style={{ marginTop: 16 }}>Browse Catalogue</Link>
              </div>
            ) : (
              <div className="product-grid">
                {savedProducts.map(p => (
                  <div className="card product-card" key={p.id} onClick={() => window.location.href = `/product/${p.id}`}>
                    <img src={p.image_url} alt={p.name} className="product-card-img" loading="lazy"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238f330?w=480&h=360&fit=crop' }} />
                    <div className="product-card-body">
                      <div className="product-card-category">{p.category}</div>
                      <h3 className="product-card-name">{p.name}</h3>
                      <div className="product-card-price">{formatPrice(p.price_per_unit)} <small>/ unit</small></div>
                      <Link to={`/product/${p.id}`} className="btn btn-primary btn-sm">View Details</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
