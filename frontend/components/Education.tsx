import React from 'react';
import { Brain, Activity, Zap } from 'lucide-react';

export const Education: React.FC = () => {
  return (
    <section className="py-24 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-earth-600 font-bold tracking-widest uppercase text-sm mb-2 block">The Science</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-earth-900 mb-6">The Gut-Brain Connection</h2>
          <p className="text-lg text-earth-700">
            Your gut is your "second brain." The trillions of bacteria in your microbiome communicate directly with your nervous system, influencing your mood, energy, and clarity. Different foods offer unique pathways to wellness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-cream-200">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-6">
              <Brain size={32} />
            </div>
            <h3 className="text-2xl font-bold text-earth-900 mb-3">Psychobiotics</h3>
            <p className="text-earth-600">
              Our kefir and yogurt are rich in beneficial bacteria strains known to produce neurotransmitters like serotonin and dopamine, directly uplifting your mood. Meanwhile, our dried mango delivers vitamin C to support immune-brain communication.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-cream-200">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
              <Activity size={32} />
            </div>
            <h3 className="text-2xl font-bold text-earth-900 mb-3">Inflammation Defense</h3>
            <p className="text-earth-600">
              100% grass-fed dairy is higher in Omega-3 fatty acids and CLA, while our sun-dried mango preserves polyphenols that work together as potent anti-inflammatories protecting your brain from oxidative stress.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-cream-200">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
              <Zap size={32} />
            </div>
            <h3 className="text-2xl font-bold text-earth-900 mb-3">Bioavailable Energy</h3>
            <p className="text-earth-600">
              Raw whey protein provides complete amino acids in their native structure, while natural fruit sugars in our dried mango offer clean, sustained energy without crashing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
