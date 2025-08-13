import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingRibbonProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingRibbon({ isVisible, message = "Processing..." }: LoadingRibbonProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-slide-in-down">
      <div className="relative h-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-loading-shimmer" />
      </div>
      <div className="bg-gradient-to-r from-green-500/90 via-blue-600/90 to-purple-600/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-3 text-white text-sm font-medium">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}