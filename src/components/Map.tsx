
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cities } from '@/data/cities';
import { activities } from '@/data/activities';

interface MapProps {
  selectedCity?: string;
  onActivitySelect?: (activityId: string) => void;
  className?: string;
}

const Map = ({ selectedCity, onActivitySelect, className }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('pk.eyJ1IjoiYWhhaWRlciIsImEiOiJjbHQ1dWR4bjIwMm9lMmtueGd5c3Z3eTR0In0.cP-A_PTZIfEHTP_lU9i3Eg');

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    if (mapboxToken) {
      mapboxgl.accessToken = mapboxToken;
      
      const selectedCityData = cities.find(city => city.id === selectedCity);
      // Convert coordinates to the format required by Mapbox
      const center: [number, number] = selectedCityData 
        ? [selectedCityData.coordinates[1], selectedCityData.coordinates[0]] 
        : [10.8451, 33.8075];
      const zoom = selectedCityData ? 12 : 6;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add activity markers for selected city
      if (selectedCityData) {
        const cityActivities = activities.filter(activity => 
          activity.location.toLowerCase().includes(selectedCityData.name.toLowerCase())
        );

        cityActivities.forEach((activity) => {
          const el = document.createElement('div');
          el.className = 'activity-marker';
          el.style.width = '30px';
          el.style.height = '30px';
          el.style.borderRadius = '50%';
          el.style.cursor = 'pointer';
          el.style.backgroundSize = 'cover';
          el.style.backgroundImage = `url(${activity.image})`;
          el.style.border = '2px solid #3b82f6';

          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <img src="${activity.image}" alt="${activity.title}" class="w-full h-32 object-cover mb-2 rounded"/>
                <h3 class="font-bold">${activity.title}</h3>
                <p class="text-sm">${activity.description}</p>
                <p class="mt-2 font-bold">${activity.price}€</p>
                <button 
                  class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
                  onclick="window.selectActivity('${activity.id}')"
                >
                  Sélectionner
                </button>
              </div>
            `);

          const marker = new mapboxgl.Marker(el)
            .setLngLat([
              selectedCityData.coordinates[1] + (Math.random() - 0.5) * 0.1,
              selectedCityData.coordinates[0] + (Math.random() - 0.5) * 0.1
            ])
            .setPopup(popup)
            .addTo(map.current!);

          // Add click handler for activity selection
          el.addEventListener('click', () => {
            marker.togglePopup();
          });
        });

        // Add global function for activity selection
        (window as any).selectActivity = (activityId: string) => {
          if (onActivitySelect) {
            onActivitySelect(activityId);
          }
        };
      }
    }

    return () => {
      delete (window as any).selectActivity;
      map.current?.remove();
    };
  }, [selectedCity, onActivitySelect, mapboxToken]);

  // Allow custom token input if map doesn't load with default token
  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMapboxToken(e.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={mapContainer} className={`${className} relative flex-1`}></div>
      {!map.current && (
        <div className="mt-2 p-3 bg-yellow-100 rounded text-sm">
          <p className="mb-1">Si la carte ne s'affiche pas, veuillez entrer votre token Mapbox:</p>
          <input
            type="text"
            value={mapboxToken}
            onChange={handleTokenChange}
            className="w-full p-2 border rounded text-xs"
            placeholder="Entrez votre token Mapbox public"
          />
          <p className="mt-1 text-xs text-gray-600">
            Vous pouvez obtenir un token gratuit sur <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">mapbox.com</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Map;
