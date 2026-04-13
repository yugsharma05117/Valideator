import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-navbar">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" id="logo-link">
          <div className="navbar__logo-icon">
            <Shield size={22} />
          </div>
          <span className="navbar__logo-text">
            Valid<span className="navbar__logo-accent">eator</span>
          </span>
        </Link>

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          <Link 
            to="/" 
            className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}
            onClick={() => setMobileOpen(false)}
            id="nav-home"
          >
            Home
          </Link>
          <Link 
            to="/explore" 
            className={`navbar__link ${isActive('/explore') ? 'navbar__link--active' : ''}`}
            onClick={() => setMobileOpen(false)}
            id="nav-explore"
          >
            Explore
          </Link>
          <Link 
            to="/brainstorm" 
            className={`navbar__link ${isActive('/brainstorm') ? 'navbar__link--active' : ''}`}
            onClick={() => setMobileOpen(false)}
            id="nav-brainstorm"
          >
            Brainstorm
          </Link>
          <Link 
            to="/leaderboard" 
            className={`navbar__link ${isActive('/leaderboard') ? 'navbar__link--active' : ''}`}
            onClick={() => setMobileOpen(false)}
            id="nav-leaderboard"
          >
            Leaderboard
          </Link>
          <Link 
            to="/how-it-works" 
            className={`navbar__link ${isActive('/how-it-works') ? 'navbar__link--active' : ''}`}
            onClick={() => setMobileOpen(false)}
            id="nav-how"
          >
            How it Works
          </Link>
          <Link 
            to="/about" 
            className={`navbar__link ${isActive('/about') ? 'navbar__link--active' : ''}`}
            onClick={() => setMobileOpen(false)}
            id="nav-about"
          >
            About
          </Link>
        </div>

        <Link to="/explore" className="navbar__cta" id="nav-cta-button">
          Try Now
        </Link>

        <button 
          className="navbar__mobile-toggle" 
          onClick={() => setMobileOpen(!mobileOpen)}
          id="mobile-menu-toggle"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
