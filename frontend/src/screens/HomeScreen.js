import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import { Mountain, Wind, MapPin, ThermometerSun } from 'lucide-react';
import { trailService } from '../services/trailService';

const HomeScreen = () => {

    const [featuredTrails, setFeaturedTrails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrails = async () => {
        try {
            const data = await trailService.getAllTrails();
            // Get first 5 trails for featured section
            setFeaturedTrails(data.features.slice(0, 5));
        } catch (error) {
            console.error('Error fetching trails:', error);
        }
        setLoading(false);
        };

        fetchTrails();
    }, []);

    return (
        <div className="flex flex-col" dir="rtl">
        {/* Hero Section */}
        <div className="relative bg-blue-600 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">מצא את המסלול המושלם עבורך</h1>
                <p className="text-xl mb-8">גלה מסלולי טיולים עם מידע מפורט ועדכוני מזג אוויר בזמן אמת</p>
                <Link 
                to="/search"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                התחל לחקור
                </Link>
            </div>
            </div>
        </div>

      {/* Map Preview with actual trails */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-2xl font-bold mb-6">מפת המסלולים</h2>
          <div className="h-[400px]">
            <MapComponent trails={featuredTrails} centered={true} />
          </div>
        </div>
      </div>

        {/* Features Section */}
        <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                <Mountain className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">מידע על המסלול</h3>
                <p className="text-gray-600">תיאורי מסלולים מפורטים, רמות קושי ומרחקים</p>
                </div>
                <div className="text-center p-6">
                <ThermometerSun className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">עדכוני מזג אוויר</h3>
                <p className="text-gray-600">תנאי מזג אוויר בזמן אמת לכל מיקום מסלול</p>
                </div>
                <div className="text-center p-6">
                <MapPin className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">איזורים</h3>
                <p className="text-gray-600">סנן מסלולים לפי איזור: השרון, ירושלים והסביבה, השפלה ועוד</p>
                </div>
            </div>
            </div>
        </div>

        {/* Featured Trails Section */}
        <div className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6 text-center">מסלולים מומלצים</h2>
            {loading ? (
                <div className="text-center">טוען מסלולים...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTrails.map(trail => (
                    <div key={trail.properties.id} className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold mb-2">{trail.properties.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Mountain className="h-4 w-4 ml-1" />
                        <span>{trail.properties.difficulty}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <Wind className="h-4 w-4 ml-1" />
                        <span>{trail.properties.area}</span>
                    </div>
                    <Link 
                        to={`/trail/${trail.properties.id}`}
                        className="mt-4 text-blue-600 hover:text-blue-700 block text-center"
                    >
                        לפרטים נוספים
                    </Link>
                    </div>
                ))}
                </div>
            )}
            </div>
        </div>

        {/* Call to Action */}
        <div className="bg-blue-600 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-4">מוכנים להתחיל?</h2>
            <p className="mb-6">גלה את המסלול הבא שלך עכשיו</p>
            <Link 
                to="/search"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
            >
                חפש מסלולים
            </Link>
            </div>
        </div>
        </div>
    );
};

export default HomeScreen;