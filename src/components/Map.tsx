
import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHM0Z3UwejkwMXgwMmpwOWY5ZjJ0dXY3In0.O9pxg_OoVcjtFYbVSPVDcw';
    
    const selectedCityData = cities.find(city => city.id === selectedCity);
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

    return () => {
      delete (window as any).selectActivity;
      map.current?.remove();
    };
  }, [selectedCity, onActivitySelect]);

  return <div ref={mapContainer} className={className} />;
};

export default Map;
