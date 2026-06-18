import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Film, User, Bookmark } from 'lucide-react';
import './MobileNav.css';

const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/movies', icon: Film, label: 'Movies' },
    { path: '/profile', icon: User, label: 'My Xstream' },
  ];

  return (
    <nav className="mobile-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);
        return (
          <Link key={item.path} to={item.path} className={`mobile-nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
