import { User } from '@prisma/client';

export interface Tour {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  price: number;
  duration: number;
  date: Date;
  maxParticipants: number;
  imageUrl: string;
  creatorId: string;
  creator: User;
  bookings?: any[]; // We can define a Booking type later if needed
  reviews?: any[]; // We can define a Review type later if needed
}

export interface TourUpdateInput {
  title?: string;
  description?: string;
  price?: number;
  duration?: number | string;
  date?: Date | string;
  maxParticipants?: number | string;
  imageUrl?: string;
} 