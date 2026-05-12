/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Route } from '../types';

export const MOCK_ROUTES: Route[] = [
  // Page 1 Extractions
  {
    id: 'ksrtc-1-afzalpur',
    name: 'Bengaluru to Afzalpur (via Ballari)',
    source: 'BENGALURU',
    destination: 'AFZALPUR',
    departureTime: '19:20',
    busType: 'EXPRESS',
    estimatedTime: '12h 00m',
    stops: [
      { id: 'blr', name: 'Bengaluru', nameKannada: 'ಬೆಂಗಳೂರು', distanceFromSourceKm: 0, avgTravelTimeMins: 0 },
      { id: 'ballari', name: 'Ballari', nameKannada: 'ಬಳ್ಳಾರಿ', distanceFromSourceKm: 310, avgTravelTimeMins: 420 },
      { id: 'sindhanur', name: 'Sindhanur', nameKannada: 'ಸಿಂಧನೂರು', distanceFromSourceKm: 400, avgTravelTimeMins: 540 },
      { id: 'afzalpur', name: 'Afzalpur', nameKannada: 'ಅಫ್ಜಲ್ಪುರ', distanceFromSourceKm: 620, avgTravelTimeMins: 720 },
    ],
    keywords: ['bengaluru', 'ballari', 'sindhanur', 'afzalpur', 'north karnataka']
  },
  {
    id: 'ksrtc-20-arsikere',
    name: 'Bengaluru to Arsikere (via Tiptur)',
    source: 'BENGALURU',
    destination: 'ARASIKERE',
    departureTime: '11:30',
    busType: 'EXPRESS',
    district: 'Hassan',
    taluk: 'Arasikere',
    stops: [
      { id: 'blr', name: 'Bengaluru', nameKannada: 'ಬೆಂಗಳೂರು', distanceFromSourceKm: 0, avgTravelTimeMins: 0 },
      { id: 'tumakuru', name: 'Tumakuru', nameKannada: 'ತುಮಕೂರು', distanceFromSourceKm: 70, avgTravelTimeMins: 90 },
      { id: 'tiptur', name: 'Tiptur', nameKannada: 'ತಿಪಟೂರು', distanceFromSourceKm: 145, avgTravelTimeMins: 180 },
      { id: 'arasikere', name: 'Arasikere', nameKannada: 'ಅರಸೀಕೆರೆ', distanceFromSourceKm: 175, avgTravelTimeMins: 220 },
    ],
    keywords: ['arsikere', 'tiptur', 'tumakuru', 'hassan', 'karnataka']
  },
  // Region specific high-priority routes requested
  {
    id: 'ksrtc-298-ckm',
    name: 'Bengaluru to Chikkamagaluru (via Arsikere, Kadur)',
    source: 'BENGALURU',
    destination: 'CHIKKAMAGALURU',
    departureTime: '14:45',
    busType: 'EXPRESS',
    district: 'Chikkamagaluru',
    taluk: 'Chikkamagaluru',
    stops: [
      { id: 'blr', name: 'Bengaluru', nameKannada: 'ಬೆಂಗಳೂರು', distanceFromSourceKm: 0, avgTravelTimeMins: 0 },
      { id: 'tumakuru', name: 'Tumakuru', nameKannada: 'ತುಮಕೂರು', distanceFromSourceKm: 70, avgTravelTimeMins: 90 },
      { id: 'arasikere', name: 'Arasikere', nameKannada: 'ಅರಸೀಕೆರೆ', distanceFromSourceKm: 175, avgTravelTimeMins: 220 },
      { id: 'kadur', name: 'Kadur', nameKannada: 'ಕಡೂರು', distanceFromSourceKm: 210, avgTravelTimeMins: 260 },
      { id: 'ckm', name: 'Chikkamagaluru', nameKannada: 'ಚಿಕ್ಕಮಗಳೂರು', distanceFromSourceKm: 250, avgTravelTimeMins: 320 },
    ],
    keywords: ['chikkamagaluru', 'arsikere', 'kadur', 'coffee region']
  },
  {
    id: 'ksrtc-308-ckm',
    name: 'Bengaluru to Chikkamagaluru (via Belur)',
    source: 'BENGALURU',
    destination: 'CHIKKAMAGALURU',
    departureTime: '18:45',
    busType: 'EXPRESS',
    district: 'Chikkamagaluru',
    stops: [
      { id: 'blr', name: 'Bengaluru', nameKannada: 'ಬೆಂಗಳೂರು', distanceFromSourceKm: 0, avgTravelTimeMins: 0 },
      { id: 'hassan', name: 'Hassan', nameKannada: 'ಹಾಸನ', distanceFromSourceKm: 185, avgTravelTimeMins: 240 },
      { id: 'belur', name: 'Belur', nameKannada: 'ಬೇಲೂರು', distanceFromSourceKm: 225, avgTravelTimeMins: 300 },
      { id: 'ckm', name: 'Chikkamagaluru', nameKannada: 'ಚಿಕ್ಕಮಗಳೂರು', distanceFromSourceKm: 250, avgTravelTimeMins: 340 },
    ],
    keywords: ['hassan', 'belur', 'chikkamagaluru', 'temple city']
  },
  {
    id: 'ksrtc-720-hassan',
    name: 'Bengaluru to Hassan (via Kunigal)',
    source: 'BENGALURU',
    destination: 'HASSAN',
    departureTime: '04:30',
    busType: 'EXPRESS',
    district: 'Hassan',
    stops: [
      { id: 'blr', name: 'Bengaluru', nameKannada: 'ಬೆಂಗಳೂರು', distanceFromSourceKm: 0, avgTravelTimeMins: 0 },
      { id: 'kunigal', name: 'Kunigal', nameKannada: 'ಕುಣಿಗಲ್', distanceFromSourceKm: 70, avgTravelTimeMins: 80 },
      { id: 'yediyur', name: 'Yediyur', nameKannada: 'ಯಡಿಯೂರು', distanceFromSourceKm: 95, avgTravelTimeMins: 110 },
      { id: 'hassan', name: 'Hassan', nameKannada: 'ಹಾಸನ', distanceFromSourceKm: 185, avgTravelTimeMins: 220 },
    ],
    keywords: ['hassan', 'kunigal', 'yediyur', 'rapid express']
  },
  // Adding Tiptur, Kadur, Birur local connections
  {
    id: 'ksrtc-local-kad-bir',
    name: 'Kadur to Birur Local',
    source: 'KADUR',
    destination: 'BIRUR',
    departureTime: '08:00',
    busType: 'LOCAL',
    district: 'Chikkamagaluru',
    stops: [
      { id: 'kadur', name: 'Kadur', nameKannada: 'ಕಡೂರು', distanceFromSourceKm: 0, avgTravelTimeMins: 0 },
      { id: 'birur', name: 'Birur', nameKannada: 'ಬೀರೂರು', distanceFromSourceKm: 7, avgTravelTimeMins: 15 },
    ],
    keywords: ['kadur', 'birur', 'local']
  },
  ...Array.from({ length: 150 }).map((_, i) => {
    const froms = ['ARSIKERE', 'KADUR', 'BIRUR', 'TIPTUR', 'HASSAN', 'TARIKERE', 'SHIVAMOGGA', 'TUMAKURU'];
    const tos = ['BENGALURU', 'MYSURU', 'DAVANAGERE', 'HUBBALLI', 'MANGALURU'];
    const base = froms[i % froms.length];
    const target = tos[i % tos.length];
    const hour = Math.floor(Math.random() * 24).toString().padStart(2, '0');
    const min = (Math.floor(Math.random() * 4) * 15).toString().padStart(2, '0');
    
    return {
      id: `ksrtc-gen-${2000 + i}`,
      name: `${base} to ${target} (${i % 2 === 0 ? 'Express' : 'Sarige'}) #${100 + i}`,
      source: base,
      destination: target,
      departureTime: `${hour}.${min}`,
      busType: i % 3 === 0 ? 'RAJAHAMSA' : 'EXPRESS',
      stops: [
        { id: `s-${i}`, name: base, nameKannada: base, distanceFromSourceKm: 0, avgTravelTimeMins: 0 },
        { id: `v-${i}`, name: 'Village Cross', nameKannada: 'ಗ್ರಾಮ ಕ್ರಾಸ್', distanceFromSourceKm: 30, avgTravelTimeMins: 50 },
        { id: `d-${i}`, name: target, nameKannada: target, distanceFromSourceKm: 150 + (i * 2), avgTravelTimeMins: 200 + (i * 3) }
      ],
      keywords: [base.toLowerCase(), target.toLowerCase(), 'ksrtc', 'grama']
    };
  })
];
