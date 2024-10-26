import React, { useEffect, useRef } from 'react';

const MapComponent = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Wait for QGIS resources to load
    const initializeMap = () => {
      if (window.ol) {
        // Your existing map initialization code from QGIS
        const map = new window.ol.Map({
          target: mapRef.current,
          layers: window.layersList, // This should be defined in your QGIS layers.js
          view: new window.ol.View({
            maxZoom: 28,
            minZoom: 1
          })
        });
        
        // Add any additional map configuration from your QGIS setup
      }
    };

    // Initialize map once resources are loaded
    if (window.ol) {
      initializeMap();
    } else {
      // Wait for OpenLayers to load
      window.addEventListener('load', initializeMap);
    }

    return () => {
      window.removeEventListener('load', initializeMap);
    };
  }, []);

  return <div ref={mapRef} id="map" className="w-full h-full" />;
};

export default MapComponent;