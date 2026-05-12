/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BusTimeline } from './components/BusTimeline';
import { ROUTES, UI_COLORS } from './constants';
import { MOCK_ROUTES } from './data/mockRoutes';
import { BusPing, LiveBusStatus, Route } from './types';
import { calculateLiveETA } from './services/transitService';
import { Info, Shield, Users, RefreshCcw, Bell, MapPin, AlertTriangle, LogIn, LogOut, User as UserIcon, ChevronDown, Route as RouteIcon, Search, Clock } from 'lucide-react';
import { db, auth, googleProvider, signInWithPopup, signOut, signInAnonymously, updateProfile } from './lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, where, doc, writeBatch } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { handleFirestoreError, OperationType } from './lib/firestoreUtils';
import { LoginPage } from './components/LoginPage';
import { BusLogo } from './components/BusLogo';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [localGuest, setLocalGuest] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userPingsCount, setUserPingsCount] = useState(0);
  const [routes, setRoutes] = useState<Route[]>(MOCK_ROUTES);
  const [currentRoute, setCurrentRoute] = useState<Route>(MOCK_ROUTES[0]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'POPULAR' | 'MORNING' | 'EVENING' | 'NEARBY'>('ALL');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [status, setStatus] = useState<LiveBusStatus>({
    estimatedArrivals: {},
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showRouteSelector, setShowRouteSelector] = useState(false);
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filteredRoutes = routes.filter(route => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      if (filter === 'POPULAR') return route.isPopular;
      if (filter === 'MORNING') return route.category === 'MORNING';
      if (filter === 'EVENING') return route.category === 'EVENING';
      if (filter === 'NEARBY') {
        if (!userLocation) return false;
        return (route.stops || []).some(stop => 
          stop.lat && stop.lng && calculateDistance(userLocation.lat, userLocation.lng, stop.lat, stop.lng) < 100
        );
      }
      return true;
    }

    // When searching, we bypass filters to find exact town/route matches
    const matchesSearch = 
      (route.name || '').toLowerCase().includes(query) ||
      (route.source || '').toLowerCase().includes(query) ||
      (route.destination || '').toLowerCase().includes(query) ||
      (route.busNumber || '').toLowerCase().includes(query) ||
      (route.busType || '').toLowerCase().includes(query) ||
      (route.departureTime || '').includes(query) ||
      (route.district || '').toLowerCase().includes(query) ||
      (route.taluk || '').toLowerCase().includes(query) ||
      (route.keywords || []).some(k => (k || '').toLowerCase().includes(query)) ||
      (route.stops || []).some(stop => 
        (stop.name || '').toLowerCase().includes(query) || 
        (stop.nameKannada || '').includes(query)
      );
    
    return matchesSearch;
  });

  // Fetch User Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error("Location error:", error),
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 }
      );
    }
  }, []);

  // Load Routes from Firestore
  useEffect(() => {
    let isMounted = true;
    const routesRef = collection(db, 'routes');
    
    // Set initial routes from mock data immediately
    setRoutes(MOCK_ROUTES);
    setIsLoadingRoutes(true);

    const unsubscribe = onSnapshot(routesRef, (snapshot) => {
      if (!isMounted) return;
      
      if (!snapshot.empty) {
        const firestoreRoutes = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Route));
        
        // Merge with MOCK_ROUTES to ensure latest coverage is always available
        const allRoutesMap = new Map();
        
        // Load mock routes first
        MOCK_ROUTES.forEach(r => {
          if (r.id) allRoutesMap.set(r.id.toLowerCase(), r);
        });
        
        // Overwrite with firestore data if available
        firestoreRoutes.forEach(r => {
          if (r.id) allRoutesMap.set(r.id.toLowerCase(), r);
        });
        
        const mergedRoutes = Array.from(allRoutesMap.values());
        setRoutes(mergedRoutes);
        
        // If current route is not in the new list, or if it was the default first one
        if (mergedRoutes.length > 0 && !mergedRoutes.find(r => r.id === currentRoute.id)) {
           // Only reset if current route is not found
           const existing = mergedRoutes.find(r => r.id === currentRoute.id);
           if (!existing) {
             setCurrentRoute(mergedRoutes[0]);
           }
        }
      } else {
        setRoutes(MOCK_ROUTES);
        
        // Automatically sync to Firestore if empty, ensuring dynamic loading requirement
        // Only attempt sync if we have a real user (not necessarily admin, but authenticated)
        if (auth.currentUser) {
          const syncData = async () => {
            const batch = writeBatch(db);
            let operationCount = 0;
            
            for (const route of MOCK_ROUTES) {
              const routeRef = doc(db, 'routes', route.id);
              batch.set(routeRef, route);
              operationCount++;
              if (operationCount >= 400) break; 
            }
            
            try {
              if (operationCount > 0) await batch.commit();
            } catch (e) {
              console.warn("Auto-sync error (likely permission related, which is fine):", e);
            }
          };
          syncData();
        }
      }
      setIsLoadingRoutes(false);
    }, (error) => {
      // If we fail to read firestore, we still have MOCK_ROUTES in state
      console.warn("Firestore routes read failed, using mock data fallback:", error);
      setIsLoadingRoutes(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [user]); 

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen for real-time pings from Firestore
  useEffect(() => {
    if (!user) return;

    const pingsRef = collection(db, 'pings');
    const q = query(
      pingsRef, 
      where('routeId', '==', currentRoute.id),
      orderBy('timestamp', 'desc'), 
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pingDoc = snapshot.docs[0];
      if (pingDoc) {
        const pingData = pingDoc.data() as BusPing;
        const updatedStatus = calculateLiveETA(pingData, currentRoute.stops);
        setStatus(updatedStatus);
      } else {
        setStatus({ estimatedArrivals: {} });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'pings');
    });

    return () => unsubscribe();
  }, [user, currentRoute]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.warn("Sign-in popup was closed before completion.");
      } else if (error.code === 'auth/cancelled-by-user') {
        console.warn("Sign-in cancelled by user.");
      } else {
        console.error("Login failed:", error);
      }
      throw error; 
    }
  };

  const handleGuestLogin = async (name: string, phone: string) => {
    try {
      const cred = await signInAnonymously(auth);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name });
      }
    } catch (error: any) {
      console.warn("Firebase Anonymous Auth failed or disabled, falling back to local guest mode:", error.message);
      // Fallback: Set a local guest object so the UI can proceed
      setLocalGuest({
        displayName: name,
        uid: 'guest-' + Date.now(),
        isGuest: true,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        phone: phone
      });
    }
  };

  const activeUser = user || localGuest;

  const handleLogout = async () => {
    try {
      if (user) {
        await signOut(auth);
      }
      setLocalGuest(null);
      setShowProfile(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handlePing = async (stopId: string) => {
    if (!activeUser) {
      handleLogin();
      return;
    }

    setIsRefreshing(true);
    const path = 'pings';
    try {
      const newPingData = {
        routeId: currentRoute.id,
        stopId,
        reporterName: activeUser.displayName || 'Anonymous passenger',
        timestamp: Date.now(),
        type: 'PASSED',
        status: 'ON_TIME',
      };

      await addDoc(collection(db, path), newPingData);
      setUserPingsCount(prev => prev + 1);
    } catch (error: any) {
      if (error.message?.includes('insufficient permissions') && localGuest) {
        console.error("Guest cannot ping without Firebase Auth enabled.");
        // Optional: show a toast that pings are read-only for guests
      } else {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center">
        <BusLogo size={64} className="text-amber-500 animate-pulse mb-4" />
        <div className="mt-4 w-24 h-1 bg-neutral-900 rounded-full overflow-hidden">
          <div className="w-1/2 h-full bg-amber-500 animate-[loading_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>
    );
  }

  if (!activeUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans p-6 overflow-x-hidden pb-24 md:pb-6">
      <AnimatePresence>
        {!isOnline && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-4 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest">
                <AlertTriangle size={12} />
                Offline Mode
              </div>
              <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">
                Most features preserved via cache
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <header className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-6 relative">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-amber-500 flex items-center gap-2">
            GRAMA-YATRI
            <BusLogo size={32} />
          </h1>
          <p className="text-neutral-400 text-xs uppercase tracking-[0.2em] font-bold mt-1">
            Real-time Rural Transit Network
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:block relative">
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRouteSelector(!showRouteSelector)}
              className="bg-neutral-900 px-6 py-3 rounded-2xl border border-neutral-800 shadow-xl flex items-center gap-4 hover:bg-neutral-800 transition-colors"
            >
              <div>
                <span className="text-[10px] block text-neutral-500 font-black uppercase tracking-widest mb-1 text-left">ACTIVE ROUTE</span>
                <div className="flex items-center gap-3">
                  <BusLogo size={24} className="text-amber-500 shrink-0" />
                  <span className="font-mono font-bold text-lg text-neutral-200">#{currentRoute.id.toUpperCase()}</span>
                </div>
              </div>
              <ChevronDown className={`text-neutral-500 transition-transform ${showRouteSelector ? 'rotate-180' : ''}`} size={20} />
            </motion.button>

            <AnimatePresence>
              {showRouteSelector && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-3 right-0 w-96 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl z-[110] p-4 font-sans"
                >
                  <div className="mb-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
                    <input 
                      type="text"
                      placeholder="Search village, bus #, or destination..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-2.5 pl-9 pr-4 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-1 mb-4 overflow-x-auto pb-1 no-scrollbar">
                    {(['ALL', 'POPULAR', 'MORNING', 'EVENING', 'NEARBY'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                          filter === cat 
                            ? 'bg-amber-500 text-neutral-950 border-amber-500' 
                            : 'bg-neutral-800 text-neutral-500 border-neutral-700 hover:border-neutral-600'
                        }`}
                      >
                        {cat === 'NEARBY' && !userLocation ? 'NEARBY (LOCATING...)' : cat}
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-3 px-2 flex justify-between items-center">
                    <span>Select Network Route</span>
                    {isLoadingRoutes ? (
                      <span className="text-amber-500/50 animate-pulse uppercase">Syncing...</span>
                    ) : (
                      <span className="text-amber-500/50">{filteredRoutes.length} Matches</span>
                    )}
                  </p>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                    {filteredRoutes.length > 0 ? (
                      filteredRoutes.map(route => (
                        <div key={route.id} className="relative">
                          <button
                            onClick={() => {
                              if (expandedRouteId === route.id) {
                                setExpandedRouteId(null);
                              } else {
                                setExpandedRouteId(route.id);
                              }
                            }}
                            className={`w-full text-left p-4 rounded-2xl transition-all border group ${
                              currentRoute.id === route.id 
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                                : 'bg-neutral-800/30 border-transparent text-neutral-400 hover:bg-neutral-800'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-xs font-black uppercase tracking-tighter flex items-center gap-2 flex-1 line-clamp-2">
                                <RouteIcon size={14} className="shrink-0" /> {route.name}
                              </p>
                              <div className="flex gap-2 items-center">
                                {route.isPopular && (
                                  <span className="text-[8px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-amber-500/20">POPULAR</span>
                                )}
                                {status.lastPing && route.id === currentRoute.id && (
                                  <motion.span 
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-[8px] bg-green-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-green-400"
                                  >
                                    LIVE NOW
                                  </motion.span>
                                )}
                                <ChevronDown size={14} className={`transition-transform ${expandedRouteId === route.id ? 'rotate-180' : ''}`} />
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 opacity-60">
                               <div className="text-[10px] flex items-center gap-1">
                                 <Clock size={10} />
                                 {route.departureTime || '--:--'}
                               </div>
                               <div className="text-[10px] flex items-center gap-1 text-amber-500/80">
                                 <BusLogo size={14} />
                                 {route.busType || 'KSRTC'}
                               </div>
                               <div className="text-[10px] bg-neutral-950/30 px-2 py-0.5 rounded uppercase font-black tracking-widest text-neutral-400 group-hover:text-amber-500/80 transition-colors">
                                 {route.source} → {route.destination}
                               </div>
                            </div>
                          </button>

                          <AnimatePresence>
                            {expandedRouteId === route.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-neutral-800/20 rounded-b-2xl -mt-2 border-x border-b border-neutral-800/30"
                              >
                                <div className="p-4 pt-6 space-y-3">
                                  <div className="flex justify-between items-center px-2">
                                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Intermediate Stops</span>
                                    <button 
                                      onClick={() => {
                                        setCurrentRoute(route);
                                        setShowRouteSelector(false);
                                        setExpandedRouteId(null);
                                        setSearchQuery('');
                                      }}
                                      className="text-[10px] bg-amber-500 text-neutral-950 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest"
                                    >
                                      TRACK LIVE
                                    </button>
                                  </div>
                                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar px-2">
                                    {route.stops.map(stop => (
                                      <div key={stop.id} className="flex items-center gap-3 py-1 border-b border-neutral-800/30 last:border-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                                        <div className="flex-1">
                                          <p className="text-[11px] font-bold text-neutral-300">{stop.name}</p>
                                          <p className="text-[9px] text-neutral-500">{stop.nameKannada}</p>
                                        </div>
                                        <span className="text-[9px] text-neutral-600">{stop.distanceFromSourceKm} km</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-neutral-600 text-center py-8 bg-neutral-800/30 rounded-2xl border border-dashed border-neutral-800">No routes found for "{searchQuery}"</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            {activeUser && (
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-3 bg-neutral-900 p-1.5 pr-4 rounded-full border border-neutral-800 hover:bg-neutral-800 transition-all"
                >
                  <img 
                    src={activeUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeUser.uid}`} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full border border-amber-500/30"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-black uppercase tracking-widest text-neutral-300 hidden sm:block">
                    {activeUser.displayName?.split(' ')[0]}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {showProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl z-[100] p-4"
                    >
                      <div className="flex flex-col items-center text-center pb-4 border-b border-neutral-800 mb-4">
                        <img 
                          src={activeUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeUser.uid}`} 
                          alt="Large Profile" 
                          className="w-16 h-16 rounded-full border-2 border-amber-500 mb-2"
                          referrerPolicy="no-referrer"
                        />
                        <h4 className="font-bold text-neutral-100">{activeUser.displayName}</h4>
                        {activeUser.isGuest ? (
                          <span className="text-[8px] bg-neutral-800 text-neutral-500 px-2 py-0.5 rounded-full mt-1 border border-neutral-700">GUEST MODE</span>
                        ) : (
                          <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-black">{activeUser.email}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="p-3 bg-neutral-800/50 rounded-xl border border-neutral-700/30 flex justify-between items-center">
                          <div>
                            <p className="text-[9px] text-neutral-500 uppercase font-black tracking-widest mb-1">Session Reports</p>
                            <p className="text-lg font-black text-amber-500">{userPingsCount}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] text-neutral-500 uppercase font-black tracking-widest mb-1">Impact Score</p>
                            <p className="text-lg font-black text-amber-500">{userPingsCount * 50} <span className="text-[10px] text-neutral-400 font-normal ml-1">XP</span></p>
                          </div>
                        </div>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500/20 transition-all"
                        >
                          <LogOut size={14} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <motion.button 
              whileTap={{ rotate: 180 }}
              onClick={() => window.location.reload()}
              className="p-3 bg-neutral-900 text-amber-500 rounded-full border border-neutral-800 hover:bg-neutral-800 transition-colors"
            >
              <RefreshCcw size={20} className={isRefreshing ? 'animate-spin' : ''} />
            </motion.button>
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 overflow-hidden max-w-7xl mx-auto w-full">
        {/* Left Column: Route Timeline */}
        <section className="md:col-span-5 bg-neutral-900/40 rounded-3xl border border-neutral-800 p-8 flex flex-col shadow-2xl">
          <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-tight">
            <MapPin className="text-amber-500" size={24} />
            Live Route View
          </h2>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <BusTimeline 
              stops={currentRoute.stops}
              lastPing={status.lastPing}
              estimatedArrivals={status.estimatedArrivals}
              onPing={handlePing}
              departureTime={currentRoute.departureTime}
              busType={currentRoute.busType}
            />
          </div>
        </section>

        {/* Right Column: Controls & Feed */}
        <section className="md:col-span-7 flex flex-col gap-8">
          {/* Mobile Route Selector */}
          <div className="lg:hidden">
            <button 
              onClick={() => setShowRouteSelector(!showRouteSelector)}
              className="w-full bg-neutral-900 p-4 rounded-2xl border border-neutral-800 flex justify-between items-center"
            >
              <div className="text-left">
                <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">Current Route</p>
                <div className="text-sm font-bold text-amber-500 flex items-center gap-2">
                  <BusLogo size={16} />
                  {currentRoute.name}
                </div>
              </div>
              <ChevronDown size={20} className={showRouteSelector ? 'rotate-180' : ''} />
            </button>
            <AnimatePresence>
              {showRouteSelector && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="py-4 space-y-2">
                    <div className="mb-4 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
                      <input 
                        type="text"
                        placeholder="Search routes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50"
                      />
                    </div>

                    {filteredRoutes.length > 0 ? (
                      filteredRoutes.map(route => (
                        <button
                          key={route.id}
                          onClick={() => {
                            setCurrentRoute(route);
                            setShowRouteSelector(false);
                            setSearchQuery('');
                          }}
                          className={`w-full text-left p-4 rounded-xl border transition-all ${
                            currentRoute.id === route.id 
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                          }`}
                        >
                          <p className="text-xs font-black uppercase tracking-widest">{route.name}</p>
                        </button>
                      ))
                    ) : (
                      <p className="text-[10px] text-neutral-600 text-center py-4">No routes match your search</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Community Stats */}
          <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-8 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-tight">Crowd Status</h2>
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-400 bg-green-400/5 px-4 py-1.5 rounded-full border border-green-400/20">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Community Active
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-neutral-800/50 p-5 rounded-2xl border border-neutral-700/50">
                <p className="text-neutral-500 text-[10px] uppercase font-black tracking-widest mb-2">Last Verified Report</p>
                {status.lastPing ? (
                  <>
                    <p className="font-bold text-neutral-200">{status.lastPing.reporterName} <span className="text-neutral-500 font-normal ml-2">@ {currentRoute.stops.find(s => s.id === status.lastPing?.stopId)?.name}</span></p>
                    <p className="text-[10px] text-amber-500 font-black tracking-wider mt-2 uppercase">Verified via community ping</p>
                  </>
                ) : (
                  <p className="text-neutral-500 italic text-sm">No recent reports</p>
                )}
              </div>
          <div className="bg-neutral-800/50 p-5 rounded-2xl border border-neutral-700/50">
                <p className="text-neutral-500 text-[10px] uppercase font-black tracking-widest mb-2">Live Timeline Status</p>
                <div className="flex items-end gap-2">
                  <span className={`text-2xl font-black leading-none ${status.lastPing ? 'text-green-500' : 'text-neutral-500'}`}>
                    {status.lastPing ? 'ACTIVE' : 'IDLE'}
                  </span>
                  <span className="text-xs text-neutral-500 pb-0.5">
                    {status.lastPing ? 'Updated by community' : 'Waiting for pings'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Actions */}
          <div className="flex-1 bg-amber-500 rounded-3xl p-10 flex flex-col justify-center items-center text-neutral-950 text-center shadow-[0_0_50px_rgba(245,158,11,0.15)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter italic">Live Timetable</h3>
            <p className="mb-8 font-bold text-neutral-900/80 max-w-xs">Pinging a stop updates the arrival times for all villages ahead on this route.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md relative z-10">
              <button 
                onClick={() => handlePing(currentRoute.stops[0].id)}
                className="flex-1 bg-neutral-950 text-white p-6 rounded-2xl font-black uppercase tracking-widest text-[10px] flex flex-col items-center gap-3 active:scale-95 transition-all shadow-2xl hover:bg-neutral-900 border border-white/5"
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-neutral-950">
                  <BusLogo size={24} />
                </div>
                Bus at Start
              </button>
              <button 
                onClick={() => {
                  if (status.lastPing) {
                    const lastStopIndex = currentRoute.stops.findIndex(s => s.id === status.lastPing?.stopId);
                    const nextStop = currentRoute.stops[lastStopIndex + 1];
                    if (nextStop) {
                      handlePing(nextStop.id);
                      return;
                    }
                  }
                  // Fallback to first intermediate stop if nothing else
                  handlePing(currentRoute.stops[Math.min(1, currentRoute.stops.length - 1)].id);
                }}
                className="flex-1 bg-neutral-900 text-white p-6 rounded-2xl font-black uppercase tracking-widest text-[10px] flex flex-col items-center gap-3 active:scale-95 transition-all shadow-2xl hover:bg-neutral-800 border border-neutral-700"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-amber-500 border border-neutral-700">
                  <MapPin size={20} />
                </div>
                Ping Next Stop
              </button>
            </div>
          </div>

          {/* Service Alert */}
          <AnimatePresence>
            {!status.lastPing && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/5 border border-red-500/30 p-5 rounded-2xl flex items-center gap-6 shadow-xl"
              >
                <div className="bg-red-500 p-3 rounded-xl shadow-lg shadow-red-500/20">
                  <AlertTriangle className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-red-400 font-black uppercase text-[10px] tracking-[0.2em] mb-1">Service Notice</p>
                  <p className="text-sm text-neutral-300 font-medium leading-relaxed">No data reported yet for {currentRoute.name}. The community relies on your pings to keep the timetable alive.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Bottom Bar Info */}
      <footer className="mt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-neutral-600 gap-4 max-w-7xl mx-auto w-full border-t border-neutral-900 pt-6">
        <div className="flex gap-6 font-mono font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1"><Users size={12} /> Live Tracking: #{currentRoute.id.toUpperCase()}</span>
          <span className="flex items-center gap-1 opacity-50">Last Sync: {new Date().toLocaleTimeString()}</span>
        </div>
        <p className="uppercase tracking-[0.3em] font-black text-neutral-500 text-center">
          Powered by Rural Community Data Exchange
        </p>
      </footer>
    </div>
  );
}
