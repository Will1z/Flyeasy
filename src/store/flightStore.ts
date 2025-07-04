import { create } from 'zustand';
import { Flight, SearchParams, Booking, PriceAlert } from '../types';

interface FlightState {
  searchParams: SearchParams | null;
  flights: Flight[];
  selectedFlight: Flight | null;
  bookings: Booking[];
  priceAlerts: PriceAlert[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setSearchParams: (params: SearchParams) => void;
  searchFlights: (params: SearchParams) => Promise<void>;
  setSelectedFlight: (flight: Flight | null) => void;
  createBooking: (bookingData: Partial<Booking>) => Promise<Booking>;
  addPriceAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'lastChecked' | 'notifications'>) => Promise<void>;
  removePriceAlert: (alertId: string) => void;
  checkPriceAlerts: () => Promise<void>;
}

export const useFlightStore = create<FlightState>((set, get) => ({
  searchParams: null,
  flights: [],
  selectedFlight: null,
  bookings: [],
  priceAlerts: [],
  isLoading: false,
  error: null,

  setSearchParams: (params) => {
    set({ searchParams: params });
  },

  searchFlights: async (params) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate Amadeus API call with 3% markup
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const basePrice = Math.floor(Math.random() * 200000) + 50000;
      const originalPrice = basePrice;
      const markedUpPrice = Math.round(basePrice * 1.03); // 3% markup

      const mockFlights: Flight[] = [
        {
          id: '1',
          airline: 'Air Peace',
          flightNumber: 'P47156',
          from: params.from,
          to: params.to,
          departure: '08:30',
          arrival: '10:45',
          duration: '2h 15m',
          price: markedUpPrice,
          originalPrice,
          currency: params.currency,
          stops: 0,
          aircraft: 'Boeing 737-800',
          class: params.class,
          amenities: ['WiFi', 'Meals', 'Entertainment'],
          baggage: {
            cabin: '7kg',
            checked: '20kg'
          },
          cancellationPolicy: 'Free cancellation up to 24 hours',
          availableSeats: 45,
          provider: 'amadeus'
        },
        {
          id: '2',
          airline: 'Arik Air',
          flightNumber: 'W3101',
          from: params.from,
          to: params.to,
          departure: '14:20',
          arrival: '16:35',
          duration: '2h 15m',
          price: Math.round((basePrice + 15000) * 1.03),
          originalPrice: basePrice + 15000,
          currency: params.currency,
          stops: 0,
          aircraft: 'Airbus A320',
          class: params.class,
          amenities: ['WiFi', 'Refreshments'],
          baggage: {
            cabin: '7kg',
            checked: '20kg'
          },
          cancellationPolicy: 'Free cancellation up to 24 hours',
          availableSeats: 32,
          provider: 'amadeus'
        }
      ];

      set({ flights: mockFlights, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to search flights', isLoading: false });
    }
  },

  setSelectedFlight: (flight) => {
    set({ selectedFlight: flight });
  },

  createBooking: async (bookingData) => {
    set({ isLoading: true });
    try {
      // Simulate booking creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const booking: Booking = {
        id: Math.random().toString(36).substr(2, 9),
        userId: bookingData.userId!,
        flight: bookingData.flight!,
        passengers: bookingData.passengers!,
        status: 'confirmed',
        totalAmount: bookingData.totalAmount!,
        currency: bookingData.currency!,
        paymentStatus: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        confirmationCode: 'FG' + Math.random().toString(36).substr(2, 6).toUpperCase()
      };

      set(state => ({ 
        bookings: [...state.bookings, booking], 
        isLoading: false 
      }));

      return booking;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  addPriceAlert: async (alertData) => {
    const alert: PriceAlert = {
      id: Math.random().toString(36).substr(2, 9),
      ...alertData,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastChecked: new Date().toISOString(),
      notifications: 0
    };

    set(state => ({ 
      priceAlerts: [...state.priceAlerts, alert] 
    }));
  },

  removePriceAlert: (alertId) => {
    set(state => ({
      priceAlerts: state.priceAlerts.filter(alert => alert.id !== alertId)
    }));
  },

  checkPriceAlerts: async () => {
    // Simulate price checking logic
    const { priceAlerts } = get();
    
    for (const alert of priceAlerts.filter(a => a.isActive)) {
      // In real implementation, this would check current prices via API
      const currentPrice = Math.floor(Math.random() * 200000) + 50000;
      
      if (currentPrice <= alert.targetPrice) {
        // Trigger notification
        console.log(`Price alert triggered for ${alert.from} to ${alert.to}`);
      }
    }
  }
}));