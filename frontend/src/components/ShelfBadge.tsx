import React from 'react';
import { MapPin } from 'lucide-react';
import { ShelfLocation } from '../types/library';

interface ShelfBadgeProps {
  location: ShelfLocation;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const ShelfBadge: React.FC<ShelfBadgeProps> = ({
  location,
  size = 'md',
  showDetails = false,
}) => {
  if (size === 'sm') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
        <MapPin className="w-3 h-3 text-indigo-500" />
        <span>F{location.floor} • {location.rack}</span>
      </span>
    );
  }

  return (
    <div className={`rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/80 p-2.5 ${showDetails ? 'shadow-sm' : ''}`}>
      <div className="flex items-start gap-2">
        <div className="p-1.5 bg-blue-600 text-white rounded-md mt-0.5 shadow-sm">
          <MapPin className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">Physical Shelf Location</span>
            <span className="text-xs font-mono text-slate-500 bg-white/80 px-1.5 py-0.5 rounded border border-blue-100">{location.callNumber}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-700 font-medium">
            <span className="bg-white px-2 py-0.5 rounded shadow-2xs border border-slate-200">Floor {location.floor}</span>
            <span className="text-slate-400">•</span>
            <span className="bg-white px-2 py-0.5 rounded shadow-2xs border border-slate-200">{location.wing}</span>
            <span className="text-slate-400">•</span>
            <span className="bg-white px-2 py-0.5 rounded shadow-2xs border border-slate-200 text-indigo-700 font-semibold">{location.rack}</span>
            <span className="text-slate-400">•</span>
            <span className="bg-white px-2 py-0.5 rounded shadow-2xs border border-slate-200 text-slate-600">{location.shelfNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
