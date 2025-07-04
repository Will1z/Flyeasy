import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Flight {
  id: string;
  airline: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  stops: number;
  aircraft: string;
  class: string;
}

export interface SearchParams {
  from: string;
  to: string;
  departure: string;
  returnDate?: string;
  passengers: number;
  class: string;
}

export interface Booking {
  id: string;
  flight: Flight;
  passenger: {
    name: string;
    email: string;
    phone: string;
  };
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  paymentId?: string;
}

interface FlightContextType {
  searchParams: SearchParams | null;
  setSearchParams: (params: SearchParams) => void;
  flights: Flight[];
  setFlights: (flights: Flight[]) => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  selectedFlight: Flight | null;
  setSelectedFlight: (flight: Flight | null) => void;
}

const FlightContext = createContext<FlightContextType | undefined>(undefined);

export const useFlightContext = () => {
  const context = useContext(FlightContext);
  if (!context) {
    throw new Error('useFlightContext must be used within a FlightProvider');
  }
  return context;
};

export const FlightProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  return (
    <FlightContext.Provider value={{
      searchParams,
      setSearchParams,
      flights,
      setFlights,
      bookings,
      addBooking,
      selectedFlight,
      setSelectedFlight
    }}>
      {children}
    </FlightContext.Provider>
  );
};