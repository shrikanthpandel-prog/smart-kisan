import api from './api.service';
import { API_ENDPOINTS } from '@/config/api.config';

/**
 * Marketplace Service
 * Handles crop listings and selling
 */

export interface CropListing {
  _id?: string;
  user?: string;
  name: string;
  quantity: number;
  price: number;
  description?: string;
  location: string;
  isSold?: boolean;
  createdAt?: string;
}

/**
 * Get all crops for sale
 */
export async function getAllCrops(): Promise<CropListing[]> {
  const response = await api.get<CropListing[]>(API_ENDPOINTS.CROP.GET_ALL);
  return response.data;
}

/**
 * Add a new crop listing
 */
export async function addCropListing(crop: Omit<CropListing, '_id' | 'user' | 'isSold' | 'createdAt'>): Promise<CropListing> {
  const response = await api.post<CropListing>(API_ENDPOINTS.CROP.ADD, crop);
  return response.data;
}

/**
 * Mark crop as sold
 */
export async function markCropAsSold(cropId: string): Promise<{ message: string }> {
  const response = await api.patch(API_ENDPOINTS.CROP.MARK_SOLD(cropId));
  return response.data;
}

/**
 * Filter crops by location
 */
export function filterCropsByLocation(crops: CropListing[], location: string): CropListing[] {
  if (!location || location === 'all') return crops;
  return crops.filter(crop => crop.location.toLowerCase().includes(location.toLowerCase()));
}
