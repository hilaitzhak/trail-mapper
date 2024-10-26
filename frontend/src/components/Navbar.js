import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Search } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Map className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-xl font-semibold">Trail Mapper</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link 
              to="/search" 
              className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
            >
              <Search className="h-5 w-5" />
              <span className="ml-1">Search Trails</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;