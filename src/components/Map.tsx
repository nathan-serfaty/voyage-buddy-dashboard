import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cities } from '@/data/cities';
import { activities } from '@/data/activities';
import { Activity } from '@/types/activity';

interface MapProps {
  selectedCity?: string;
  onActivitySelect?: (activityId: string) => void;
  className?: string;
}

const Map = ({ selectedCity, onActivitySelect, className }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map if not already initialized
    if (!map.current) {
      const selectedCityData = cities.find(city => city.id === selectedCity);
      const center: [number, number] = selectedCityData 
        ? [selectedCityData.coordinates[0], selectedCityData.coordinates[1]] 
        : [33.8075, 10.8451];
      const zoom = selectedCityData ? 12 : 6;

      map.current = L.map(mapContainer.current).setView(center, zoom);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.current);

      // Add zoom controls
      map.current.zoomControl.setPosition('topright');
    }

    // Add activity markers for selected city
    if (selectedCity) {
      const selectedCityData = cities.find(city => city.id === selectedCity);
      if (selectedCityData) {
        const cityActivities = activities.filter(activity => 
          activity.location.toLowerCase().includes(selectedCityData.name.toLowerCase())
        );

        cityActivities.forEach((activity) => {
          // Create custom icon for marker
          const icon = L.divIcon({
            className: 'activity-marker',
            html: `<div style="
              width: 30px;
              height: 30px;
              border-radius: 50%;
              cursor: pointer;
              background-size: cover;
              background-image: url(${activity.image});
              border: 2px solid #3b82f6;
            "></div>`,
            iconSize: [30, 30]
          });

          // Create marker with popup
          const marker = L.marker(
            [
              selectedCityData.coordinates[0] + (Math.random() - 0.5) * 0.1,
              selectedCityData.coordinates[1] + (Math.random() - 0.5) * 0.1
            ],
            { icon }
          ).addTo(map.current!);

          // Add popup with activity details
          const popupContent = document.createElement('div');
          popupContent.className = 'p-2';
          popupContent.innerHTML = `
            <img src="${activity.image}" alt="${activity.title}" class="w-full h-32 object-cover mb-2 rounded"/>
            <h3 class="font-bold">${activity.title}</h3>
            <p class="text-sm">${activity.description}</p>
            <p class="mt-2 font-bold">${activity.price}€</p>
            <button 
              class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full select-activity-btn"
              data-activity-id="${activity.id}"
            >
              Sélectionner
            </button>
          `;

          // Add click handler for activity selection
          const selectButton = popupContent.querySelector('.select-activity-btn');
          selectButton?.addEventListener('click', () => {
            if (onActivitySelect) {
              onActivitySelect(activity.id);
            }
          });

          marker.bindPopup(popupContent);
        });
      }
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [selectedCity, onActivitySelect]);

  return (
    <div className={`${className} relative flex-1`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg"></div>
    </div>
  );
};

export default Map;
