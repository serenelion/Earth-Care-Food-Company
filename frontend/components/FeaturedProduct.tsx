import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { getProducts } from '../api/client';
import { Check, ShoppingCart, ArrowRight, Star } from 'lucide-react';

interface FeaturedProductProps {
  onAddToCart: (product: Product) => void;
}

export const FeaturedProduct: React.FC<FeaturedProductProps> = ({ onAddToCart }) => {
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      try {
        const data = await getProducts();
        const products = data.results || data;
        // Get Catskills Greek Yogurt (product ID 1)
        const featured = products.find((p: Product) => p.id === '1') || products[0];
        setFeaturedProduct(featured);
      } catch (error) {
        console.error('Failed to fetch featured product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProduct();
  }, []);

  if (loading || !featuredProduct) {
    return null;
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full mb-4">
            <Star size={18} className="text-orange-600 fill-orange-600" />
            <span className="font-semibold text-sm">Featured Medicine</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-earth-800 mb-4">
            This Week's Healing
          </h2>
          <p className="text-earth-600 max-w-2xl mx-auto text-lg">
            Our most popular food as medicine, crafted fresh in small batches.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Product Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-200 to-cream-300 rounded-3xl opacity-20 blur-2xl"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={featuredProduct.image} 
                alt={featuredProduct.name}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-earth-900 mb-4">
              {featuredProduct.name}
            </h3>
            
            <p className="text-xl text-earth-600 italic mb-6">
              {featuredProduct.tagline}
            </p>

            <p className="text-lg text-earth-700 mb-8 leading-relaxed">
              {featuredProduct.description}
            </p>

            <div className="mb-8">
              <h4 className="text-lg font-bold text-earth-900 mb-4">Healing Benefits:</h4>
              <ul className="space-y-3">
                {featuredProduct.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-earth-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-5xl font-bold text-earth-900">
                ${parseFloat(String(featuredProduct.price)).toFixed(2)}
              </span>
              <span className="text-lg text-earth-600">
                per {featuredProduct.unit}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onAddToCart(featuredProduct)}
                className="flex-1 px-8 py-4 bg-earth-800 text-cream-50 rounded-xl font-bold hover:bg-earth-700 transition flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingCart size={20} />
                Add to Box
              </button>
              <Link 
                to={`/product/${featuredProduct.id}`}
                className="flex-1 px-8 py-4 bg-cream-100 text-earth-800 rounded-xl font-bold hover:bg-cream-200 transition flex items-center justify-center gap-2 border-2 border-earth-200"
              >
                View Details
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
