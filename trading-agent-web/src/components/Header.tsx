import React from 'react';

interface HeaderProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const handleNavClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <header>
      <nav>
        <div className="logo">
          <h1 onClick={() => handleNavClick('home')} style={{ cursor: 'pointer' }}>
            AlphaFlow AI
          </h1>
        </div>
        <ul className="nav-links">
          <li>
            <button 
              onClick={() => handleNavClick('home')}
              className={currentPage === 'home' ? 'active' : ''}
            >
              Home
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavClick('about')}
              className={currentPage === 'about' ? 'active' : ''}
            >
              About
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavClick('roadmap')}
              className={currentPage === 'roadmap' ? 'active' : ''}
            >
              Roadmap
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleNavClick('dashboard')}
              className={currentPage === 'dashboard' ? 'active' : ''}
            >
              Dashboard
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header; 