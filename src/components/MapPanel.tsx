
import React, { useEffect, useRef, useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MapPanel: React.FC<MapPanelProps> = ({ isOpen, onToggle }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !isOpen) return;

    // Initialize map with a demo token (users should replace with their own)
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGVtbyIsImEiOiJjbGVjcDQ4Y2ExMmR3M3VvM2RlM2MwenQifQ.demo-token-replace-with-yours';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-74.006, 40.7128], // New York City
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Create a popup
    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      maxWidth: '300px',
    }).setHTML(`
      <div class="p-4">
        <img 
          src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop" 
          alt="Location" 
          class="w-full h-32 object-cover rounded-lg mb-3"
        />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Central Park</h3>
        <p class="text-sm text-gray-600">
          A beautiful urban park in Manhattan, perfect for relaxation and outdoor activities. 
          This iconic location offers stunning views and peaceful walking paths.
        </p>
      </div>
    `);

    // Add a marker with popup
    const marker = new mapboxgl.Marker({
      color: '#3B82F6'
    })
      .setLngLat([-73.9665, 40.7812])
      .setPopup(popup)
      .addTo(map.current);

    // Show popup on marker click
    marker.getElement().addEventListener('click', () => {
      popup.addTo(map.current!);
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [isOpen]);

  // Resize map when panel size changes
  useEffect(() => {
    if (map.current && isOpen) {
      setTimeout(() => {
        map.current?.resize();
      }, 300);
    }
  }, [isOpen, isFullscreen]);

  if (!isOpen) return null;

  return (
    <div className={`
      fixed right-0 top-0 h-full bg-white border-l border-gray-300 shadow-lg z-50 transition-all duration-300
      ${isFullscreen ? 'w-full' : 'w-96'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">Map</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-gray-600" />
            ) : (
              <Maximize2 className="w-4 h-4 text-gray-600" />
            )}
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Close map"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-full">
        <div ref={mapContainer} className="w-full h-full" />
        
        {/* Demo Token Notice */}
        <div className="absolute bottom-4 left-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-sm">
          <p className="text-yellow-800">
            <strong>Demo Map:</strong> Replace the mapbox token in MapPanel.tsx with your own Mapbox public token from{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
