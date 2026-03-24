import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/pricing'
import { formatDate, ORDER_STATUSES } from '../utils/orderUtils'

export default function VendorDashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [quotes, setQuotes] = useState([])

  useEffect(() => {
    // In a real app these would be vendor-specific; for prototype we show subset
    fetch('/data/products.json').then(r => r.json()).then(data => setProducts(data.slice(0, 6))).catch(() => {})
    fetch('/data/orders.json').then(r => r.json()).then(data => setOrders(data.slice(0, 3))).catch(() => {})
    fetch('/data/quotes.json').then(r => r.json()).then(data => setQuotes(data.slice(0, 2))).catch(() => {})
  }, [])

  const totalRevenue = orders.reduce((sum, o) => sum + o.total_price, 0)

  const TABS = [
    { key: 'products', label: `My Products (${products.length})` },
    { key: 'orders', label: `Orders Received (${orders.length})` },
    { key: 'quotes', label: `Quote Requests (${quotes.length})` },
  ]

  const statusClass = (status) => `badge badge-status badge-${status.toLowerCase()}`

  return (
    <div className="page-wrapper" id="vendor-dashboard-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>🏭 Vendor Dashboard</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Welcome back, {user?.name} · {user?.company}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="dash-stats">
          <div className="dash-stat">
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>📦</div>
            <div className="dash-stat-value">{products.length}</div>
            <div className="dash-stat-label">Products Listed</div>
          </div>
          <div className="dash-stat">
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>📋</div>
            <div className="dash-stat-value">{orders.length}</div>
            <div className="dash-stat-label">Orders Received</div>
          </div>
          <div className="dash-stat">
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>💰</div>
            <div className="dash-stat-value">{formatPrice(totalRevenue)}</div>
            <div className="dash-stat-label">Total Revenue</div>
          </div>
          <div className="dash-stat">
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>📨</div>
            <div className="dash-stat-value">{quotes.length}</div>
            <div className="dash-stat-label">Quote Requests</div>
          </div>
        </div>

        <div className="tabs">
          {TABS.map(t => (
            <button key={t.key} className={`tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* My Products */}
        {activeTab === 'products' && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price / Unit</th>
                  <th>Min. Order</th>
                  <th>Customizable</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <img src={p.image_url} alt={p.name} style={{ width: 48, height: 36, borderRadius: 4, objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238f330?w=48&h=36&fit=crop' }} />
                    </td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{formatPrice(p.price_per_unit)}</td>
                    <td>{p.min_order_qty} units</td>
                    <td>{p.customizable ? '✅' : '—'}</td>
                    <td><span className="badge badge-status badge-delivered">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Received */}
        {activeTab === 'orders' && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Buyer</th>
                  <th>Qty</th>
                  <th>Revenue</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 600, fontSize: '0.84rem' }}>{o.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img src={o.product_image} alt={o.product_name} style={{ width: 36, height: 36, borderRadius: 4, objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238f330?w=36&h=36&fit=crop' }} />
                        {o.product_name}
                      </div>
                    </td>
                    <td>{o.company_name}</td>
                    <td>{o.quantity}</td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(o.total_price)}</td>
                    <td>{formatDate(o.order_date)}</td>
                    <td><span className={statusClass(o.status)}>{o.status}</span></td>
                    <td>
                      <select className="form-select" style={{ width: 130, padding: '6px 8px', fontSize: '0.8rem' }} value={o.status} readOnly>
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Quote Requests */}
        {activeTab === 'quotes' && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Quote ID</th>
                  <th>Product</th>
                  <th>Company</th>
                  <th>Qty</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Valid Until</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map(q => (
                  <tr key={q.id}>
                    <td style={{ fontWeight: 600, fontSize: '0.84rem' }}>{q.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img src={q.product_image} alt={q.product_name} style={{ width: 36, height: 36, borderRadius: 4, objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238f330?w=36&h=36&fit=crop' }} />
                        {q.product_name}
                      </div>
                    </td>
                    <td>{q.company_name}</td>
                    <td>{q.quantity}</td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(q.total_price)}</td>
                    <td><span className={statusClass(q.status)}>{q.status}</span></td>
                    <td>{formatDate(q.valid_until)}</td>
                    <td>
                      <button className="btn btn-primary btn-sm">Respond</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
