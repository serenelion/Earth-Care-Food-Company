import React from 'react';
import { Milk, Snowflake, ArrowRight } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section className="py-24 bg-cream-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Image Side */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute top-0 left-0 w-full h-full bg-earth-200 rounded-3xl transform -rotate-3 scale-105"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/5] lg:aspect-auto lg:h-[600px]">
              <img 
                src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1000&auto=format&fit=crop" 
                alt="Farmer in the snow with milk" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-earth-900/80 via-transparent to-transparent flex items-end p-8">
                <div className="text-cream-50">
                  <p className="font-serif italic text-lg opacity-90">"Nature provides abundance. It is our job not to waste it."</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="flex items-center gap-2 text-earth-600 font-bold tracking-widest uppercase text-sm">
              <Snowflake size={16} />
              <span>The Origin Story</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-earth-900 leading-tight">
              It Started With <br/>
              <span className="text-earth-500">9 Gallons of Milk.</span>
            </h2>

            <div className="space-y-6 text-lg text-earth-700 leading-relaxed">
              <p>
                It began on a snowy evening in the Catskills. Farmer Jay at <strong>End of the Lane Farms</strong> handed us a challenge: 9 gallons of pristine, 100% grass-fed milk that had no buyer. 
              </p>
              <p>
                In the industrial food system, this "surplus" would be poured down the drain. But to us, it was liquid gold.
              </p>
              <p>
                That night, an experiment was born. We took the milk home and transformed it. We strained it, fermented it, and discovered that the waste of the dairy industry could become the <strong>medicine of the future</strong>.
              </p>
              <p>
                We realized that the solution to food waste wasn't just "saving" food—it was elevating it. Today, Earth Care Food Company exists to close the loop, turning farm surplus into the most nutrient-dense, gut-healing superfoods on the market.
              </p>
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-earth-200 flex-1"></div>
                <Milk className="text-earth-400" />
                <div className="h-px bg-earth-200 flex-1"></div>
              </div>
              <p className="font-serif text-xl text-earth-800 font-bold">
                Healing the soil. Healing the gut. Healing the cycle.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};