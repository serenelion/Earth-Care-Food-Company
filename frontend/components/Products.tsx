import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Check, ShoppingCart, ArrowRight, Leaf } from 'lucide-react';

interface ProductsProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

export const Products: React.FC<ProductsProps> = ({ products, addToCart }) => {
  return (
    <section className="py-24 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full mb-4">
            <Leaf size={18} className="text-green-600" />
            <span className="font-semibold text-sm">Small-Batch • Farm-to-Table • Food as Medicine</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-earth-800 mb-4">Current Menu</h2>
          <p className="text-earth-600 max-w-2xl mx-auto text-lg mb-2">
            Limited-batch healing foods crafted with intention. Unlike mass-market products, each batch is made fresh from rescued ingredients.
          </p>
          <p className="text-earth-700 font-semibold">
            Subscribe below to be notified when new medicine becomes available.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl shadow-xl shadow-earth-900/5 hover:shadow-earth-900/10 transition duration-300 overflow-hidden border border-earth-100 flex flex-col transform hover:-translate-y-1">
              <Link to={`/product/${product.id}`} className="relative h-64 overflow-hidden bg-earth-100 block">
                <img 
                  src={product.image} 
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur text-earth-800 font-bold px-4 py-1 rounded-full text-sm shadow-sm">
                  ${parseFloat(String(product.price)).toFixed(2)}/{product.unit}
                </div>
              </Link>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-2xl font-serif font-bold text-earth-900 mb-2 hover:text-earth-700 transition">{product.name}</h3>
                  </Link>
                  <p className="text-earth-500 font-medium text-sm tracking-widest uppercase border-b border-earth-100 pb-2 inline-block">
                    {product.tagline}
                  </p>
                </div>
                
                <p className="text-earth-600 mb-6 text-sm leading-relaxed line-clamp-3">
                  {product.description}
                </p>

                <ul className="space-y-3 mb-8 flex-1">
                  {product.benefits.slice(0, 3).map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-earth-700">
                      <div className="mt-1 min-w-[16px]">
                        <Check size={16} className="text-green-600" />
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full py-4 bg-earth-800 text-cream-50 rounded-xl font-semibold hover:bg-earth-700 transition flex items-center justify-center gap-2 group-hover:bg-earth-900 active:scale-95"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingCart size={18} />
                    Add to Box
                  </button>
                  <Link 
                    to={`/product/${product.id}`}
                    className="w-full py-3 bg-cream-100 text-earth-800 rounded-xl font-semibold hover:bg-cream-200 transition flex items-center justify-center gap-2 border border-earth-200"
                  >
                    View Details
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};