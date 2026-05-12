/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BusLogoProps {
  size?: number;
  className?: string;
}

export const BusLogo: React.FC<BusLogoProps> = ({ size = 24, className = "" }) => (
  <span 
    style={{ width: size, height: size }}
    className={`inline-flex items-center justify-center shrink-0 ${className}`}
  >
    <svg 
      viewBox="0 0 24 24" 
      className="w-full h-full fill-current"
    >
      <path d="M21.6 11.2l-3.3-6.5c-.4-.7-1-1.2-1.8-1.5-.7-.2-1.5-.2-2.3 0l-10 2.5c-.8.2-1.5.7-1.9 1.4-.4.7-.6 1.6-.4 2.4l1.5 6c0 .3.1.5.3.7.2.2.4.3.7.3h1c.6 0 1-.4 1-1v-1h8v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-1l1.5-1.5c.3-.3.5-.7.6-1.2l.1-1.2zM6 10.5l-1.1-4.4c.1-.4.4-.7.8-.8l10-2.5c.4-.1.8 0 1.1.2.3.2.5.5.7.8l2.2 4.4H6v2.3zM8 16c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm10 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/>
    </svg>
  </span>
);
