
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Plane, Menu, X, LogOut, LayoutDashboard } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(user && token);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMenuOpen(false);
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo" onClick={closeMenu}>
          <Plane size={26} />
          <span>VisaConnect</span>
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
          <NavLink to="/countries" onClick={closeMenu}>Countries</NavLink>
          <NavLink to="/consultation" onClick={closeMenu}>Visa Services</NavLink>
          <NavLink to="/track" onClick={closeMenu}>Track Application</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
        </nav>

        <div className={`nav-actions ${menuOpen ? "actions-open" : ""}`}>
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="login-btn"
                onClick={closeMenu}
              >
                <LayoutDashboard size={17} />
                Dashboard
              </Link>

              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn" onClick={closeMenu}>
                Login
              </Link>

              <Link to="/signup" className="primary-btn" onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
