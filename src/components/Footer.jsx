import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>🎁 GiftsKart</h3>
            <p>Direct from manufacturer. No middlemen. Better price. India's most trusted corporate gifting platform for bulk orders with real-time delivery tracking.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <Link to="/catalogue">Catalogue</Link>
            <Link to="/festival-gifts">Festival Gifts</Link>
            <Link to="/corporate-gifts">Corporate Gifts</Link>
            <Link to="/bulk-order">Bulk Order</Link>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div>
            <h4>Reach Us</h4>
            <a href="#">hello@giftskart.in</a>
            <a href="#">+91 98765 43210</a>
            <a href="#">Mumbai, India</a>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 GiftsKart. All rights reserved. Direct from manufacturer — no middlemen.
        </div>
      </div>
    </footer>
  )
}
