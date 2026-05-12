/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Stop {
  id: string;
  name: string;
  nameKannada: string;
  distanceFromSourceKm: number;
  avgTravelTimeMins: number; // Cumulative from source
  lat?: number;
  lng?: number;
}

export interface BusPing {
  id: string;
  stopId: string;
  reporterName: string;
  timestamp: number;
  type: 'ARRIVAL' | 'DEPARTURE' | 'PASSED';
  status: 'ON_TIME' | 'DELAYED' | 'CANCELLED';
  comment?: string;
}

export interface Route {
  id: string;
  name: string;
  source: string;
  destination: string;
  busNumber?: string;
  stops: Stop[];
  estimatedTime?: string;
  departureTime?: string;
  busType?: string;
  isPopular?: boolean;
  category?: 'MORNING' | 'EVENING' | 'GENERAL';
  district?: string;
  taluk?: string;
  keywords?: string[];
}

export interface LiveBusStatus {
  lastPing?: BusPing;
  estimatedArrivals: Record<string, number>; // stopId -> timestamp
}
