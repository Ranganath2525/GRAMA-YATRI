/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Stop, BusPing } from '../types';
import { formatTime, getMinutesAway } from '../services/transitService';
import { MapPin, Clock, User, AlertTriangle } from 'lucide-react';
import { BusLogo } from './BusLogo';
import { UI_COLORS } from '../constants';

interface BusTimelineProps {
  stops: Stop[];
  lastPing?: BusPing;
  estimatedArrivals: Record<string, number>;
  onPing: (stopId: string) => void;
  departureTime?: string;
  busType?: string;
}

export const BusTimeline: React.FC<BusTimelineProps> = ({ 
  stops, 
  lastPing, 
  estimatedArrivals,
  onPing,
  departureTime,
  busType
}) => {
  return (
    <div className="space-y-0 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-neutral-800">
      {(departureTime || busType) && (
        <div className="pl-14 pb-6">
          <div className="flex gap-2">
            {departureTime && (
              <div className="bg-neutral-800/50 border border-neutral-700 px-3 py-1.5 rounded-lg">
                <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest leading-none mb-1">Scheduled Dep.</p>
                <div className="flex items-center gap-1.5">
                  <Clock size={10} className="text-amber-500" />
                  <span className="text-xs font-bold text-neutral-200">{departureTime}</span>
                </div>
              </div>
            )}
            {busType && (
              <div className="bg-neutral-800/50 border border-neutral-700 px-3 py-1.5 rounded-lg">
                <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest leading-none mb-1">Service Type</p>
                <div className="flex items-center gap-1.5 text-amber-500">
                  <BusLogo size={14} />
                  <span className="text-xs font-bold text-neutral-200">{busType}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {stops.map((stop, index) => {
        const arrival = estimatedArrivals[stop.id];
        const isLastPingLocation = lastPing?.stopId === stop.id;
        const minsAway = arrival ? getMinutesAway(arrival) : null;
        
        return (
          <motion.div 
            key={stop.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative pl-14 pb-8 group ${!isLastPingLocation && arrival && minsAway! <= 0 ? 'opacity-40' : ''}`}
          >
            {/* Timeline Indicator */}
            <div 
              className={`absolute left-3.5 top-1.5 w-5 h-5 rounded-full border-4 border-neutral-950 z-10 transition-all duration-500 flex items-center justify-center ${
                isLastPingLocation 
                  ? 'bg-red-500 scale-125 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                  : (arrival && minsAway! <= 0) || (index === 0 && !lastPing)
                    ? 'bg-neutral-700' 
                    : 'bg-neutral-900 border-neutral-700 border-2'
              }`}
            >
              {isLastPingLocation && (
                <>
                  <div className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-20 scale-150"></div>
                  <BusLogo size={14} className="relative z-20 text-white" />
                </>
              )}
            </div>

            <div className={`p-5 rounded-2xl border transition-all duration-300 ${
              isLastPingLocation 
                ? 'bg-neutral-900 border-red-500/20 shadow-xl ring-1 ring-red-500/10' 
                : 'bg-transparent border-transparent grayscale-[0.5]'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className={`font-bold text-lg flex items-center gap-2 ${isLastPingLocation ? 'text-red-500' : 'text-neutral-200'}`}>
                    {stop.name}
                    <span className="text-sm font-normal text-neutral-500">{stop.nameKannada}</span>
                  </h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-neutral-500 flex items-center gap-1 uppercase tracking-wider">
                      <MapPin size={12} /> {stop.distanceFromSourceKm} km
                    </span>
                    {arrival && (
                      <span className={`text-xs font-medium flex items-center gap-1 ${
                        minsAway! > 0 ? 'text-amber-500/80' : 'text-neutral-500'
                      }`}>
                        <Clock size={12} /> {formatTime(arrival)}
                      </span>
                    )}
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPing(stop.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${
                    isLastPingLocation
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 border border-neutral-700'
                  }`}
                >
                  {isLastPingLocation ? 'LIVE HERE' : 'PING'}
                </motion.button>
              </div>

              {/* Status Indicator */}
              {arrival && minsAway! > 0 && (
                <div className="mt-3 flex items-center gap-2 bg-amber-500/5 text-amber-500 px-3 py-2 rounded-xl text-xs font-bold border border-amber-500/20">
                  <div className="flex gap-1 mr-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse delay-75"></div>
                  </div>
                  EXPECTED IN {minsAway} MINS
                </div>
              )}

              {isLastPingLocation && (
                <div className="mt-3 flex flex-wrap items-center gap-3 py-2 border-t border-red-500/10">
                  <div className="flex items-center gap-2 px-2 py-1 bg-red-500/10 rounded-lg border border-red-500/20">
                    <User size={10} className="text-red-500" />
                    <span className="text-[10px] text-red-100 font-bold uppercase tracking-widest leading-none">
                      {lastPing.reporterName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                    <Clock size={10} /> {formatTime(lastPing.timestamp)}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
