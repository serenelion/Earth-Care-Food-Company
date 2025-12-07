import { LucideIcon } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: string | number; // API returns string, but we handle both
  unit: string;
  image: string;
  benefits: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export enum Section {
  HOME = 'home',
  ABOUT = 'about',
  PRODUCTS = 'products',
  MISSION = 'mission',
  EDUCATION = 'education'
}