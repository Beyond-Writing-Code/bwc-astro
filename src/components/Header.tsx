import { useState } from 'react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <a href="/" className="logo-link" onClick={closeMenu}>
          <img
            src="/images/creature-logo.png"
            alt="A tiny drawing of a colorful watercolor creature, looking up"
            className="logo-image"
            width="50"
            height="50"
          />
        </a>

        <a href="/" className="title-link" onClick={closeMenu}>
          <h1 className="site-title">Beyond Writing Code</h1>
        </a>

        <button
          className="mobile-menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <nav className={`site-nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <a href="/about" onClick={closeMenu}>
            About
          </a>
          <a href="/book" onClick={closeMenu}>
            Book
          </a>
          <a href="/art" onClick={closeMenu}>
            Art
          </a>
          <a href="/posts" onClick={closeMenu}>
            Posts
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
