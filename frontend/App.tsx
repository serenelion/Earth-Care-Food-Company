import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Mission } from './components/Mission';
import { About } from './components/About';
import { Products } from './components/Products';
import { Education } from './components/Education';
import { AiAssistant } from './components/AiAssistant';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { Toast, ToastType } from './components/Toast';
import { AboutPage } from './pages/AboutPage';
import { WholesalePage } from './pages/WholesalePage';
import { Section, Product, CartItem } from './types';
import { getProducts } from './api/client';

const HomePage: React.FC<{ 
  cart: CartItem[], 
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>,
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>,
  showToast: (message: string, type: ToastType) => void
}> = ({ cart, setCart, setIsCartOpen, showToast }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCartButton, setShowCartButton] = useState(false);
  
  const aboutRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);

  // Show floating cart button on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowCartButton(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.results || data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Fallback to empty array on error
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleNavigate = (section: Section) => {
    const refs = {
      [Section.HOME]: homeRef,
      [Section.ABOUT]: aboutRef,
      [Section.MISSION]: missionRef,
      [Section.PRODUCTS]: productsRef,
      [Section.EDUCATION]: educationRef,
    };
    
    // @ts-ignore
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    // Show toast notification instead of immediately opening cart
    showToast(`${product.name} added to cart!`, 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-earth-700 mx-auto mb-4"></div>
          <p className="text-earth-700 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div ref={homeRef} id="home">
        <Hero onShopClick={() => handleNavigate(Section.PRODUCTS)} />
      </div>
      
      <div ref={aboutRef} id="about">
        <About />
      </div>
      
      <div ref={missionRef} id="mission">
        <Mission />
      </div>
      
      <div ref={productsRef} id="products">
        <Products products={products} addToCart={addToCart} />
      </div>

      <div ref={educationRef} id="education">
        <Education />
      </div>

      {/* Floating Cart Button */}
      {showCartButton && cart.length > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-24 right-6 z-40 bg-earth-800 text-cream-50 px-6 py-3 rounded-full shadow-2xl hover:bg-earth-700 transition-all duration-300 flex items-center gap-2 animate-in slide-in-from-bottom-10"
        >
          View Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
        </button>
      )}
    </main>
  );
};

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen bg-cream-50 text-earth-900 font-sans selection:bg-earth-200">
        <Navbar cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
        
        <Routes>
          <Route path="/" element={<HomePage cart={cart} setCart={setCart} setIsCartOpen={setIsCartOpen} showToast={showToast} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/wholesale" element={<WholesalePage />} />
        </Routes>

        <Footer />
        
        <AiAssistant />

        <CartSidebar 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          showToast={showToast}
        />

        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </div>
    </Router>
  );
};

export default App;