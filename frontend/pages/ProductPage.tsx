import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Check, Leaf, Award, Heart } from 'lucide-react';
import { Product } from '../types';
import { getProducts } from '../api/client';

interface ProductPageProps {
  onAddToCart: (product: Product) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProducts();
        const products = data.results || data;
        const foundProduct = products.find((p: Product) => p.id === id);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        onAddToCart(product);
      }
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-earth-700 mx-auto mb-4"></div>
          <p className="text-earth-700 text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-earth-900 mb-4">Product Not Found</h1>
          <p className="text-earth-600 mb-8">Sorry, we couldn't find this product.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-earth-800 text-cream-50 rounded-full hover:bg-earth-700 transition">
            <ArrowLeft size={20} /> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-earth-600 hover:text-earth-800 transition">
            <ArrowLeft size={20} /> Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-earth-100">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-white rounded-xl border border-earth-200">
                <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-earth-800">Zero Waste</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-earth-200">
                <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-earth-800">Regenerative</p>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-earth-200">
                <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-earth-800">Handcrafted</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-earth-900 mb-4">
              {product.name}
            </h1>
            
            <p className="text-xl text-earth-600 italic mb-6">
              {product.tagline}
            </p>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-5xl font-bold text-earth-900">
                ${parseFloat(String(product.price)).toFixed(2)}
              </span>
              <span className="text-lg text-earth-600">
                per {product.unit}
              </span>
            </div>

            <div className="prose prose-lg text-earth-700 mb-8">
              <p>{product.description}</p>
            </div>

            {/* Benefits */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-earth-900 mb-4">Key Benefits</h3>
              <ul className="space-y-3">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <span className="text-earth-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Add to Cart Section */}
            <div className="bg-white rounded-2xl p-6 border-2 border-earth-200">
              <div className="flex items-center gap-4 mb-6">
                <label htmlFor="quantity" className="text-earth-700 font-semibold">
                  Quantity:
                </label>
                <div className="flex items-center border border-earth-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-earth-700 hover:bg-earth-100 transition rounded-l-lg"
                  >
                    −
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-x border-earth-300 py-2 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-earth-700 hover:bg-earth-100 transition rounded-r-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 ${
                  added
                    ? 'bg-green-600 text-white'
                    : 'bg-earth-800 text-cream-50 hover:bg-earth-700'
                }`}
              >
                {added ? (
                  <>
                    <Check size={24} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={24} /> Add to Cart
                  </>
                )}
              </button>

              <p className="text-sm text-earth-600 text-center mt-4">
                Free shipping on orders over $50
              </p>
            </div>

            {/* Additional Info */}
            <div className="mt-8 space-y-4">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-white rounded-lg border border-earth-200 font-semibold text-earth-800">
                  <span>Shipping & Returns</span>
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <div className="p-4 text-earth-700 text-sm leading-relaxed">
                  <p>We ship within 2-3 business days. Free shipping on orders over $50. Returns accepted within 30 days of purchase.</p>
                </div>
              </details>

              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-white rounded-lg border border-earth-200 font-semibold text-earth-800">
                  <span>Storage Instructions</span>
                  <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <div className="p-4 text-earth-700 text-sm leading-relaxed">
                  <p>Keep refrigerated. Best consumed within 2 weeks of opening. Store in original container to maintain freshness.</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
