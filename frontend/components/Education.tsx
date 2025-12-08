import React from 'react';
import { Brain, Activity, Zap } from 'lucide-react';

export const Education: React.FC = () => {
  return (
    <section className="py-24 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-earth-600 font-bold tracking-widest uppercase text-sm mb-2 block">Food as Medicine</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-earth-900 mb-6">Healing the Earth, Through Your Gut</h2>
          <p className="text-lg text-earth-700">
            The microbiome in your gut doesn't just digest food—it regenerates your entire body and mind. 
            When we heal our inner ecosystem with living foods, we simultaneously heal the outer ecosystem through our choices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-cream-200">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-6">
              <Brain size={32} />
            </div>
            <h3 className="text-2xl font-bold text-earth-900 mb-3">Living Cultures as Medicine</h3>
            <p className="text-earth-600">
              Fermented foods like our kefir and yogurt contain billions of living organisms that colonize your gut, 
              producing neurotransmitters, vitamins, and anti-inflammatory compounds that heal from the inside out. 
              Complemented by vitamin C from sun-dried mango, your immune system strengthens its communication pathways.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-cream-200">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
              <Activity size={32} />
            </div>
            <h3 className="text-2xl font-bold text-earth-900 mb-3">Anti-Inflammatory Nourishment</h3>
            <p className="text-earth-600">
              Chronic inflammation is the root of modern disease. Our grass-fed dairy delivers omega-3s and CLA, 
              while polyphenols from dehydrated fruit work synergistically to quiet inflammatory pathways. 
              This is preventive medicine you can taste.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-cream-200">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
              <Zap size={32} />
            </div>
            <h3 className="text-2xl font-bold text-earth-900 mb-3">Bioavailable Healing</h3>
            <p className="text-earth-600">
              Medicine works only if your body can absorb it. Our cold-processed whey and traditionally dehydrated fruits 
              preserve their native molecular structures, ensuring your cells receive complete amino acids, enzymes, and 
              micronutrients exactly as nature intended—medicine in its most recognizable form.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
