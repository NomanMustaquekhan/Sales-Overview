import { useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

// Provided paths from prototype
const HIGHWAY_ROUTES = {
  maharashtra: [{ path: 'M 460 360 L 450 365 L 440 370 L 425 375 L 410 378', highway: 'NH-753T', color: '#ef4444' }],
  madhyaPradesh: [{ path: 'M 460 360 L 448 340 L 432 318 L 416 294 L 400 280', highway: 'NH-44', color: '#8b5cf6' }],
  gujarat: [{ path: 'M 460 360 L 430 350 L 400 342 L 370 338 L 340 334 L 310 330 L 280 326', highway: 'NH-48', color: '#10b981' }],
  chhattisgarh: [{ path: 'M 460 360 L 476 348 L 490 332 L 500 320', highway: 'NH-130A', color: '#ec4899' }],
  rajasthan: [{ path: 'M 460 360 L 440 330 L 420 300 L 390 255 L 360 220 L 335 212 L 300 212', highway: 'NH-48', color: '#14b8a6' }],
  telangana: [{ path: 'M 460 360 L 456 380 L 452 400 L 448 420 L 444 440', highway: 'NH-44', color: '#f97316' }],
  tamilNadu: [{ path: 'M 460 360 L 456 390 L 452 420 L 448 450 L 444 480 L 442 510 L 440 540', highway: 'NH-16', color: '#6366f1' }]
};

const STATE_COORDS: Record<string, { x: number, y: number, name: string, fullName: string }> = {
  maharashtra: { x: 420, y: 380, name: 'MH', fullName: 'Maharashtra' },
  gujarat: { x: 280, y: 320, name: 'GJ', fullName: 'Gujarat' },
  madhyaPradesh: { x: 400, y: 280, name: 'MP', fullName: 'Madhya Pradesh' },
  chhattisgarh: { x: 500, y: 320, name: 'CG', fullName: 'Chhattisgarh' },
  rajasthan: { x: 300, y: 220, name: 'RJ', fullName: 'Rajasthan' },
  telangana: { x: 440, y: 450, name: 'TG', fullName: 'Telangana' },
  tamilNadu: { x: 440, y: 560, name: 'TN', fullName: 'Tamil Nadu' }
};

const LLOYD_HQ = { x: 460, y: 360 };

interface IndiaMapProps {
  data: any; // Using any for flexibility with raw API data, ideally typed
  onStateClick: (stateKey: string) => void;
}

export function IndiaMap({ data, onStateClick }: IndiaMapProps) {
  // Map regions from API to coords
  const regionsMap = useMemo(() => {
    if (!data?.regions) return {};
    return data.regions.reduce((acc: any, region: any) => {
      acc[region.key] = region;
      return acc;
    }, {});
  }, [data]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl shadow-2xl p-4 overflow-hidden relative border border-slate-700">
      <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2 absolute top-4 left-4 z-10 bg-slate-900/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700">
        <MapPin className="w-4 h-4 text-red-500" />
        National Highway Logistics Network
      </h3>
      
      <svg viewBox="0 0 700 620" className="w-full h-full">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* India outline - Simplified SVG Path */}
        <path 
          d="M 300 100 L 350 80 L 400 90 L 450 100 L 480 120 L 500 150 L 520 200 L 530 250 L 530 300 L 520 350 L 500 400 L 480 450 L 460 500 L 440 540 L 420 570 L 400 590 L 380 600 L 360 595 L 340 585 L 320 570 L 310 550 L 305 530 L 310 510 L 320 490 L 330 470 L 340 450 L 350 430 L 360 410 L 370 390 L 380 370 L 390 350 L 395 330 L 390 310 L 380 290 L 370 270 L 360 250 L 350 230 L 340 210 L 330 190 L 320 170 L 310 150 L 300 130 L 300 100 Z"
          fill="#1e293b" 
          stroke="#475569" 
          strokeWidth="1.5" 
          opacity="0.6" 
          className="transition-opacity duration-1000"
        />

        {/* Highway routes */}
        {Object.entries(HIGHWAY_ROUTES).map(([key, routes]) => 
          routes.map((route, idx) => (
            <motion.path 
              key={`${key}-${idx}`} 
              d={route.path} 
              fill="none" 
              stroke={route.color} 
              strokeWidth="2.5" 
              opacity="0.8" 
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <animate attributeName="stroke-dasharray" from="0,8" to="8,0" dur="1s" repeatCount="indefinite" />
            </motion.path>
          ))
        )}

        {/* HQ Marker */}
        <g filter="url(#glow)">
          <circle cx={LLOYD_HQ.x} cy={LLOYD_HQ.y} r="15" fill="#dc2626" opacity="0.3">
            <animate attributeName="r" from="12" to="20" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx={LLOYD_HQ.x} cy={LLOYD_HQ.y} r="6" fill="#dc2626" stroke="#fff" strokeWidth="2" />
          <text x={LLOYD_HQ.x} y={LLOYD_HQ.y + 18} fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle" style={{ textShadow: '0 2px 4px black' }}>HQ</text>
        </g>

        {/* State Bubbles */}
        {Object.entries(STATE_COORDS).map(([key, state]) => {
          const info = regionsMap[key];
          if (!info || info.totalOrder === 0) return null;
          
          // Dynamic radius based on volume
          const r = info.totalOrder > 5000 ? 22 : info.totalOrder > 1000 ? 16 : 12;
          
          return (
            <g 
              key={key} 
              onClick={() => onStateClick(key)} 
              className="cursor-pointer hover:opacity-90 transition-opacity"
              filter="url(#glow)"
            >
              <circle cx={state.x} cy={state.y} r={r+4} fill="#3b82f6" opacity="0.2">
                <animate attributeName="r" from={r} to={r+6} dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={state.x} cy={state.y} r={r} fill="#3b82f6" stroke="#fff" strokeWidth="2" />
              <text x={state.x} y={state.y} fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle" dy="3">
                {Number(info.totalOrder).toFixed(0)}
              </text>
              <text x={state.x} y={state.y+r+12} fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle" style={{ textShadow: '0 2px 4px black' }}>
                {state.name}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(30, 540)">
          <rect width="180" height="65" fill="#0f172a" opacity="0.9" rx="8" stroke="#334155" />
          <text x="15" y="20" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="var(--font-display)">LEGEND</text>
          
          <circle cx="20" cy="35" r="4" fill="#dc2626" />
          <text x="35" y="38" fill="#cbd5e1" fontSize="9">Production HQ</text>
          
          <circle cx="20" cy="50" r="4" fill="#3b82f6" />
          <text x="35" y="53" fill="#cbd5e1" fontSize="9">Active Region</text>
          
          <line x1="100" y1="35" x2="120" y2="35" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
          <text x="130" y="38" fill="#cbd5e1" fontSize="9">NH Routes</text>
        </g>
      </svg>
    </div>
  );
}
