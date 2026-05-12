/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Globe, Users, Shield, ArrowRight } from 'lucide-react';
import { BusLogo } from './BusLogo';

interface LoginPageProps {
  onLogin: () => Promise<void>;
}

type Language = 'en' | 'kn';

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [lang, setLang] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await onLogin();
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in cancelled. Please try again.');
      } else {
        setErrorMsg('Login failed. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const content = {
    en: {
      title: 'GRAMA-YATRI',
      subtitle: 'COMMUNITY-POWERED RURAL TRANSIT NETWORK',
      langToggle: 'ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ',
      nameLabel: 'NAME',
      namePlaceholder: 'Your Name',
      phoneLabel: 'PHONE',
      phonePlaceholder: 'Phone Number',
      googleContinue: 'SIGN IN WITH GOOGLE',
      loading: 'CONNECTING...',
      footer: 'NO REGISTRATION REQUIRED • USE GOOGLE TO CONTINUE',
      crowdsourced: {
        title: 'CROWDSOURCED',
        desc: 'Real-time pings from neighbors'
      },
      verified: {
        title: 'VERIFIED DATA',
        desc: 'Authenticated rural community logs'
      }
    },
    kn: {
      title: 'ಗ್ರಾಮ-ಯಾತ್ರಿ',
      subtitle: 'ಸಮುದಾಯ ಆಧಾರಿತ ಗ್ರಾಮೀಣ ಸಾರಿಗೆ ಜಾಲ',
      langToggle: 'Switch to English',
      nameLabel: 'ಹೆಸರು',
      namePlaceholder: 'ನಿಮ್ಮ ಹೆಸರು',
      phoneLabel: 'ಫೋನ್',
      phonePlaceholder: 'ಫೋನ್ ಸಂಖ್ಯೆ',
      googleContinue: 'ಗೂಗಲ್ ಮೂಲಕ ಸೈನ್ ಇನ್ ಮಾಡಿ',
      loading: 'ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ...',
      footer: 'ನೋಂದಣಿ ಅಗತ್ಯವಿಲ್ಲ • ಮುಂದುವರಿಯಲು ಗೂಗಲ್ ಬಳಸಿ',
      crowdsourced: {
        title: 'ಕ್ರೌಡ್‌ಸೋರ್ಸೆಡ್',
        desc: 'ನೆರೆಯವರಿಂದ ನೈಜ-ಸಮಯದ ಪಿಂಗ್‌ಗಳು'
      },
      verified: {
        title: 'ಪರಿಶೀಲಿಸಿದ ಡೇಟಾ',
        desc: 'ದೃಢೀಕೃತ ಗ್ರಾಮೀಣ ಸಮುದಾಯ ದಾಖಲೆಗಳು'
      }
    }
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md flex flex-col items-center z-10"
      >
        {/* Logo Section */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-neutral-900 border border-neutral-800 rounded-[40px] flex items-center justify-center shadow-2xl overflow-hidden">
             <BusLogo size={80} className="text-amber-500" />
          </div>
          <div className="absolute top-0 right-0 -mr-2 -mt-2">
            <div className="bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
              LIVE
            </div>
          </div>
        </div>

        {/* Title Section */}
        <h1 className="text-5xl font-black tracking-tighter text-amber-500 mb-2 italic">
          {t.title}
        </h1>
        <p className="text-neutral-500 text-[10px] sm:text-xs font-bold tracking-[0.4em] text-center mb-8 uppercase px-4 leading-relaxed">
          {t.subtitle}
        </p>

        {/* Info Cards */}
        <div className="w-full space-y-3 mb-10">
          <div className="flex items-center gap-4 p-4 bg-neutral-900/50 border border-neutral-800/50 rounded-2xl">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
              <Users size={20} />
            </div>
            <div>
              <h4 className="text-[10px] font-black tracking-widest text-neutral-300 uppercase">{t.crowdsourced.title}</h4>
              <p className="text-[10px] text-neutral-500">{t.crowdsourced.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-neutral-900/50 border border-neutral-800/50 rounded-2xl">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
              <Shield size={20} />
            </div>
            <div>
              <h4 className="text-[10px] font-black tracking-widest text-neutral-300 uppercase">{t.verified.title}</h4>
              <p className="text-[10px] text-neutral-500">{t.verified.desc}</p>
            </div>
          </div>
        </div>

        {/* Google Login Button */}
        <motion.button
          whileHover={!isLoading ? { scale: 1.01 } : {}}
          whileTap={!isLoading ? { scale: 0.99 } : {}}
          disabled={isLoading}
          onClick={handleGoogleLogin}
          className={`w-full py-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
            isLoading 
              ? 'bg-neutral-800 text-neutral-400 cursor-wait' 
              : 'bg-amber-500 text-black hover:bg-amber-400 shadow-[0_20px_50px_rgba(245,158,11,0.1)]'
          }`}
        >
          {isLoading ? (
            <Globe className="animate-spin" size={18} />
          ) : (
            <LogIn size={18} />
          )}
          {isLoading ? t.loading : t.googleContinue}
        </motion.button>

        {errorMsg && (
          <p className="mt-4 text-red-500 text-[10px] font-bold text-center bg-red-500/10 py-2 px-4 rounded-lg border border-red-500/20">
            {errorMsg}
          </p>
        )}

        {/* Footer */}
        <p className="mt-12 text-[9px] sm:text-[10px] text-neutral-600 font-bold uppercase tracking-[0.3em] text-center">
          {t.footer}
        </p>

        {/* Language Toggle */}
        <button
          onClick={() => setLang(l => l === 'en' ? 'kn' : 'en')}
          className="mt-6 text-[9px] font-black text-neutral-500 hover:text-amber-500 transition-colors uppercase tracking-widest"
        >
          {t.langToggle}
        </button>
      </motion.div>
    </div>
  );
};


