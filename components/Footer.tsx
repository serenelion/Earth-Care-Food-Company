import React from 'react';
import { Facebook, Instagram, Twitter, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-earth-900 text-earth-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-serif font-bold text-cream-50 mb-4">Earth Care Food Company</h3>
            <p className="text-earth-300 max-w-sm leading-relaxed mb-6">
              Innovating at the intersection of permaculture and health. reclaiming food waste to nourish the gut and the soil.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-earth-400 hover:text-cream-50 transition"><Instagram size={20} /></a>
              <a href="#" className="text-earth-400 hover:text-cream-50 transition"><Facebook size={20} /></a>
              <a href="#" className="text-earth-400 hover:text-cream-50 transition"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-cream-50 font-bold mb-4 uppercase text-sm tracking-wider">Shop</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-cream-100 transition">Catskills Greek Yogurt</a></li>
              <li><a href="#" className="hover:text-cream-100 transition">Regenerative Whey</a></li>
              <li><a href="#" className="hover:text-cream-100 transition">Raw Kefir</a></li>
              <li><a href="#" className="hover:text-cream-100 transition">Wholesale</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-cream-50 font-bold mb-4 uppercase text-sm tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-earth-500" />
                <span>Catskills, NY</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-earth-500" />
                <span>hello@earthcare.food</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-earth-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-earth-500">
          <p>&copy; {new Date().getFullYear()} Earth Care Food Company. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-earth-300">Privacy Policy</a>
            <a href="#" className="hover:text-earth-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};