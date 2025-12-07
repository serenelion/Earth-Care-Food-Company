import React from 'react';
import { Recycle, Heart, Sprout } from 'lucide-react';

export const Mission: React.FC = () => {
  return (
    <section className="py-24 bg-earth-800 text-cream-50 overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-earth-700 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-earth-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight">
              Permaculture in Practice:<br />
              <span className="text-cream-400">Closing the Loop.</span>
            </h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-earth-700 rounded-xl flex items-center justify-center text-cream-300">
                  <Recycle size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Eliminating Waste</h3>
                  <p className="text-cream-100/80 leading-relaxed">
                    We partner with "End of the Lane Farms" to take 100% grass-fed milk that would otherwise be discarded due to market surplus and transform it into nutrient-dense food.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-earth-700 rounded-xl flex items-center justify-center text-cream-300">
                  <Sprout size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Regenerative Farming</h3>
                  <p className="text-cream-100/80 leading-relaxed">
                    Our partner farms in the Catskills use rotational grazing to sequester carbon, build soil health, and ensure our cows live their best lives on open pastures.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-earth-700 rounded-xl flex items-center justify-center text-cream-300">
                  <Heart size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Direct to Community</h3>
                  <p className="text-cream-100/80 leading-relaxed">
                    By subscribing directly, you bypass the industrial food complex. No chemicals, no middlemen, just pure nutrition delivered from the farm to your door.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 border-2 border-cream-500/30 rounded-3xl transform rotate-2"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=1000&auto=format&fit=crop" 
                alt="Fresh raw milk in glass bottles" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                <blockquote className="text-cream-50 italic text-lg">
                  "Nature doesn't create waste. Everything is food for something else. We're just reconnecting the cycle."
                </blockquote>
                <p className="mt-4 font-bold text-cream-400">— Jay, End of the Lane Farms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};