/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stop, BusPing, LiveBusStatus } from '../types';

/**
 * Calculates real-time ETAs for all stops based on the latest community ping.
 */
export function calculateLiveETA(ping: BusPing, stops: Stop[]): LiveBusStatus {
  const currentStop = stops.find(s => s.id === ping.stopId);
  if (!currentStop) return { estimatedArrivals: {} };

  const estimatedArrivals: Record<string, number> = {};
  const currentTime = ping.timestamp;

  stops.forEach(stop => {
    // We only calculate future ETAs
    if (stop.avgTravelTimeMins > currentStop.avgTravelTimeMins) {
      const travelTimeFromCurrent = stop.avgTravelTimeMins - currentStop.avgTravelTimeMins;
      estimatedArrivals[stop.id] = currentTime + (travelTimeFromCurrent * 60 * 1000);
    } else if (stop.id === currentStop.id) {
      estimatedArrivals[stop.id] = currentTime;
    }
  });

  return {
    lastPing: ping,
    estimatedArrivals,
  };
}

/**
 * Formats a timestamp into a readable 12-hour local time string.
 */
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
}

/**
 * Calculates how many minutes away a bus is from a target timestamp.
 */
export function getMinutesAway(targetTimestamp: number): number {
  const diff = targetTimestamp - Date.now();
  return Math.ceil(diff / (60 * 1000));
}
