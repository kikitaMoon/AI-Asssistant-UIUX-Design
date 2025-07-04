
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Check } from 'lucide-react';

interface InfoCardProps {
  title: string;
  imageUrl: string;
  description: string;
  source?: string;
  sourceUrl?: string;
  dataType?: string;
  author?: string;
  authorUrl?: string;
  onAddData?: () => void;
  onSubscribe?: () => void;
  onAuthoritative?: () => void;
  showBadges?: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  imageUrl,
  description,
  source,
  sourceUrl,
  dataType = "Image Layer",
  author,
  authorUrl,
  onAddData,
  onSubscribe,
  onAuthoritative,
  showBadges = false
}) => {
  return (
    <Card className="bg-gray-800 border-gray-700 text-white max-w-2xl mx-auto">
      <CardContent className="p-0">
        <div className="flex">
          {/* Left side - Image */}
          <div className="w-48 h-32 flex-shrink-0 bg-gray-900 rounded-l-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Right side - Content */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {sourceUrl ? (
                  <a 
                    href={sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors underline"
                  >
                    {title}
                  </a>
                ) : (
                  title
                )}
              </h3>
              
              {(dataType || author) && (
                <div className="flex items-center gap-1 mb-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-sm flex items-center justify-center">
                    <span className="text-xs text-black font-bold">📷</span>
                  </div>
                  <span className="text-sm text-blue-400">
                    {dataType} by{' '}
                    {authorUrl ? (
                      <a 
                        href={authorUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-blue-300 underline"
                      >
                        {author}
                      </a>
                    ) : (
                      author
                    )}
                  </span>
                </div>
              )}
              
              <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
            </div>
            
            {/* Bottom actions */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-600">
              {showBadges && (
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-700 border-gray-600 text-gray-300"
                    onClick={onSubscribe}
                  >
                    <Heart className="w-3 h-3 mr-1" />
                    Subscribe
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-700 border-gray-600 text-gray-300"
                    onClick={onAuthoritative}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Authoritative
                  </Badge>
                </div>
              )}
              
              <Button
                onClick={onAddData}
                variant="outline"
                size="sm"
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500"
              >
                Add Data
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
