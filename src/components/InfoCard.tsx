
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MoreHorizontal } from 'lucide-react';

interface InfoCardProps {
  title: string;
  imageUrl: string;
  description: string;
  source?: string;
  onSubscribe?: () => void;
  onAuthoritative?: () => void;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  imageUrl,
  description,
  source,
  onSubscribe,
  onAuthoritative
}) => {
  return (
    <Card className="bg-gray-800 border-gray-700 text-white max-w-2xl mx-auto">
      <CardContent className="p-0">
        <div className="flex">
          {/* Left side - Image */}
          <div className="w-48 h-32 flex-shrink-0">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          
          {/* Right side - Content */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              
              {source && (
                <div className="flex items-center gap-1 mb-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-sm flex items-center justify-center">
                    <span className="text-xs text-black font-bold">📷</span>
                  </div>
                  <span className="text-sm text-blue-400">{source}</span>
                </div>
              )}
              
              <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
            </div>
            
            {/* Bottom actions */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-600">
              <div className="flex items-center gap-4">
                <button
                  onClick={onSubscribe}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <span className="text-xs">♡</span>
                  <span>Subscribe</span>
                </button>
                
                <button
                  onClick={onAuthoritative}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <span className="text-xs">✓</span>
                  <span>Authoritative</span>
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                  <Star className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
