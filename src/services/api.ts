import axios from 'axios';
import { SearchParams, Flight, Booking, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://flyeasy-backend.onrender.com/api';

// Types
export interface FlightSearchParams {
  origin: string;
  destination: string;
  depart_date: string;
  [key: string]: string | number;
}

export type PaystackInitPayload = Record<string, string | number>;

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const flightAPI = {
  // Search flights using Amadeus API
  searchFlights: async (params: SearchParams): Promise<Flight[]> => {
    const response = await api.post('/flights/search', params);
    return response.data.flights;
  },

  // Get flight details
  getFlightDetails: async (flightId: string): Promise<Flight> => {
    const response = await api.get(`/flights/${flightId}`);
    return response.data;
  },

  // Create booking
  createBooking: async (bookingData: Partial<Booking>): Promise<Booking> => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get user bookings
  getUserBookings: async (userId: string): Promise<Booking[]> => {
    const response = await api.get(`/users/${userId}/bookings`);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId: string): Promise<void> => {
    await api.patch(`/bookings/${bookingId}/cancel`);
  }
};

export const userAPI = {
  // Register user
  register: async (userData: Partial<User> & { password: string }): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.patch('/auth/profile', userData);
    return response.data;
  }
};

export const paymentAPI = {
  // Initialize Paystack payment
  initializePayment: async (amount: number, email: string, currency: string = 'NGN') => {
    const response = await api.post('/payments/initialize', {
      amount: amount * 100, // Paystack expects amount in kobo
      email,
      currency
    });
    return response.data;
  },

  // Verify payment
  verifyPayment: async (reference: string) => {
    const response = await api.get(`/payments/verify/${reference}`);
    return response.data;
  }
};

export const currencyAPI = {
  // Get exchange rates
  getExchangeRates: async () => {
    const response = await api.get('/currencies/rates');
    return response.data;
  },

  // Convert currency
  convertCurrency: async (amount: number, from: string, to: string) => {
    const response = await api.post('/currencies/convert', { amount, from, to });
    return response.data;
  }
};

export const notificationAPI = {
  // Send price alert notification
  sendPriceAlert: async (userId: string, alertData: Record<string, unknown>) => {
    const response = await api.post('/notifications/price-alert', { userId, ...alertData });
    return response.data;
  },

  // Get user notifications
  getUserNotifications: async (userId: string) => {
    const response = await api.get(`/users/${userId}/notifications`);
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    await api.patch(`/notifications/${notificationId}/read`);
  }
};

// Flight search (Travelpayouts)
export const searchFlights = async (params: FlightSearchParams): Promise<Record<string, unknown>> => {
  const { data } = await axios.get(API_BASE_URL + '/flights/search', { params });
  return data;
};

// Flight status (Aviationstack)
export const getFlightStatus = async (params: Record<string, string>): Promise<Record<string, unknown>> => {
  const { data } = await axios.get(API_BASE_URL + '/flights/status', { params });
  return data;
};

// Payment (Paystack)
export const initPaystackPayment = async (payload: PaystackInitPayload): Promise<Record<string, unknown>> => {
  const { data } = await axios.post(API_BASE_URL + '/payments/paystack/init', payload);
  return data;
};

export const verifyPaystackPayment = async (reference: string): Promise<Record<string, unknown>> => {
  const { data } = await axios.get(API_BASE_URL + `/payments/paystack/verify/${reference}`);
  return data;
};

// AI Chat (OpenAI)
export const chatWithAI = async (messages: AIMessage[]): Promise<string> => {
  const { data } = await axios.post(API_BASE_URL + '/ai/chat', { messages });
  return data.reply;
};

// Date parsing (chrono-node)
export const parseDate = async (text: string): Promise<string | null> => {
  const { data } = await axios.post(API_BASE_URL + '/bookings/parse-date', { text });
  return data.date;
};