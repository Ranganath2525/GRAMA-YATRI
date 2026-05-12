/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Route } from './types';

export const ROUTES: Route[] = [
  {
    id: 'ksrtc-sirsi-sagar',
    name: 'Sirsi to Sagar (via Banavasi)',
    source: 'Sirsi',
    destination: 'Sagar',
    stops: [
      { id: 'sirsi', name: 'Sirsi', nameKannada: 'ಶಿರಸಿ', distanceFromSourceKm: 0, avgTravelTimeMins: 0 },
      { id: 'banavasi', name: 'Banavasi', nameKannada: 'ಬನವಾಸಿ', distanceFromSourceKm: 23, avgTravelTimeMins: 40 },
      { id: 'soraba', name: 'Soraba', nameKannada: 'ಸೊರಬ', distanceFromSourceKm: 55, avgTravelTimeMins: 90 },
      { id: 'sagar', name: 'Sagar', nameKannada: 'ಸಾಗರ', distanceFromSourceKm: 85, avgTravelTimeMins: 140 },
    ],
  },
  {
    id: 'ksrtc-sagar-sirsi',
    name: 'Sagar to Sirsi (Return)',
    source: 'Sagar',
    destination: 'Sirsi',
    stops: [
      { id: 'sagar', name: 'Sagar', nameKannada: 'ಸಾಗರ', distanceFromSourceKm: 0, avgTravelTimeMins: 0 },
      { id: 'soraba', name: 'Soraba', nameKannada: 'ಸೊರಬ', distanceFromSourceKm: 30, avgTravelTimeMins: 50 },
      { id: 'banavasi', name: 'Banavasi', nameKannada: 'ಬನವಾಸಿ', distanceFromSourceKm: 62, avgTravelTimeMins: 100 },
      { id: 'sirsi', name: 'Sirsi', nameKannada: 'ಶಿರಸಿ', distanceFromSourceKm: 85, avgTravelTimeMins: 140 },
    ],
  },
  {
    id: 'ksrtc-blr-mys',
    name: 'Bengaluru to Mysuru (Non-Stop)',
    source: 'Bengaluru',
    destination: 'Mysuru',
    stops: [
      { id: 'blr-mbs', name: 'Bengaluru (Majestic)', nameKannada: 'ಬೆಂಗಳೂರು', distanceFromSourceKm: 0, avgTravelTimeMins: 0 },
      { id: 'ramnagara', name: 'Ramanagara', nameKannada: 'ರಾಮನಗರ', distanceFromSourceKm: 50, avgTravelTimeMins: 60 },
      { id: 'mandya', name: 'Mandya', nameKannada: 'ಮಂಡ್ಯ', distanceFromSourceKm: 100, avgTravelTimeMins: 120 },
      { id: 'mys-mbs', name: 'Mysuru Main Terminal', nameKannada: 'ಮೈಸೂರು', distanceFromSourceKm: 145, avgTravelTimeMins: 180 },
    ],
  },
  {
    id: 'ksrtc-hubli-belagavi',
    name: 'Hubballi to Belagavi',
    source: 'Hubballi',
    destination: 'Belagavi',
    stops: [
      { id: 'hubli-cbt', name: 'Hubballi CBT', nameKannada: 'ಹುಬ್ಬಳ್ಳಿ', distanceFromSourceKm: 0, avgTravelTimeMins: 0 },
      { id: 'dharwad', name: 'Dharwad', nameKannada: 'ಧಾರವಾಡ', distanceFromSourceKm: 20, avgTravelTimeMins: 30 },
      { id: 'kittur', name: 'Kittur', nameKannada: 'ಕಿತ್ತೂರು', distanceFromSourceKm: 50, avgTravelTimeMins: 70 },
      { id: 'belagavi', name: 'Belagavi', nameKannada: 'ಬೆಳಗಾವಿ', distanceFromSourceKm: 95, avgTravelTimeMins: 130 },
    ],
  }
];

export const UI_COLORS = {
  ksrtcRed: '#ED1C24',
  ksrtcYellow: '#FFF200',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#f8fafc',
};
