import { useState, useEffect } from 'react'
import { formatPrice } from '../utils/pricing'
import { formatDate, ORDER_STATUSES } from '../utils/orderUtils'

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [quotes, setQuotes] = useState([])
  const [editProduct, setEditProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetch('/data/products.json').then(r => r.json()).then(setProducts).catch(() => {})
    fetch('/data/orders.json').then(r => r.json()).then(data => {
      // Merge with localStorage
      try {
        const local = JSON.parse(localStorage.getItem('giftskart_orders') || '[]')
        setOrders([...local, ...data])
      } catch { setOrders(data) }
    }).catch(() => {})
    fetch('/data/quotes.json').then(r => r.json()).then(setQuotes).catch(() => {})
  }, [])

  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Festival Hampers', description: '', price_per_unit: '',
    min_order_qty: 25, image_url: '', customizable: true, customization_options: ['logo'],
  })

  const handleAddProduct = () => {
    const product = {
      ...newProduct,
      id: Date.now(),
      price_per_unit: Number(newProduct.price_per_unit),
      image_url: newProduct.image_url || 'https://images.unsplash.com/photo-1549465220-1a8b9238f330?w=480&h=360&fit=crop',
    }
    setProducts(prev => [product, ...prev])
    setShowModal(false)
    setNewProduct({ name: '', category: 'Festival Hampers', description: '', price_per_unit: '', min_order_qty: 25, image_url: '', customizable: true, customization_options: ['logo'] })
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
  }

  const TABS = [
    { key: 'products', label: `Products (${products.length})` },
    { key: 'orders', label: `Orders (${orders.length})` },
    { key: 'quotes', label: `Quotes (${quotes.length})` },
  ]

  const statusClass = (status) => `badge badge-status badge-${status.toLowerCase()}`

  return (
    <div className="page-wrapper" id="admin-dashboard-page">
      <div className="container">
        <div className="page-header">
          <h1>⚙️ Admin Dashboard</h1>
          {activeTab === 'products' && (
            <button className="btn btn-accent" onClick={() => setShowModal(true)}>+ Add Product</button>
          )}
        </div>

        <div className="tabs">
          {TABS.map(t => (
            <button key={t.key} className={`tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>MOQ</th>
                  <th>Customizable</th>
                  <th>Actions</th>
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
                    <td>{p.min_order_qty}</td>
                    <td>{p.customizable ? '✅' : '—'}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setEditProduct(p); setShowModal(true); }}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Company</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Date</th>
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
                    <td>{formatPrice(o.total_price)}</td>
                    <td>{formatDate(o.order_date)}</td>
                    <td><span className={statusClass(o.status)}>{o.status}</span></td>
                    <td>
                      <select
                        className="form-select"
                        style={{ width: 130, padding: '6px 8px', fontSize: '0.8rem' }}
                        value={o.status}
                        onChange={e => updateOrderStatus(o.id, e.target.value)}
                      >
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Quotes Tab */}
        {activeTab === 'quotes' && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Quote ID</th>
                  <th>Product</th>
                  <th>Company</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Valid Until</th>
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
                    <td>{formatPrice(q.total_price)}</td>
                    <td><span className={statusClass(q.status)}>{q.status}</span></td>
                    <td>{formatDate(q.valid_until)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => { setShowModal(false); setEditProduct(null); }}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input className="form-input" value={editProduct?.name || newProduct.name}
                  onChange={e => editProduct
                    ? setEditProduct({ ...editProduct, name: e.target.value })
                    : setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={editProduct?.category || newProduct.category}
                    onChange={e => editProduct
                      ? setEditProduct({ ...editProduct, category: e.target.value })
                      : setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    <option>Festival Hampers</option>
                    <option>Branded Merchandise</option>
                    <option>Wellness Kits</option>
                    <option>Desk Accessories</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price per Unit (₹)</label>
                  <input type="number" className="form-input" value={editProduct?.price_per_unit || newProduct.price_per_unit}
                    onChange={e => editProduct
                      ? setEditProduct({ ...editProduct, price_per_unit: e.target.value })
                      : setNewProduct({ ...newProduct, price_per_unit: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={editProduct?.description || newProduct.description}
                  onChange={e => editProduct
                    ? setEditProduct({ ...editProduct, description: e.target.value })
                    : setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input className="form-input" value={editProduct?.image_url || newProduct.image_url}
                  onChange={e => editProduct
                    ? setEditProduct({ ...editProduct, image_url: e.target.value })
                    : setNewProduct({ ...newProduct, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost" onClick={() => { setShowModal(false); setEditProduct(null); }}>Cancel</button>
                <button className="btn btn-primary" onClick={() => {
                  if (editProduct) {
                    setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...editProduct, price_per_unit: Number(editProduct.price_per_unit) } : p))
                    setShowModal(false)
                    setEditProduct(null)
                  } else {
                    handleAddProduct()
                  }
                }}>
                  {editProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
