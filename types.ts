// Enums
export enum Role {
  TATTOOIST = 'TATTOOIST',
  ADMIN = 'ADMIN'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  NEGOTIATING = 'NEGOTIATING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

// Models
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  studioId?: string;
  avatarUrl?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  photoUrls: string[];
  totalSessions: number;
  lastVisit?: Date;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // minutes
  price: number;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string; // Denormalized for UI convenience
  serviceId?: string;
  serviceName: string;
  startAt: Date;
  endAt: Date;
  status: BookingStatus;
  price: number;
  isPaid: boolean;
  requestId?: string; // Link to origin request
}

export interface TattooRequest {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  description: string;
  bodyPart: string;
  size: string; // ex: 15cm
  style: string; // ex: Realismo
  budget: string;
  photoUrls: string[];
  availableDays: string[]; // Text description of days or formatted dates
  createdAt: Date;
  status: RequestStatus;
  adminNotes?: string; // Internal notes or reply history mock
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: Date;
  bookingId?: string;
}

// UI State Types
export type ViewState = 'DASHBOARD' | 'CALENDAR' | 'CLIENTS' | 'FINANCE' | 'SETTINGS' | 'REQUESTS' | 'PUBLIC_FORM';