import React from 'react';
import MapComponent from './MapComponent';

const TrailMapper = () => {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Trail Mapper</h1>
      </header>
      <main className="flex-1">
        <MapComponent />
      </main>
    </div>
  );
};

export default TrailMapper;