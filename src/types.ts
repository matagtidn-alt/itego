export type ServiceType = 'rental_sepeda' | 'ojek_listrik' | 'driver_mobil';

export type PaymentMethod = 'tunai' | 'qris' | 'transfer_bank';

export type BookingStatus = 'menunggu_konfirmasi' | 'terkonfirmasi' | 'dalam_perjalanan' | 'selesai' | 'dibatalkan';

export type PaymentStatus = 'bayar_di_tempat' | 'menunggu_verifikasi' | 'lunas';

export interface Booking {
  id: string; // e.g., ITG-8921
  serviceType: ServiceType;
  customerName: string;
  customerPhone: string;
  customerNote?: string;
  
  // Specific details
  unitCount: number; // For rental sepeda
  rentalDays?: number; // For rental sepeda
  pickupLocation: string;
  dropLocation?: string;
  pickupDate: string;
  pickupTime: string;
  
  // For Driver Mobil
  destinationPackage?: string;
  destinationName?: string;
  passengerCount?: number;
  flightOrBoatInfo?: string;

  // Pricing & Payment
  unitPrice: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  bankChosen?: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  
  createdAt: string;
}

export interface FleetState {
  totalBikes: number; // 10
  availableBikes: number;
  bikePricePerDay: number; // 50000

  electricOjekTotal: number; // 1
  electricOjekStatus: 'ready' | 'busy' | 'off';
  electricOjekPricePerTrip: number; // 20000
  electricOjekDriverName: string;
  electricOjekDriverPhone: string;

  carDriverTotal: number; // 1
  carDriverStatus: 'ready' | 'busy' | 'scheduled';
  carType: string;
  carDriverName: string;
  carDriverPhone: string;
}

export interface TourPackage {
  id: string;
  title: string;
  duration: string;
  price: number;
  description: string;
  highlights: string[];
  imageBadge: string;
}

export type Language = 'id' | 'en';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'fleet' | 'promo' | 'system';
  isRead: boolean;
  timestamp: string;
  linkAction?: string;
}
