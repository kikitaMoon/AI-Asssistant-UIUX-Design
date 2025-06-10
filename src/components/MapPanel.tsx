
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapPanelProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const MapPanel = ({ isExpanded, onToggle }: MapPanelProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !isExpanded) return;

    // For demo purposes, using a placeholder token
    // In production, this should come from environment variables
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGVtbyIsImEiOiJjbGV2ZW5kZGVtbyJ9.demo';
    
    // Initialize map with error handling for missing token
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-74.0066, 40.7135], // New York City
        zoom: 12,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Create a popup
      popup.current = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px'
      });

      // Create a marker with popup
      const marker = new mapboxgl.Marker({
        color: '#3b82f6'
      })
        .setLngLat([-74.0066, 40.7135])
        .addTo(map.current);

      // Add click event to marker
      marker.getElement().addEventListener('click', () => {
        if (!popup.current || !map.current) return;

        const popupContent = `
          <div class="p-4">
            <img 
              src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=280&h=160&fit=crop&crop=center" 
              alt="Location" 
              class="w-full h-32 object-cover rounded-lg mb-3"
            />
            <h3 class="font-semibold text-lg mb-2 text-gray-800">Times Square</h3>
            <p class="text-sm text-gray-600 mb-2">
              The bustling heart of New York City, known for its bright lights, Broadway theaters, and constant energy.
            </p>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <MapPin class="w-3 h-3" />
              <span>Manhattan, NY 10036</span>
            </div>
          </div>
        `;

        popup.current
          .setLngLat([-74.0066, 40.7135])
          .setHTML(popupContent)
          .addTo(map.current!);
      });

    } catch (error) {
      console.warn('Mapbox token not configured. Using fallback static map.');
      
      // Fallback: Create a static map representation
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `
          <div class="w-full h-full bg-gray-100 flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50"></div>
            <div class="relative z-10 text-center">
              <div class="mb-4">
                <Map class="w-16 h-16 mx-auto text-blue-500 mb-2" />
                <h3 class="text-lg font-semibold text-gray-700">Interactive Map</h3>
                <p class="text-sm text-gray-500">Demo map view</p>
              </div>
              <div class="absolute top-20 left-1/2 transform -translate-x-1/2">
                <button class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors" id="demo-marker">
                  <MapPin class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        `;

        // Add click handler for demo marker
        const demoMarker = mapContainer.current.querySelector('#demo-marker');
        if (demoMarker) {
          demoMarker.addEventListener('click', () => {
            // Create demo popup
            const existingPopup = mapContainer.current?.querySelector('.demo-popup');
            if (existingPopup) {
              existingPopup.remove();
              return;
            }

            const popupDiv = document.createElement('div');
            popupDiv.className = 'demo-popup absolute top-32 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border z-20 w-72';
            popupDiv.innerHTML = `
              <div class="p-4">
                <img 
                  src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=280&h=160&fit=crop&crop=center" 
                  alt="Location" 
                  class="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 class="font-semibold text-lg mb-2 text-gray-800">Times Square</h3>
                <p class="text-sm text-gray-600 mb-2">
                  The bustling heart of New York City, known for its bright lights, Broadway theaters, and constant energy.
                </p>
                <div class="flex items-center gap-2 text-xs text-gray-500">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>Manhattan, NY 10036</span>
                </div>
                <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            `;
            mapContainer.current?.appendChild(popupDiv);
          });
        }
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [isExpanded]);

  return (
    <div className={`h-full bg-gray-900 border-l border-gray-700 transition-all duration-300 ${
      isExpanded ? 'w-96' : 'w-12'
    }`}>
      {/* Toggle Button */}
      <div className="h-full flex flex-col">
        <div className="p-2 border-b border-gray-700">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="w-full text-gray-400 hover:text-white hover:bg-gray-700"
            title={isExpanded ? "Collapse Map" : "Expand Map"}
          >
            {isExpanded ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Map Content */}
        {isExpanded && (
          <div className="flex-1 flex flex-col">
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4 text-blue-400" />
                <h3 className="text-white font-medium text-sm">Map View</h3>
              </div>
            </div>
            <div className="flex-1">
              <div ref={mapContainer} className="w-full h-full" />
            </div>
          </div>
        )}

        {/* Collapsed State */}
        {!isExpanded && (
          <div className="flex-1 flex items-center justify-center">
            <Map className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};
