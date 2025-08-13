import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingRibbonProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingRibbon({ isVisible, message = "Processing..." }: LoadingRibbonProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute top-0 left-0 right-0 z-10">
      <div className="relative h-1 bg-gradient-to-r from-green-400/20 via-blue-500/20 to-purple-600/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 w-1/3 animate-loading-scroll" />
      </div>
      <div className="bg-gradient-to-r from-green-500/95 via-blue-600/95 to-purple-600/95 backdrop-blur-sm">
        <div className="px-6 py-2">
          <div className="flex items-center justify-center gap-3 text-white text-sm font-medium">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}