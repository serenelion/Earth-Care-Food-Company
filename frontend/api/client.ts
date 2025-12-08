import axios from 'axios';

// Use relative path for production, localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:8000/api' : '/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products
export const getProducts = async () => {
  const response = await api.get('/store/products/');
  return response.data;
};

// Checkout
export const createCheckoutSession = async (checkoutData: any) => {
  const response = await api.post('/store/checkout/', checkoutData);
  return response.data;
};

// Stripe Config
export const getStripeConfig = async () => {
  const response = await api.get('/store/stripe/config/');
  return response.data;
};

// Newsletter
export const subscribeNewsletter = async (email: string, firstName?: string, source?: string) => {
  const response = await api.post('/newsletter/subscribe/', {
    email,
    first_name: firstName || '',
    source: source || 'website'
  });
  return response.data;
};

// Wholesale Inquiry
export const submitWholesaleInquiry = async (data: any) => {
  const response = await api.post('/store/wholesale-inquiry/', data);
  return response.data;
};

// AI Chat
export const sendChatMessage = async (sessionId: string, message: string, email?: string) => {
  const response = await api.post('/coaching/chat/', {
    session_id: sessionId,
    message,
    email: email || ''
  });
  return response.data;
};

export const getConversationHistory = async (sessionId: string) => {
  const response = await api.get(`/coaching/conversation/${sessionId}/`);
  return response.data;
};

export default api;
