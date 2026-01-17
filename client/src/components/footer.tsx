import { Link } from 'react-router-dom'
import '../styles/footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-section footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">🎬</span>
            <h3>ShowTimeX</h3>
          </div>
          <p className="footer-description">
            Experience cinema like never before. Book your tickets to the latest blockbusters and enjoy seamless movie booking with ShowTimeX.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon" title="Twitter">
              <span>𝕏</span>
            </a>
            <a href="#" className="social-icon" title="Facebook">
              <span>f</span>
            </a>
            <a href="#" className="social-icon" title="Instagram">
              <span>📷</span>
            </a>
            <a href="#" className="social-icon" title="YouTube">
              <span>▶️</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/my-bookings">My Bookings</Link></li>
            <li><Link to="/admin-dashboard">Admin Panel</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-section">
          <h4 className="footer-title">Movie Categories</h4>
          <ul className="footer-links">
            <li><a href="#">Action</a></li>
            <li><a href="#">Comedy</a></li>
            <li><a href="#">Drama</a></li>
            <li><a href="#">Thriller</a></li>
          </ul>
        </div>

        {/* Information */}
        <div className="footer-section">
          <h4 className="footer-title">Information</h4>
          <ul className="footer-links">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Help & Support</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="footer-section">
          <h4 className="footer-title">Legal</h4>
          <ul className="footer-links">
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms & Conditions</a></li>
            <li><a href="#cookies">Cookie Policy</a></li>
            <li><a href="#refund">Refund Policy</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            &copy; {currentYear} ShowTimeX. All rights reserved. | Your ultimate movie booking destination
          </p>
          <div className="footer-badges">
            <span className="badge">Best Prices</span>
            <span className="badge">Secure Booking</span>
            <span className="badge">Fast Tickets</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer