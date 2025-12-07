import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, CheckCircle, Lock, CreditCard } from 'lucide-react';
import { CartItem } from '../types';
import { ToastType } from './Toast';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  showToast: (message: string, type: ToastType) => void;
}

type CheckoutStep = 'cart' | 'details' | 'success';

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  showToast
}) => {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(String(item.price)) * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + shipping;

  // Reset step when closed/opened
  useEffect(() => {
    if (isOpen && step === 'success') {
      setStep('cart');
    }
  }, [isOpen]);

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setStep('success');
    onClearCart();
    showToast('Order placed successfully!', 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-earth-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-cream-50 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-earth-200 bg-white">
            <h2 className="text-lg font-serif font-bold text-earth-900">
              {step === 'cart' && 'Your Basket'}
              {step === 'details' && 'Secure Checkout'}
              {step === 'success' && 'Order Confirmed'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-earth-100 rounded-full text-earth-600 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {step === 'cart' && (
              <div className="p-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-earth-100 rounded-full flex items-center justify-center mx-auto mb-6 text-earth-400">
                      <Trash2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-earth-800 mb-2">Your cart is empty</h3>
                    <p className="text-earth-600 mb-8">Looks like you haven't added any superfoods yet.</p>
                    <button 
                      onClick={onClose}
                      className="px-6 py-3 bg-earth-800 text-cream-50 rounded-xl font-semibold hover:bg-earth-700 transition"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-6">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-earth-100 flex-shrink-0 border border-earth-200">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-earth-900 line-clamp-1">{item.name}</h3>
                            <p className="text-sm text-earth-500">{item.unit} • ${parseFloat(String(item.price)).toFixed(2)}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-earth-200 rounded-lg bg-white">
                              <button 
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="p-1 hover:bg-earth-50 text-earth-600 transition"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="p-1 hover:bg-earth-50 text-earth-600 transition"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button 
                              onClick={() => onRemoveItem(item.id)}
                              className="text-xs text-red-500 hover:text-red-700 underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {step === 'details' && (
              <form id="checkout-form" onSubmit={handleSubmitOrder} className="p-6 space-y-6">
                
                <div className="space-y-4">
                  <h3 className="font-bold text-earth-900 border-b border-earth-200 pb-2">Contact Info</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <input required type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:ring-2 focus:ring-earth-500 focus:border-transparent outline-none bg-white" />
                    <input required type="tel" placeholder="Phone Number" className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:ring-2 focus:ring-earth-500 focus:border-transparent outline-none bg-white" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-earth-900 border-b border-earth-200 pb-2">Shipping Address</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="text" placeholder="First Name" className="col-span-1 px-4 py-3 rounded-xl border border-earth-200 focus:ring-2 focus:ring-earth-500 focus:border-transparent outline-none bg-white" />
                    <input required type="text" placeholder="Last Name" className="col-span-1 px-4 py-3 rounded-xl border border-earth-200 focus:ring-2 focus:ring-earth-500 focus:border-transparent outline-none bg-white" />
                    <input required type="text" placeholder="Street Address" className="col-span-2 px-4 py-3 rounded-xl border border-earth-200 focus:ring-2 focus:ring-earth-500 focus:border-transparent outline-none bg-white" />
                    <input required type="text" placeholder="City" className="col-span-1 px-4 py-3 rounded-xl border border-earth-200 focus:ring-2 focus:ring-earth-500 focus:border-transparent outline-none bg-white" />
                    <input required type="text" placeholder="Zip Code" className="col-span-1 px-4 py-3 rounded-xl border border-earth-200 focus:ring-2 focus:ring-earth-500 focus:border-transparent outline-none bg-white" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-earth-900 border-b border-earth-200 pb-2">Payment</h3>
                  <div className="p-4 bg-earth-100 rounded-xl border border-earth-200 text-sm text-earth-700 flex items-center gap-3">
                    <Lock size={16} />
                    Payments are encrypted and secure.
                  </div>
                  <div className="relative">
                    <input required type="text" placeholder="Card Number" className="w-full px-4 py-3 rounded-xl border border-earth-200 focus:ring-2 focus:ring-earth-500 focus:border-transparent outline-none bg-white pl-12" />
                    <CreditCard className="absolute left-4 top-3.5 text-earth-400" size={20} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="text" placeholder="MM/YY" className="px-4 py-3 rounded-xl border border-earth-200 focus:ring-2 focus:ring-earth-500 focus:border-transparent outline-none bg-white" />
                    <input required type="text" placeholder="CVC" className="px-4 py-3 rounded-xl border border-earth-200 focus:ring-2 focus:ring-earth-500 focus:border-transparent outline-none bg-white" />
                  </div>
                </div>
              </form>
            )}

            {step === 'success' && (
              <div className="p-8 flex flex-col items-center text-center h-full justify-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-in zoom-in duration-500">
                  <CheckCircle size={48} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-earth-900 mb-4">Thank You!</h3>
                <p className="text-earth-600 mb-8 text-lg">
                  Your order has been placed successfully. We'll send a confirmation email shortly with tracking details.
                </p>
                <div className="bg-white p-6 rounded-2xl border border-earth-200 w-full mb-8 shadow-sm">
                  <p className="text-sm text-earth-500 uppercase tracking-widest mb-2">Order Reference</p>
                  <p className="font-mono font-bold text-lg text-earth-800">#ECF-{Math.floor(Math.random() * 10000)}</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-full px-6 py-4 bg-earth-800 text-cream-50 rounded-xl font-bold hover:bg-earth-700 transition"
                >
                  Return to Home
                </button>
              </div>
            )}
          </div>

          {/* Footer Area */}
          {step !== 'success' && cartItems.length > 0 && (
            <div className="border-t border-earth-200 bg-white p-6 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-earth-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-earth-600">
                  <span>Shipping {shipping === 0 && <span className="text-green-600 font-bold">(Free)</span>}</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-earth-900 pt-2 border-t border-dashed border-earth-200">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {step === 'cart' ? (
                <button 
                  onClick={() => setStep('details')}
                  className="w-full py-4 bg-earth-800 text-cream-50 rounded-xl font-bold hover:bg-earth-700 transition flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight size={20} />
                </button>
              ) : (
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setStep('cart')}
                    className="px-6 py-4 border border-earth-200 text-earth-800 rounded-xl font-bold hover:bg-earth-50 transition"
                  >
                    Back
                  </button>
                  <button 
                    form="checkout-form"
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-earth-800 text-cream-50 rounded-xl font-bold hover:bg-earth-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>Pay ${total.toFixed(2)}</>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};