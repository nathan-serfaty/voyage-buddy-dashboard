
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
    // Fix: Ensure coordinates are in the correct format [lng, lat]
    const center: [number, number] = selectedCityData 
      ? [selectedCityData.coordinates[1], selectedCityData.coordinates[0]] 
      : [10.8451, 33.8075]; // Default to Djerba coordinates
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
      // Fix: Ensure coordinates are in the correct format [lng, lat]
      const markerPosition: [number, number] = [city.coordinates[1], city.coordinates[0]];
      
      const marker = new mapboxgl.Marker({
        color: city.id === selectedCity ? '#ef4444' : '#3b82f6'
      })
        .setLngLat(markerPosition)
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
