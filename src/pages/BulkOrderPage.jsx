import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Papa from 'papaparse'
import { calculateUnitPrice, calculateTotalPrice, formatPrice, getDiscount } from '../utils/pricing'
import { generateOrderId, getMinDeliveryDate } from '../utils/orderUtils'
import { saveOrder } from '../utils/storage'

export default function BulkOrderPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    gst: '',
    product_id: searchParams.get('product') || '',
    quantity: parseInt(searchParams.get('quantity')) || 25,
    budget_per_unit: '',
    customization_notes: '',
    delivery_date: '',
    delivery_city: '',
    special_instructions: '',
    recipient_mode: 'manual',
  })

  const [recipients, setRecipients] = useState([])
  const [newRecipient, setNewRecipient] = useState({ name: '', address: '', pincode: '', city: '' })

  useEffect(() => {
    fetch('/data/products.json')
      .then(r => r.json())
      .then(data => {
        setProducts(data)
        if (form.product_id) {
          setSelectedProduct(data.find(p => p.id === Number(form.product_id)))
        }
      })
      .catch(() => {})
  }, [])

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: '' }))

    if (key === 'product_id') {
      const prod = products.find(p => p.id === Number(value))
      setSelectedProduct(prod)
    }
  }

  const handleQuantityChange = (val) => {
    const num = parseInt(val) || 0
    setForm(prev => ({ ...prev, quantity: num }))
    setErrors(prev => ({ ...prev, quantity: '' }))
  }

  const addRecipient = () => {
    if (!newRecipient.name || !newRecipient.address || !newRecipient.pincode || !newRecipient.city) return
    setRecipients(prev => [...prev, { ...newRecipient }])
    setNewRecipient({ name: '', address: '', pincode: '', city: '' })
  }

  const removeRecipient = (idx) => {
    setRecipients(prev => prev.filter((_, i) => i !== idx))
  }

  const handleCSVUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data
          .map(row => ({
            name: row.Name || row.name || '',
            address: row.Address || row.address || '',
            pincode: row.Pincode || row.pincode || '',
            city: row.City || row.city || '',
          }))
          .filter(r => r.name && r.address)
        setRecipients(prev => [...prev, ...parsed])
      },
    })
  }

  const downloadTemplate = () => {
    const csv = 'Name,Address,Pincode,City\nJohn Doe,123 Main St,400001,Mumbai\nJane Smith,456 Park Ave,110001,New Delhi'
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'recipients_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const validate = () => {
    const errs = {}
    if (!form.company_name.trim()) errs.company_name = 'Required'
    if (!form.contact_person.trim()) errs.contact_person = 'Required'
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Valid email required'
    if (!form.phone.trim() || form.phone.length < 10) errs.phone = 'Valid phone required'
    if (!form.product_id) errs.product_id = 'Select a product'
    if (form.quantity < 25) errs.quantity = 'Minimum 25 units required'
    if (!form.delivery_date) errs.delivery_date = 'Select delivery date'
    else {
      const min = new Date()
      min.setDate(min.getDate() + 7)
      min.setHours(0, 0, 0, 0)
      if (new Date(form.delivery_date) < min) errs.delivery_date = 'Delivery date must be at least 7 days from today'
    }
    if (!form.delivery_city.trim()) errs.delivery_city = 'Required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const orderId = generateOrderId()
    const unitPrice = selectedProduct ? calculateUnitPrice(selectedProduct.price_per_unit, form.quantity) : 0
    const totalPrice = selectedProduct ? calculateTotalPrice(selectedProduct.price_per_unit, form.quantity) : 0

    const order = {
      id: orderId,
      product_id: Number(form.product_id),
      product_name: selectedProduct?.name || '',
      product_image: selectedProduct?.image_url || '',
      quantity: form.quantity,
      price_per_unit: unitPrice,
      total_price: totalPrice,
      company_name: form.company_name,
      contact_person: form.contact_person,
      email: form.email,
      phone: form.phone,
      gst: form.gst,
      status: 'Received',
      order_date: new Date().toISOString().split('T')[0],
      delivery_date: form.delivery_date,
      delivery_city: form.delivery_city,
      special_instructions: form.special_instructions,
      customization_notes: form.customization_notes,
      recipients: recipients,
    }

    saveOrder(order)
    navigate('/order-confirmation', { state: { order } })
  }

  const unitPrice = selectedProduct ? calculateUnitPrice(selectedProduct.price_per_unit, form.quantity) : 0
  const totalPrice = selectedProduct ? calculateTotalPrice(selectedProduct.price_per_unit, form.quantity) : 0
  const discount = form.quantity >= 25 ? getDiscount(form.quantity) : 0

  return (
    <div className="page-wrapper" id="bulk-order-page">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="page-header">
          <div>
            <h1>📦 Bulk Order Request</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Fill in the details below to request your bulk order. Our team will reach out within 24 hours.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Company Info */}
          <div className="form-section">
            <h3 className="form-section-title">🏢 Company Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input className={`form-input ${errors.company_name ? 'error' : ''}`} value={form.company_name} onChange={e => handleChange('company_name', e.target.value)} placeholder="e.g., TechNova Solutions Pvt. Ltd." />
                {errors.company_name && <div className="form-error">{errors.company_name}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Contact Person *</label>
                <input className={`form-input ${errors.contact_person ? 'error' : ''}`} value={form.contact_person} onChange={e => handleChange('contact_person', e.target.value)} placeholder="e.g., Priya Sharma" />
                {errors.contact_person && <div className="form-error">{errors.contact_person}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="priya@company.in" />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input type="tel" className={`form-input ${errors.phone ? 'error' : ''}`} value={form.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="9876543210" />
                {errors.phone && <div className="form-error">{errors.phone}</div>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">GST Number (optional)</label>
              <input className="form-input" value={form.gst} onChange={e => handleChange('gst', e.target.value)} placeholder="e.g., 27AAPFU0939F1ZV" />
            </div>
          </div>

          {/* Order Details */}
          <div className="form-section">
            <h3 className="form-section-title">📋 Order Details</h3>
            <div className="form-group">
              <label className="form-label">Product *</label>
              <select className={`form-select ${errors.product_id ? 'error' : ''}`} value={form.product_id} onChange={e => handleChange('product_id', e.target.value)}>
                <option value="">Select a product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} — {formatPrice(p.price_per_unit)}/unit</option>
                ))}
              </select>
              {errors.product_id && <div className="form-error">{errors.product_id}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Quantity * (min. 25 units)</label>
                <input type="number" min={25} className={`form-input ${errors.quantity ? 'error' : ''}`} value={form.quantity} onChange={e => handleQuantityChange(e.target.value)} id="order-qty-input" />
                {errors.quantity && <div className="form-error">{errors.quantity}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Budget per unit (optional)</label>
                <input type="number" className="form-input" value={form.budget_per_unit} onChange={e => handleChange('budget_per_unit', e.target.value)} placeholder="₹" />
              </div>
            </div>

            {selectedProduct && form.quantity >= 25 && (
              <div className="pricing-card" id="order-price-calculator">
                <div className="price-display">
                  <div>
                    <div className="total-label">{form.quantity} × {formatPrice(unitPrice)}/unit</div>
                    {discount > 0 && <div className="total-label" style={{ color: 'var(--color-success)' }}>{discount}% bulk discount applied</div>}
                  </div>
                  <div className="total-value">{formatPrice(totalPrice)}</div>
                </div>
                {discount > 0 && (
                  <div className="price-savings">
                    You save {formatPrice(selectedProduct.price_per_unit * form.quantity - totalPrice)} with bulk pricing!
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Customization Requirements</label>
              <textarea className="form-textarea" value={form.customization_notes} onChange={e => handleChange('customization_notes', e.target.value)} placeholder="Describe any customization needs — company logo, messaging, packaging preferences, etc." />
            </div>
          </div>

          {/* Recipient Delivery */}
          <div className="form-section">
            <h3 className="form-section-title">📮 Recipient Delivery</h3>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <button type="button" className={`filter-chip ${form.recipient_mode === 'manual' ? 'active' : ''}`} onClick={() => handleChange('recipient_mode', 'manual')}>
                Enter Manually
              </button>
              <button type="button" className={`filter-chip ${form.recipient_mode === 'csv' ? 'active' : ''}`} onClick={() => handleChange('recipient_mode', 'csv')}>
                Upload CSV
              </button>
            </div>

            {form.recipient_mode === 'manual' && (
              <div>
                <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 100px 100px auto' }}>
                  <input className="form-input" placeholder="Name" value={newRecipient.name} onChange={e => setNewRecipient(prev => ({ ...prev, name: e.target.value }))} />
                  <input className="form-input" placeholder="Address" value={newRecipient.address} onChange={e => setNewRecipient(prev => ({ ...prev, address: e.target.value }))} />
                  <input className="form-input" placeholder="Pincode" value={newRecipient.pincode} onChange={e => setNewRecipient(prev => ({ ...prev, pincode: e.target.value }))} />
                  <input className="form-input" placeholder="City" value={newRecipient.city} onChange={e => setNewRecipient(prev => ({ ...prev, city: e.target.value }))} />
                  <button type="button" className="btn btn-primary btn-sm" onClick={addRecipient}>Add</button>
                </div>
              </div>
            )}

            {form.recipient_mode === 'csv' && (
              <div>
                <div className="csv-upload-zone" onClick={() => document.getElementById('csv-file-input').click()}>
                  <div className="upload-icon">📄</div>
                  <p>Click to upload CSV file</p>
                  <p style={{ fontSize: '0.78rem', marginTop: 4 }}>Columns: Name, Address, Pincode, City</p>
                </div>
                <input type="file" id="csv-file-input" accept=".csv" style={{ display: 'none' }} onChange={handleCSVUpload} />
                <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={downloadTemplate}>
                  ⬇ Download CSV Template
                </button>
              </div>
            )}

            {recipients.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: 12 }}>Recipients ({recipients.length})</h4>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Pincode</th>
                        <th>City</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipients.map((r, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{r.name}</td>
                          <td>{r.address}</td>
                          <td>{r.pincode}</td>
                          <td>{r.city}</td>
                          <td><button type="button" className="btn btn-ghost btn-sm" onClick={() => removeRecipient(idx)}>✕</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Delivery */}
          <div className="form-section">
            <h3 className="form-section-title">🚚 Delivery</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Delivery Date * (min. 7 days from today)</label>
                <input type="date" className={`form-input ${errors.delivery_date ? 'error' : ''}`} value={form.delivery_date} min={getMinDeliveryDate()} onChange={e => handleChange('delivery_date', e.target.value)} id="delivery-date-input" />
                {errors.delivery_date && <div className="form-error">{errors.delivery_date}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Delivery City *</label>
                <input className={`form-input ${errors.delivery_city ? 'error' : ''}`} value={form.delivery_city} onChange={e => handleChange('delivery_city', e.target.value)} placeholder="e.g., Mumbai" />
                {errors.delivery_city && <div className="form-error">{errors.delivery_city}</div>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Special Instructions</label>
              <textarea className="form-textarea" value={form.special_instructions} onChange={e => handleChange('special_instructions', e.target.value)} placeholder="Any special delivery instructions or notes..." style={{ minHeight: 70 }} />
            </div>
          </div>

          <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%' }} id="submit-order-btn">
            Submit Order Request
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 8 }}>
            Our team will contact you within 24 hours to confirm your order.
          </p>
        </form>
      </div>
    </div>
  )
}
