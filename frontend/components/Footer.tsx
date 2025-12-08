import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Sprout } from 'lucide-react';
import { getProducts } from '../api/client';
import { Product } from '../types';

export const Footer: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.results || data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (!isHome) {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <footer className="bg-earth-900 text-earth-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-cream-500 rounded-full flex items-center justify-center text-earth-900">
                <Sprout size={24} />
              </div>
              <span className="text-2xl font-serif font-bold text-cream-50">Earth Care Food Company</span>
            </Link>
            <p className="text-earth-300 max-w-sm leading-relaxed mb-6">
              Healing the earth through your gut. Transforming food waste into medicine through the power of social permaculture.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-earth-400 hover:text-cream-50 transition" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-earth-400 hover:text-cream-50 transition" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-earth-400 hover:text-cream-50 transition" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Section */}
          <div>
            <h4 className="text-cream-50 font-bold mb-4 uppercase text-sm tracking-wider">Navigate</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-cream-100 transition">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cream-100 transition">About</Link>
              </li>
              <li>
                <button onClick={() => scrollToSection('mission')} className="hover:text-cream-100 transition text-left">
                  Mission
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('education')} className="hover:text-cream-100 transition text-left">
                  Education
                </button>
              </li>
              <li>
                <Link to="/wholesale" className="hover:text-cream-100 transition">Wholesale</Link>
              </li>
            </ul>
          </div>

          {/* Products Section - Dynamic */}
          <div>
            <h4 className="text-cream-50 font-bold mb-4 uppercase text-sm tracking-wider">Products</h4>
            <ul className="space-y-3">
              {products.slice(0, 4).map((product) => (
                <li key={product.id}>
                  <Link to={`/product/${product.id}`} className="hover:text-cream-100 transition">
                    {product.name}
                  </Link>
                </li>
              ))}
              {products.length > 4 && (
                <li>
                  <button onClick={() => scrollToSection('products')} className="hover:text-cream-100 transition text-left">
                    View All Products →
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-cream-50 font-bold mb-4 uppercase text-sm tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-earth-500 mt-1 flex-shrink-0" />
                <span className="text-sm">Catskills, NY<br />Ometepe Island, Nicaragua</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-earth-500 flex-shrink-0" />
                <a href="mailto:hello@earthcare.food" className="hover:text-cream-100 transition text-sm">
                  hello@earthcare.food
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-earth-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-earth-500">
          <p>&copy; {new Date().getFullYear()} Earth Care Food Company. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-earth-300 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-earth-300 transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};