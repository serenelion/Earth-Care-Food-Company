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
import { AboutPage } from './pages/AboutPage';
import { WholesalePage } from './pages/WholesalePage';
import { Section, Product, CartItem } from './types';
import { getProducts } from './api/client';

const HomePage: React.FC<{ 
  cart: CartItem[], 
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>,
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ cart, setCart, setIsCartOpen }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const aboutRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);

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
    setIsCartOpen(true);
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
    </main>
  );
};

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
          <Route path="/" element={<HomePage cart={cart} setCart={setCart} setIsCartOpen={setIsCartOpen} />} />
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
        />
      </div>
    </Router>
  );
};

export default App;