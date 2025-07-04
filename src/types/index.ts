export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  passportNumber?: string;
  preferredCurrency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    priceAlerts: boolean;
  };
  createdAt: string;
  lastLogin?: string;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  originalPrice: number;
  currency: string;
  stops: number;
  aircraft: string;
  class: 'economy' | 'premium' | 'business' | 'first';
  amenities: string[];
  baggage: {
    cabin: string;
    checked: string;
  };
  cancellationPolicy: string;
  availableSeats: number;
  provider: 'amadeus' | 'sabre' | 'travelport';
}

export interface SearchParams {
  from: string;
  to: string;
  departure: string;
  returnDate?: string;
  passengers: number;
  class: 'economy' | 'premium' | 'business' | 'first';
  currency: string;
  directOnly?: boolean;
  maxStops?: number;
  preferredAirlines?: string[];
}

export interface Booking {
  id: string;
  userId: string;
  flight: Flight;
  passengers: Passenger[];
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  currency: string;
  paymentId?: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
  confirmationCode: string;
  receipt?: Receipt;
}

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  passportNumber: string;
  nationality: string;
  seatNumber?: string;
  specialRequests?: string[];
}

export interface PriceAlert {
  id: string;
  userId: string;
  from: string;
  to: string;
  targetPrice: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  lastChecked: string;
  notifications: number;
}

export interface Receipt {
  id: string;
  bookingId: string;
  issueDate: string;
  items: ReceiptItem[];
  subtotal: number;
  taxes: number;
  fees: number;
  total: number;
  currency: string;
}

export interface ReceiptItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'price_alert' | 'booking_confirmation' | 'flight_update' | 'promotion';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export interface Analytics {
  totalBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  topRoutes: RouteStats[];
  monthlyStats: MonthlyStats[];
  userGrowth: UserGrowthStats[];
}

export interface RouteStats {
  route: string;
  bookings: number;
  revenue: number;
}

export interface MonthlyStats {
  month: string;
  bookings: number;
  revenue: number;
  users: number;
}

export interface UserGrowthStats {
  date: string;
  newUsers: number;
  totalUsers: number;
}