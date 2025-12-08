import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick }) => {
  return (
    <div className="relative pt-20 pb-16 md:pt-32 md:pb-24 flex items-center min-h-[90vh] overflow-hidden bg-earth-800">
      
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop" 
          alt="Regenerative Farm Sunrise" 
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-900 via-earth-900/50 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-cream-500/20 text-cream-200 text-sm font-semibold tracking-wider mb-6 border border-cream-500/30">
          SMALL-BATCH • FARM-TO-TABLE • NOT SOLD IN STORES
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-cream-50 mb-6 leading-tight">
          Healing the Earth.<br />
          <span className="text-cream-400">Through Your Gut.</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-cream-100/90 leading-relaxed">
          Your gut microbiome is the gateway to healing—both your body and the planet. We transform nutrient-rich foods destined for waste into powerful superfoods that regenerate your inner ecosystem and support regenerative farming worldwide.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onShopClick}
            className="px-8 py-4 bg-cream-500 hover:bg-cream-400 text-earth-900 font-bold rounded-full transition transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-cream-500/20"
          >
            Shop the Collection <ArrowRight size={20} />
          </button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 text-cream-200/60 max-w-3xl mx-auto border-t border-cream-200/10 pt-8">
          <div>
            <p className="text-2xl font-serif text-cream-100">Global</p>
            <p className="text-sm uppercase tracking-widest">Food Rescue</p>
          </div>
          <div>
            <p className="text-2xl font-serif text-cream-100">Zero</p>
            <p className="text-sm uppercase tracking-widest">Waste</p>
          </div>
          <div>
            <p className="text-2xl font-serif text-cream-100">Living</p>
            <p className="text-sm uppercase tracking-widest">Medicine</p>
          </div>
        </div>
      </div>
    </div>
  );
};