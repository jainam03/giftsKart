import { useLocation, Link } from 'react-router-dom'
import { formatPrice } from '../utils/pricing'
import { formatDate } from '../utils/orderUtils'

export default function OrderConfirmationPage() {
  const { state } = useLocation()
  const order = state?.order

  if (!order) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No order found</h3>
            <p>Please submit an order through the bulk order form.</p>
            <Link to="/bulk-order" className="btn btn-primary" style={{ marginTop: 16 }}>Go to Bulk Order</Link>
          </div>
        </div>
      </div>
    )
  }

  const handleDownloadInvoice = () => {
    const invoiceHTML = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Invoice - ${order.id}</title>
<style>
  body { font-family: 'Segoe UI', sans-serif; padding: 40px; max-width: 700px; margin: 0 auto; color: #1a1d23; }
  h1 { color: #1e3a5f; font-size: 24px; margin-bottom: 4px; }
  .subtitle { color: #5a6270; margin-bottom: 32px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
  .section h3 { font-size: 14px; color: #8a919c; text-transform: uppercase; margin-bottom: 8px; }
  .section p { margin: 4px 0; font-size: 14px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th { background: #e8edf3; text-align: left; padding: 10px 12px; font-size: 13px; }
  td { padding: 10px 12px; border-bottom: 1px solid #eef1f5; font-size: 14px; }
  .total { text-align: right; font-size: 20px; font-weight: 700; color: #1e3a5f; }
  .footer { border-top: 1px solid #e2e6eb; padding-top: 16px; font-size: 12px; color: #8a919c; text-align: center; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
  <h1>🎁 GiftsKart</h1>
  <p class="subtitle">Invoice / Order Confirmation</p>
  <div class="grid">
    <div class="section">
      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Date:</strong> ${order.order_date}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Delivery:</strong> ${order.delivery_date}</p>
    </div>
    <div class="section">
      <h3>Billed To</h3>
      <p><strong>${order.company_name}</strong></p>
      <p>${order.contact_person}</p>
      <p>${order.email}</p>
      <p>${order.phone}</p>
    </div>
  </div>
  <table>
    <thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
    <tbody>
      <tr>
        <td>${order.product_name}</td>
        <td>${order.quantity}</td>
        <td>₹${Math.round(order.price_per_unit).toLocaleString('en-IN')}</td>
        <td>₹${Math.round(order.total_price).toLocaleString('en-IN')}</td>
      </tr>
    </tbody>
  </table>
  <p class="total">Total: ₹${Math.round(order.total_price).toLocaleString('en-IN')}</p>
  <div class="footer">
    <p>GiftsKart — Direct from manufacturer. No middlemen. Better price.</p>
    <p>This is a proforma invoice. GST and shipping charges may apply.</p>
  </div>
</body>
</html>`
    const blob = new Blob([invoiceHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${order.id}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page-wrapper" id="order-confirmation-page">
      <div className="container">
        <div className="confirmation-card animate-in">
          <div className="confirmation-icon">✓</div>
          <h1>Order Request Submitted!</h1>
          <div className="order-id" id="confirmation-order-id">{order.id}</div>
          
          <div className="confirmation-details">
            <dl>
              <dt>Product</dt>
              <dd>{order.product_name}</dd>
              <dt>Quantity</dt>
              <dd>{order.quantity} units</dd>
              <dt>Unit Price</dt>
              <dd>{formatPrice(order.price_per_unit)}</dd>
              <dt>Total Price</dt>
              <dd style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>{formatPrice(order.total_price)}</dd>
              <dt>Estimated Delivery</dt>
              <dd>{formatDate(order.delivery_date)}</dd>
              <dt>Company</dt>
              <dd>{order.company_name}</dd>
            </dl>
          </div>

          <div className="confirmation-status">
            📋 <strong>Status: Order Received</strong> — Our team will contact you within 24 hours to confirm your order and share the final quotation.
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleDownloadInvoice} id="download-invoice-btn">
              ⬇ Download Invoice
            </button>
            <Link to="/dashboard" className="btn btn-accent" id="track-order-btn">
              📦 Track Your Order
            </Link>
          </div>

          <p style={{ marginTop: 24, fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
            A confirmation email has been sent to <strong>{order.email}</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
