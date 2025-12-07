import { LucideIcon } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
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