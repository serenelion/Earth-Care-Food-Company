import React, { useState, useEffect } from 'react';
import { Mail, Heart, Leaf, Users } from 'lucide-react';
import { subscribeNewsletter } from '../api/client';

export const AboutPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await subscribeNewsletter(email, firstName, 'about-page');
      setMessage(result.message);
      setEmail('');
      setFirstName('');
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-earth-800 to-earth-700 text-cream-50 py-24 pt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            Food as Medicine 🌱
          </h1>
          <p className="text-xl md:text-2xl text-earth-100 leading-relaxed">
            We believe in healing the soil to heal the gut, creating regenerative dairy 
            products that nourish both body and planet.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-earth-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="text-cream-50" size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-earth-900 mb-4">Zero Waste</h3>
              <p className="text-earth-700">
                Every byproduct from our yogurt-making becomes valuable nutrition. 
                Nothing goes to waste in our regenerative system.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-earth-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-cream-50" size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-earth-900 mb-4">Gut-Brain Health</h3>
              <p className="text-earth-700">
                Our probiotic-rich products support the gut-brain axis, where 90% of serotonin 
                is produced. Better mood through better food.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-earth-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-cream-50" size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-earth-900 mb-4">Community First</h3>
              <p className="text-earth-700">
                Supporting local farms, reducing food waste, and building a healthier 
                community one delicious bite at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-earth-800 text-cream-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Mail className="mx-auto mb-6" size={48} />
          <h2 className="text-4xl font-serif font-bold mb-4">
            Subscribe & Save 10% on Your First Order
          </h2>
          <p className="text-xl text-earth-200 mb-8">
            Join our community and get exclusive updates on new products, 
            gut-health tips, and subscriber-only deals.
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto space-y-4">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="w-full px-6 py-3 rounded-lg bg-cream-50 text-earth-900 placeholder-earth-500 focus:outline-none focus:ring-2 focus:ring-cream-500"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="w-full px-6 py-3 rounded-lg bg-cream-50 text-earth-900 placeholder-earth-500 focus:outline-none focus:ring-2 focus:ring-cream-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 bg-cream-500 text-earth-900 font-bold rounded-lg hover:bg-cream-400 transition disabled:opacity-50"
            >
              {loading ? 'Subscribing...' : 'Subscribe Now'}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-cream-100 font-semibold">{message}</p>
          )}
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-earth-900 mb-8 text-center">
            Our Story
          </h2>
          <div className="prose prose-lg mx-auto text-earth-700 space-y-6">
            <p>
              For millennia, humans understood a simple truth: what appears to be waste is simply 
              nourishment waiting for transformation. We've reconnected with this ancient wisdom.
            </p>
            <p>
              Where industrial systems see surplus to discard, we see medicine to preserve. Grass-fed 
              milk that exceeds market quotas becomes probiotic-rich yogurt and kefir. Whey that others 
              pour down drains becomes bioavailable protein powder. Abundant mangos destined for compost 
              piles become concentrated sources of vitamins and energy.
            </p>
            <p>
              This is the alchemy of permaculture: every output becomes an input. Every "problem" 
              reveals a solution. Every community's abundance can heal another community's deficiency. 
              From the Catskills to Ometepe Island, we partner with farmers and food artisans who 
              understand that nature creates no waste—only cycles.
            </p>
            <p>
              Our work is guided by a timeless principle: <strong className="text-earth-900">let food be thy medicine</strong>. 
              By preserving nutrients through fermentation, dehydration, and cold-processing, we transform 
              perishable abundance into shelf-stable superfoods that travel across oceans to nourish minds, 
              bodies, and communities.
            </p>
            <p className="font-bold text-earth-900">
              We're not inventing something new—we're remembering something eternal. The earth provides 
              abundance. Our role is simply to catch it, preserve it, and share it before it returns to soil.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
