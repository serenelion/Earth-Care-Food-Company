import React from 'react';
import { Product } from '../types';
import { Check, ShoppingCart } from 'lucide-react';

interface ProductsProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

export const Products: React.FC<ProductsProps> = ({ products, addToCart }) => {
  return (
    <section className="py-24 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-earth-800 mb-4">Reclaimed Superfoods</h2>
          <p className="text-earth-600 max-w-2xl mx-auto text-lg">
            Sourced directly from End of the Lane Farms. We don't just sell food; we circulate nutrition that was meant to be lost.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl shadow-xl shadow-earth-900/5 hover:shadow-earth-900/10 transition duration-300 overflow-hidden border border-earth-100 flex flex-col transform hover:-translate-y-1">
              <div className="relative h-64 overflow-hidden bg-earth-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-earth-800 font-bold px-4 py-1 rounded-full text-sm shadow-sm">
                  ${product.price}/{product.unit}
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-2xl font-serif font-bold text-earth-900 mb-2">{product.name}</h3>
                  <p className="text-earth-500 font-medium text-sm tracking-widest uppercase border-b border-earth-100 pb-2 inline-block">
                    {product.tagline}
                  </p>
                </div>
                
                <p className="text-earth-600 mb-6 text-sm leading-relaxed">
                  {product.description}
                </p>

                <ul className="space-y-3 mb-8 flex-1">
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-earth-700">
                      <div className="mt-1 min-w-[16px]">
                        <Check size={16} className="text-green-600" />
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => addToCart(product)}
                  className="w-full py-4 bg-earth-800 text-cream-50 rounded-xl font-semibold hover:bg-earth-700 transition flex items-center justify-center gap-2 group-hover:bg-earth-900 active:scale-95"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingCart size={18} />
                  Add to Box
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};