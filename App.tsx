import React, { useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Mission } from './components/Mission';
import { About } from './components/About';
import { Products } from './components/Products';
import { Education } from './components/Education';
import { AiAssistant } from './components/AiAssistant';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { Section, Product, CartItem } from './types';
import { PRODUCTS } from './constants';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Refs for scrolling
  const aboutRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-cream-50 text-earth-900 font-sans selection:bg-earth-200">
      <Navbar 
        onNavigate={handleNavigate} 
        onCartClick={() => setIsCartOpen(true)}
        cartCount={cartCount} 
      />
      
      <main>
        <div ref={homeRef}>
          <Hero onShopClick={() => handleNavigate(Section.PRODUCTS)} />
        </div>
        
        <div ref={aboutRef}>
          <About />
        </div>
        
        <div ref={missionRef}>
          <Mission />
        </div>
        
        <div ref={productsRef}>
          <Products products={PRODUCTS} addToCart={addToCart} />
        </div>

        <div ref={educationRef}>
          <Education />
        </div>
      </main>

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
  );
};

export default App;