
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cities } from '@/data/cities';

interface MapProps {
  selectedCity?: string;
  className?: string;
}

const Map = ({ selectedCity, className }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHM0Z3UwejkwMXgwMmpwOWY5ZjJ0dXY3In0.O9pxg_OoVcjtFYbVSPVDcw';
    
    const selectedCityData = cities.find(city => city.id === selectedCity);
    const center = selectedCityData ? selectedCityData.coordinates : [9.5375, 33.8869];
    const zoom = selectedCityData ? 12 : 6;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for cities
    cities.forEach((city) => {
      const marker = new mapboxgl.Marker({
        color: city.id === selectedCity ? '#ef4444' : '#3b82f6'
      })
        .setLngLat(city.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <h3 class="font-bold">${city.name}</h3>
          <p>${city.description}</p>
        `))
        .addTo(map.current!);

      if (city.id === selectedCity) {
        marker.togglePopup();
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [selectedCity]);

  return <div ref={mapContainer} className={className} />;
};

export default Map;
