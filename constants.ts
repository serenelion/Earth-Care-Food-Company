import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Catskills Greek Yogurt',
    tagline: 'Thick, Creamy, & Alive',
    description: 'Made from 100% grass-fed milk reclaimed from surplus. Strained traditionally for maximum protein and probiotic density. A tart, rich foundation for your gut health.',
    price: 12.00,
    unit: '32oz',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop',
    benefits: ['20g Protein per serving', 'Trillions of CFUs', 'Zero thickeners']
  },
  {
    id: '2',
    name: 'Regenerative Whey Powder',
    tagline: 'Pure Bioavailable Recovery',
    description: 'Cold-processed whey from our yogurt making process. Instead of throwing this "waste" away, we dehydrate it into a powerful, nutrient-dense powder perfect for smoothies.',
    price: 45.00,
    unit: '2lb Bag',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800&auto=format&fit=crop',
    benefits: ['Cold-processed', 'Complete Amino Profile', 'Supports Muscle Repair']
  },
  {
    id: '3',
    name: 'Ancestral Kefir',
    tagline: 'The Champagne of Dairy',
    description: 'Fermented for 24 hours using heirloom grains. This effervescent probiotic drink is potent, tangy, and specifically designed to repopulate your microbiome.',
    price: 10.00,
    unit: '32oz',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&auto=format&fit=crop',
    benefits: ['30+ Probiotic Strains', 'Lactose-free', 'Mood Boosting']
  }
];