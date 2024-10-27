// src/components/MapComponent.js
import React, { useEffect, useRef } from 'react';

const MapComponent = ({ trails = [], centered = false }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if it hasn't been created yet
    if (!mapInstance.current) {
      // Create vector source and layer for trails
      const vectorSource = new window.ol.source.Vector();
      const vectorLayer = new window.ol.layer.Vector({
        source: vectorSource,
        style: new window.ol.style.Style({
          stroke: new window.ol.style.Stroke({
            color: '#0066cc',
            width: 3
          })
        })
      });

      // Add OSM base layer
      const osmLayer = new window.ol.layer.Tile({
        source: new window.ol.source.OSM()
      });

      // Create map
      mapInstance.current = new window.ol.Map({
        target: mapRef.current,
        layers: [osmLayer, vectorLayer],
        view: new window.ol.View({
          center: window.ol.proj.fromLonLat([35.0, 31.5]), // Center of Israel
          zoom: 8
        })
      });
    }

    // Update trails on the map
    const vectorLayer = mapInstance.current.getLayers().getArray()[1];
    const vectorSource = vectorLayer.getSource();
    vectorSource.clear();

    if (trails.length > 0) {
      const validFeatures = trails
        .filter(trail => trail.geometry && trail.geometry.coordinates && trail.geometry.coordinates.length > 0)
        .map(trail => {
          try {
            const feature = new window.ol.Feature({
              geometry: new window.ol.geom.LineString(trail.geometry.coordinates)
                .transform('EPSG:4326', 'EPSG:3857'),
              properties: trail.properties
            });
            return feature;
          } catch (error) {
            console.warn('Error creating feature for trail:', trail.properties.id);
            return null;
          }
        })
        .filter(feature => feature !== null);

      if (validFeatures.length > 0) {
        vectorSource.addFeatures(validFeatures);

        // If centered is true, fit the view to show all trails
        if (centered) {
          const extent = vectorSource.getExtent();
          mapInstance.current.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            maxZoom: 15
          });
        }
      }
    }

    return () => {
      if (mapInstance.current) {
        // Clean up when component unmounts
        mapInstance.current.setTarget(undefined);
        mapInstance.current = null;
      }
    };
  }, [trails, centered]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-lg border border-gray-200" />
  );
};

export default MapComponent;