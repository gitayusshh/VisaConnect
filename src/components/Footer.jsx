
import { Link } from "react-router-dom";
import { Plane } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div>
          <Link to="/" className="logo">
            <Plane size={24} />
            VisaConnect
          </Link>
          <p>
            Your trusted companion for exploring
            international visa opportunities.
          </p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/countries">Countries</Link>
          <Link to="/consultation">Consultation</Link>
          <Link to="/track">Track Application</Link>
        </div>

        <div>
          <h3>Support</h3>
          <p>Demo Visa Consultation Portal</p>
          <p>Contact details coming soon</p>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 VisaConnect. Frontend Assessment Project.
      </div>
    </footer>
  );
}

export default Footer;
