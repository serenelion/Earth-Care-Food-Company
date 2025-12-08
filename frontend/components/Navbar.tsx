import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Sprout } from 'lucide-react';

interface NavbarProps {
  onCartClick: () => void;
  cartCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onCartClick, cartCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const scrollToSection = (sectionId: string) => {
    if (!isHome) {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed w-full z-50 bg-cream-50/90 backdrop-blur-md border-b border-earth-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link 
            to="/"
            className="flex-shrink-0 flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-earth-700 rounded-full flex items-center justify-center text-cream-100">
              <Sprout size={24} />
            </div>
            <span className="font-serif font-bold text-lg md:text-xl text-earth-800 tracking-tight">
              Earth Care Food Company
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-earth-700 hover:text-earth-500 font-medium transition">Home</Link>
            <Link to="/about" className="text-earth-700 hover:text-earth-500 font-medium transition">About</Link>
            <button onClick={() => scrollToSection('products')} className="text-earth-700 hover:text-earth-500 font-medium transition">Shop</button>
            <button onClick={() => scrollToSection('education')} className="text-earth-700 hover:text-earth-500 font-medium transition">Education</button>
            <Link to="/wholesale" className="text-earth-700 hover:text-earth-500 font-medium transition">Wholesale</Link>
            
            <button 
              onClick={onCartClick}
              className="relative p-2 text-earth-800 hover:bg-earth-100 rounded-full transition"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
             <button 
              onClick={onCartClick}
              className="relative p-2 mr-4 text-earth-800 hover:bg-earth-100 rounded-full transition"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-earth-800 hover:text-earth-600 focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-cream-50 border-t border-earth-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block w-full text-left px-3 py-2 text-base font-medium text-earth-700 hover:bg-earth-100 rounded-md">Home</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block w-full text-left px-3 py-2 text-base font-medium text-earth-700 hover:bg-earth-100 rounded-md">About</Link>
            <button onClick={() => scrollToSection('products')} className="block w-full text-left px-3 py-2 text-base font-medium text-earth-700 hover:bg-earth-100 rounded-md">Shop</button>
            <button onClick={() => scrollToSection('education')} className="block w-full text-left px-3 py-2 text-base font-medium text-earth-700 hover:bg-earth-100 rounded-md">Education</button>
            <Link to="/wholesale" onClick={() => setIsOpen(false)} className="block w-full text-left px-3 py-2 text-base font-medium text-earth-700 hover:bg-earth-100 rounded-md">Wholesale</Link>
          </div>
        </div>
      )}
    </nav>
  );
};