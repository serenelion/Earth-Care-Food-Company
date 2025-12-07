import React, { useState } from 'react';
import { Store, Package, TrendingUp, CheckCircle } from 'lucide-react';
import { submitWholesaleInquiry } from '../api/client';

export const WholesalePage: React.FC = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    location: '',
    website: '',
    estimatedMonthlyVolume: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await submitWholesaleInquiry({
        business_name: formData.businessName,
        contact_name: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        business_type: formData.businessType,
        location: formData.location,
        website: formData.website,
        estimated_monthly_volume: formData.estimatedMonthlyVolume,
        message: formData.message
      });
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 pt-20">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-earth-900 mb-4">
            Thank You for Your Interest!
          </h2>
          <p className="text-lg text-earth-700 mb-8">
            We've received your wholesale inquiry and will get back to you within 1-2 business days 
            to discuss partnership opportunities.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-earth-700 text-cream-50 font-bold rounded-lg hover:bg-earth-600 transition"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-earth-800 to-earth-700 text-cream-50 py-20 pt-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            Become a Wholesale Partner
          </h1>
          <p className="text-xl md:text-2xl text-earth-100">
            Bring regenerative, gut-healthy products to your customers
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-14 h-14 bg-earth-600 rounded-full flex items-center justify-center mb-6">
                <Store className="text-cream-50" size={28} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-earth-900 mb-3">
                Premium Products
              </h3>
              <p className="text-earth-700">
                Offer your customers authentic, zero-waste dairy products that stand out from mass-produced alternatives.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-14 h-14 bg-earth-600 rounded-full flex items-center justify-center mb-6">
                <Package className="text-cream-50" size={28} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-earth-900 mb-3">
                Flexible Ordering
              </h3>
              <p className="text-earth-700">
                Weekly deliveries, competitive wholesale pricing, and customizable order volumes to fit your business.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-14 h-14 bg-earth-600 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="text-cream-50" size={28} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-earth-900 mb-3">
                Marketing Support
              </h3>
              <p className="text-earth-700">
                Co-branded materials, product training, and storytelling assets to help you sell more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ideal Partners */}
      <section className="py-16 bg-earth-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-bold text-earth-900 mb-8">
            Ideal Partner Businesses
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {[
              'Health Food Stores & Co-ops',
              'Specialty Grocery Stores',
              'Cafes & Coffee Shops',
              'Restaurants with Breakfast/Brunch',
              'Yoga Studios & Wellness Centers',
              'Farm Stands & Farmers Markets'
            ].map((business, idx) => (
              <div key={idx} className="flex items-center space-x-3 bg-white p-4 rounded-lg">
                <CheckCircle className="text-earth-600 flex-shrink-0" size={24} />
                <span className="text-lg text-earth-800">{business}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-serif font-bold text-earth-900 mb-8 text-center">
              Partner Inquiry Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-earth-900 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-earth-900 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-earth-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-earth-900 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-earth-900 mb-2">
                    Business Type *
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-500"
                  >
                    <option value="">Select type...</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Cafe">Cafe</option>
                    <option value="Grocery Store">Grocery Store</option>
                    <option value="Health Food Store">Health Food Store</option>
                    <option value="Farmers Market">Farmers Market</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-earth-900 mb-2">
                    Location (City, State) *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-earth-900 mb-2">
                    Website (optional)
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-earth-900 mb-2">
                    Estimated Monthly Volume
                  </label>
                  <input
                    type="text"
                    name="estimatedMonthlyVolume"
                    value={formData.estimatedMonthlyVolume}
                    onChange={handleChange}
                    placeholder="e.g., 50 units/month"
                    className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-earth-900 mb-2">
                  Tell us about your business and why you'd like to partner with us *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-500"
                />
              </div>

              {error && (
                <p className="text-red-600 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 bg-earth-700 text-cream-50 font-bold text-lg rounded-lg hover:bg-earth-600 transition disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
