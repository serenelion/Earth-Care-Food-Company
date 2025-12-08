import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';

export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/newsletter/subscribe/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Welcome to our community! Check your email for updates.');
        setEmail('');
      } else {
        const data = await response.json();
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Connection error. Please try again later.');
    }

    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  return (
    <section className="py-24 bg-earth-800 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cream-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cream-400 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block p-3 bg-cream-500/20 rounded-full mb-6">
          <Mail className="w-8 h-8 text-cream-300" />
        </div>
        
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-cream-50 mb-6">
          Join Our Food-As-Medicine Community
        </h2>
        
        <p className="text-xl text-cream-200 mb-4 max-w-2xl mx-auto leading-relaxed">
          We craft small-batch, farm-to-table superfoods. Not like Amazon or Whole Foods—this is medicine made with intention.
        </p>
        
        <p className="text-lg text-cream-300 mb-10 max-w-2xl mx-auto">
          Subscribe to get notified when new healing foods become available. Limited batches, infinite benefits.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full border-2 border-cream-500/30 bg-cream-50/10 text-cream-50 placeholder-cream-400 focus:outline-none focus:border-cream-500 backdrop-blur-sm"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`px-8 py-4 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                status === 'success'
                  ? 'bg-green-600 text-white'
                  : 'bg-cream-500 hover:bg-cream-400 text-earth-900'
              } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
            >
              {status === 'loading' ? (
                <>
                  <span className="animate-spin">⏳</span> Subscribing...
                </>
              ) : status === 'success' ? (
                <>
                  <Check size={20} /> Subscribed!
                </>
              ) : (
                'Get Updates'
              )}
            </button>
          </div>
          
          {message && (
            <p className={`mt-4 text-sm ${status === 'error' ? 'text-red-300' : 'text-green-300'}`}>
              {message}
            </p>
          )}
        </form>

        <p className="mt-6 text-sm text-cream-400">
          🌿 Join 1,000+ people healing through food. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};
